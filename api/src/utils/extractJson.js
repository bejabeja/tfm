// Groq's reasoning models (e.g. openai/gpt-oss-120b) occasionally leak their chain-of-thought
// into the response's `content` field instead of keeping it in a separate `reasoning` field,
// even when explicitly told to output nothing but JSON (known Groq bug, see their community forum).
// A naive "first { to last }" regex would swallow that leaked prose, and markdown code fences
// around the JSON break a naive "parse everything from here to the end" approach too. Instead,
// for every "{" in the text, scan forward with brace-depth tracking (skipping over quoted
// strings, so braces inside a place's description don't throw off the count) to find that
// object's exact matching closing brace, then try to parse just that span. Leaked prose before
// or after the real JSON is never included, since only the true top-level object's own span is
// ever handed to JSON.parse.
export const extractJsonObject = (text) => {
    if (!text) return null;

    for (let i = 0; i < text.length; i++) {
        if (text[i] !== '{') continue;

        const end = findMatchingBraceEnd(text, i);
        if (end === -1) continue;

        const candidate = text.slice(i, end + 1);
        try {
            JSON.parse(candidate);
            return candidate;
        } catch {
            continue;
        }
    }

    return null;
};

const findMatchingBraceEnd = (text, start) => {
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
        const char = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === '"') {
                inString = false;
            }
            continue;
        }

        if (char === '"') {
            inString = true;
        } else if (char === '{') {
            depth++;
        } else if (char === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }

    return -1;
};
