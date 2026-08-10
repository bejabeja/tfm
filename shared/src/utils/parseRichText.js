// Some locale strings embed <strong> and <a href="..."> markup so both web and
// mobile can render bold text and links from the same translation, without web
// needing react-i18next's Trans component matched to each call site.
const TAG_SPLIT = /(<strong>.*?<\/strong>|<a href="[^"]*">.*?<\/a>)/gs;
const STRONG_MATCH = /^<strong>(.*)<\/strong>$/s;
const LINK_MATCH = /^<a href="([^"]*)">(.*)<\/a>$/s;

export const parseRichText = (text) => text.split(TAG_SPLIT).filter(Boolean).map((part) => {
    const strongMatch = part.match(STRONG_MATCH);
    if (strongMatch) return { type: 'bold', text: strongMatch[1] };
    const linkMatch = part.match(LINK_MATCH);
    if (linkMatch) return { type: 'link', href: linkMatch[1], text: linkMatch[2] };
    return { type: 'text', text: part };
});
