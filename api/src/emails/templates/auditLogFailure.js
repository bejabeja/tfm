import { layout } from '../layout.js';

const MUTED = '#6b7280';
const DANGER = '#dc2626';

export const auditLogFailureTemplate = ({ action, errorMessage, occurredAt }) => ({
    subject: 'Audit log write failed',
    html: layout({
        title: 'Audit log write failed',
        preheader: 'A write to the audit trail failed and needs attention',
        content: `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
            <tr>
              <td>
                <h1 style="margin:0 0 10px;font-size:24px;font-weight:800;color:${DANGER};line-height:1.2;">
                  Audit log write failed
                </h1>
                <p style="margin:0;font-size:15px;color:${MUTED};line-height:1.6;">
                  An attempt to record the audit event <strong>${action}</strong> did not reach the database.
                  This event is missing from the audit trail.
                </p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:28px;">
            <tr>
              <td style="background-color:#f8fafc;border-radius:10px;padding:24px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#374151;">
                  Details
                </p>
                <p style="margin:0 0 4px;font-size:14px;color:${MUTED};">Occurred at: ${occurredAt}</p>
                <p style="margin:0;font-size:14px;color:${MUTED};word-break:break-word;">${errorMessage}</p>
              </td>
            </tr>
          </table>
        `,
        footerNote: `You're getting this because you're a superadmin: the audit trail is a GDPR accountability requirement, so a write failure needs prompt attention. Check Sentry for the full stack trace.`,
    }),
});
