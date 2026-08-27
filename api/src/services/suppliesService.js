import { AuthError } from '../errors/AuthError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

// Wraps a freshly-typed note with the quantity it came with (e.g. "2x for the pie"),
// so once several contributions of the same item get merged together, each one's
// context survives instead of the later merge silently overwriting the earlier note.
const formatNoteSegment = (amount, notes) => (notes ? `${amount}x ${notes}` : null);

// Appends one already-formatted notes block onto another. Used when merging two
// items that may each already carry a multi-segment note from earlier merges,
// so blocks are concatenated as-is rather than re-wrapped with another amount prefix.
const appendNotes = (existingNotes, incomingNotes) => {
    if (!incomingNotes) return existingNotes;
    return existingNotes ? `${existingNotes}, ${incomingNotes}` : incomingNotes;
};

export class SuppliesService {
    constructor(inventoryRepository, shoppingListRepository) {
        this.inventoryRepository = inventoryRepository;
        this.shoppingListRepository = shoppingListRepository;
    }

    // ─── Shopping list ──────────────────────────────────────────────────
    async getShoppingList(userId) {
        const items = await this.shoppingListRepository.findByUserId(userId);
        return items.map(item => item.toDTO());
    }

    // Adding an item that's already on the list (same name + unit) sums into it
    // instead of creating a duplicate row, mirroring how a purchase merges into inventory.
    async addShoppingListItem(data, userId) {
        const existing = await this.shoppingListRepository.findByNameAndUnit(userId, data.name, data.unit);
        const incomingNotes = formatNoteSegment(data.amount, data.notes);

        const item = existing
            ? await this.shoppingListRepository.update(existing.id, {
                name: existing.name,
                category: existing.category,
                amount: existing.amount + data.amount,
                unit: existing.unit,
                notes: appendNotes(existing.notes, incomingNotes),
            })
            : await this.shoppingListRepository.create({ ...data, userId, notes: incomingNotes });
        return item.toDTO();
    }

    async updateShoppingListItem(id, data, userId) {
        const item = await this._getOwnedShoppingListItem(id, userId);
        const updated = await this.shoppingListRepository.update(item.id, data);
        return updated.toDTO();
    }

    async deleteShoppingListItem(id, userId) {
        await this._getOwnedShoppingListItem(id, userId);
        await this.shoppingListRepository.delete(id);
    }

    // Buying an item merges it into inventory: adds to the matching item's amount
    // (same name + unit) if one already exists, otherwise creates a new one.
    // purchasedAmount lets the store not have as much as was planned (e.g. only 3 of
    // the 6 apples on the list): the bought portion moves to inventory, the rest
    // stays on the shopping list instead of disappearing.
    async markPurchased(id, userId, purchasedAmount) {
        const item = await this._getOwnedShoppingListItem(id, userId);
        const boughtAmount = purchasedAmount != null ? purchasedAmount : item.amount;

        const existing = await this.inventoryRepository.findByNameAndUnit(userId, item.name, item.unit);
        const inventoryItem = existing
            ? await this.inventoryRepository.update(existing.id, {
                name: existing.name,
                category: existing.category,
                amount: existing.amount + boughtAmount,
                unit: existing.unit,
                notes: appendNotes(existing.notes, item.notes),
            })
            : await this.inventoryRepository.create({
                userId, name: item.name, category: item.category, amount: boughtAmount,
                unit: item.unit, notes: item.notes,
            });

        const remaining = item.amount - boughtAmount;
        if (remaining > 0) {
            await this.shoppingListRepository.update(id, {
                name: item.name, category: item.category, amount: remaining, unit: item.unit, notes: item.notes,
            });
        } else {
            await this.shoppingListRepository.delete(id);
        }

        return inventoryItem.toDTO();
    }

    // ─── Inventory ──────────────────────────────────────────────────────
    async getInventory(userId) {
        const items = await this.inventoryRepository.findByUserId(userId);
        return items.map(item => item.toDTO());
    }

    async updateInventoryItem(id, data, userId) {
        const item = await this._getOwnedInventoryItem(id, userId);
        const updated = await this.inventoryRepository.update(item.id, data);
        return updated.toDTO();
    }

    async deleteInventoryItem(id, userId) {
        await this._getOwnedInventoryItem(id, userId);
        await this.inventoryRepository.delete(id);
    }

    // Running out doesn't just delete the item: it moves back to the shopping list,
    // merging into an existing list entry for the same name + unit if there is one.
    async markUsedUp(id, userId) {
        const item = await this._getOwnedInventoryItem(id, userId);

        const existing = await this.shoppingListRepository.findByNameAndUnit(userId, item.name, item.unit);
        const shoppingListItem = existing
            ? await this.shoppingListRepository.update(existing.id, {
                name: existing.name,
                category: existing.category,
                amount: existing.amount + item.amount,
                unit: existing.unit,
                notes: appendNotes(existing.notes, item.notes),
            })
            : await this.shoppingListRepository.create({
                userId, name: item.name, category: item.category, amount: item.amount, unit: item.unit, notes: item.notes,
            });

        await this.inventoryRepository.delete(id);
        return shoppingListItem.toDTO();
    }

    // ─── Ownership guards ───────────────────────────────────────────────
    async _getOwnedShoppingListItem(id, userId) {
        const item = await this.shoppingListRepository.findById(id);
        if (!item) throw new NotFoundError("Shopping list item not found");
        if (item.userId !== userId) throw new AuthError();
        return item;
    }

    async _getOwnedInventoryItem(id, userId) {
        const item = await this.inventoryRepository.findById(id);
        if (!item) throw new NotFoundError("Inventory item not found");
        if (item.userId !== userId) throw new AuthError();
        return item;
    }
}
