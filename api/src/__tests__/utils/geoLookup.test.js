import { describe, it, expect } from 'vitest';
import { countryCodeFromIp } from '../../utils/geoLookup.js';

describe('countryCodeFromIp()', () => {
    it('resolves a well-known public IP to its country code', async () => {
        // Google Public DNS, geolocated to the US in every geoip-lite build.
        expect(await countryCodeFromIp('8.8.8.8')).toBe('US');
    });

    it('returns null for a private/local IP with no geo data', async () => {
        expect(await countryCodeFromIp('127.0.0.1')).toBeNull();
    });

    it('returns null when no IP is given, without loading the geoip dataset', async () => {
        expect(await countryCodeFromIp(undefined)).toBeNull();
        expect(await countryCodeFromIp(null)).toBeNull();
    });
});
