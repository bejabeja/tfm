import { getApiUrl } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import { parseError } from '../utils/parseError';

const base = () => `${getApiUrl()}/audit-log`;

export const getRecentAuditLog = async (limit = 50) => {
    const res = await authFetch(`${base()}?limit=${limit}`);
    if (!res.ok) await parseError(res, 'Failed to fetch audit log');
    return res.json();
};
