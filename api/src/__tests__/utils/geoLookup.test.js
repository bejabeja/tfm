import { describe, it, expect } from 'vitest';
import { countryCodeFromIp } from '../../utils/geoLookup.js';

describe('countryCodeFromIp()', () => {
    it('resolves a well-known public IP to its country code', () => {
        // Google Public DNS, geolocated to the US in every geoip-lite build.
        expect(countryCodeFromIp('8.8.8.8')).toBe('US');
    });

    it('returns null for a private/local IP with no geo data', () => {
        expect(countryCodeFromIp('127.0.0.1')).toBeNull();
    });

    it('returns null when no IP is given', () => {
        expect(countryCodeFromIp(undefined)).toBeNull();
        expect(countryCodeFromIp(null)).toBeNull();
    });
});
