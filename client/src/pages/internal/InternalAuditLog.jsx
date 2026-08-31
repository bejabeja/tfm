import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FeatureLoadState from "../../components/featureLoadState/FeatureLoadState";
import Spinner from "../../components/spinner/Spinner";
import { getRecentAuditLog } from "../../services/auditLog";
import "./InternalAuditLog.scss";

const describeEntry = (entry, t) => {
  if (entry.action === "delete_user") {
    return t("admin.auditDeleteUser", {
      actor: entry.actorUsername,
      target: entry.targetUsername,
    });
  }
  if (entry.action === "update_role") {
    return t("admin.auditUpdateRole", {
      actor: entry.actorUsername,
      target: entry.targetUsername,
      previousRole: entry.metadata?.previousRole,
      newRole: entry.metadata?.newRole,
    });
  }
  return entry.action;
};

const InternalAuditLog = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEntries = () => {
    setLoading(true);
    getRecentAuditLog()
      .then((res) => { setEntries(res); setError(null); })
      .catch(() => setError("error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEntries(); }, []);

  if (loading) return <Spinner />;
  if (error) return <FeatureLoadState status={error} onRetry={loadEntries} />;

  return (
    <section className="internal-audit-log">
      {entries.length === 0 ? (
        <p className="internal-audit-log__empty">{t("admin.auditNoEntries")}</p>
      ) : (
        <ul className="internal-audit-log__list">
          {entries.map((entry) => (
            <li key={entry.id} className="internal-audit-log__row">
              <span className="internal-audit-log__description">{describeEntry(entry, t)}</span>
              <span className="internal-audit-log__date">{new Date(entry.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default InternalAuditLog;
