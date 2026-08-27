// geoip-lite parses its whole multi-megabyte dataset into memory synchronously
// at import time. Loading it lazily keeps that cost off every serverless cold
// start and only pays it the first time a signup actually needs a lookup.
let geoipPromise;
const loadGeoip = () => (geoipPromise ??= import('geoip-lite'));

export const countryCodeFromIp = async (ip) => {
    if (!ip) return null;
    const { default: geoip } = await loadGeoip();
    return geoip.lookup(ip)?.country ?? null;
};
