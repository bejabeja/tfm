import geoip from 'geoip-lite';

export const countryCodeFromIp = (ip) => {
    if (!ip) return null;
    return geoip.lookup(ip)?.country ?? null;
};
