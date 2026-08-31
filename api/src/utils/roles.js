export const ROLES = Object.freeze({
    USER: 'user',
    ADMIN: 'admin',
    SUPERADMIN: 'superadmin',
});

// Internal-dashboard access: kept as one list so requirePremium's staff
// bypass and the requireRole(...) calls that gate /internal never drift apart.
export const STAFF_ROLES = Object.freeze([ROLES.ADMIN, ROLES.SUPERADMIN]);
