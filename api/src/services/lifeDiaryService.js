import { AuthError } from '../errors/AuthError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const CLOUDINARY_FOLDER = 'life-diary';

export class LifeDiaryService {
    constructor(lifeDiaryRepository, cloudinaryService) {
        this.lifeDiaryRepository = lifeDiaryRepository;
        this.cloudinaryService = cloudinaryService;
    }

    async createEntry(data, files, userId) {
        const entry = await this.lifeDiaryRepository.create({ ...data, userId });
        await this._addImages(entry, files ?? []);
        return entry.toDTO();
    }

    async getEntriesByUser(userId) {
        const entries = await this.lifeDiaryRepository.findByUserId(userId);
        const images = await this.lifeDiaryRepository.getImagesByEntryIds(entries.map(entry => entry.id));
        const imagesByEntryId = images.reduce((acc, image) => {
            (acc[image.entryId] ??= []).push(image);
            return acc;
        }, {});
        entries.forEach(entry => { entry.images = imagesByEntryId[entry.id] ?? []; });
        return entries.map(entry => entry.toDTO());
    }

    async updateEntry(id, data, files, userId) {
        const entry = await this._getOwnedEntry(id, userId);

        const currentImages = await this.lifeDiaryRepository.getImagesByEntryIds([entry.id]);
        const keepImageIds = new Set(data.keepImageIds || []);
        for (const image of currentImages) {
            if (!keepImageIds.has(image.id)) {
                if (image.photoPublicId) {
                    await this.cloudinaryService.deleteImage(image.photoPublicId);
                }
                await this.lifeDiaryRepository.unlinkImage(entry.id, image.id);
            }
        }

        await this._addImages(entry, files ?? [], keepImageIds.size);

        const updated = await this.lifeDiaryRepository.update(entry.id, data);
        updated.images = await this.lifeDiaryRepository.getImagesByEntryIds([entry.id]);
        return updated.toDTO();
    }

    async deleteEntry(id, userId) {
        const entry = await this._getOwnedEntry(id, userId);

        const images = await this.lifeDiaryRepository.getImagesByEntryIds([entry.id]);
        for (const image of images) {
            if (image.photoPublicId) {
                await this.cloudinaryService.deleteImage(image.photoPublicId);
            }
        }

        await this.lifeDiaryRepository.delete(id);
    }

    async _addImages(entry, files, startIndex = 0) {
        for (let i = 0; i < files.length; i++) {
            const result = await this.cloudinaryService.uploadImageFromBuffer(files[i].buffer, CLOUDINARY_FOLDER);
            const image = await this.lifeDiaryRepository.linkImage(entry.id, result.secure_url, result.public_id, startIndex + i);
            entry.addImage(image);
        }
    }

    async _getOwnedEntry(id, userId) {
        const entry = await this.lifeDiaryRepository.findById(id);
        if (!entry) {
            throw new NotFoundError("Life diary entry not found");
        }
        if (entry.userId !== userId) {
            throw new AuthError();
        }
        return entry;
    }
}
