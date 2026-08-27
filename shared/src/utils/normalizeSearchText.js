// Strips accents/diacritics so search matches regardless of whether the user
// types them (e.g. "camara" should match "Cámara").
const DIACRITICS = /[̀-ͯ]/g;

export const normalizeSearchText = (text) =>
    (text ?? "").toLowerCase().normalize("NFD").replace(DIACRITICS, "");
