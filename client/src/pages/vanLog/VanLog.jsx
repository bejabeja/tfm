import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoAddOutline, IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { vanLogCategories } from "@tobeatraveller/shared";
import Modal from "../../components/modal/Modal";
import { deleteVanLogEntry, getVanLogEntries, getVanLogStats } from "../../services/vanLogs";
import VanLogFormModal from "./VanLogFormModal";
import "./VanLog.scss";

const VanLog = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([getVanLogEntries(), getVanLogStats()])
      .then(([entriesRes, statsRes]) => {
        setEntries(entriesRes);
        setStats(statsRes);
        setError(null);
      })
      .catch((err) => setError(err.message || "An error occurred"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => { setEditingEntry(null); setFormOpen(true); };
  const openEdit = (entry) => { setEditingEntry(entry); setFormOpen(true); };
  const closeForm = () => setFormOpen(false);

  const handleSaved = () => {
    closeForm();
    loadData();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteVanLogEntry(deletingId);
      toast.success(t("vanLog.deleted"));
      setDeletingId(null);
      loadData();
    } catch (err) {
      toast.error(err.message || t("vanLog.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const categoryLabel = (value) => {
    const fallback = vanLogCategories.find(c => c.value === value)?.label ?? value;
    return t(`vanLog.category.${value}`, fallback);
  };

  if (error) {
    return (
      <section className="section__container">
        <p className="error-message">{t("vanLog.errorMsg")}</p>
      </section>
    );
  }

  const categoryTotals = stats?.byCategory.filter((c) => c.total > 0) ?? [];

  return (
    <section className="van-log section__container">
      <div className="van-log__header">
        <h1 className="van-log__title">{t("vanLog.title")}</h1>
        <button type="button" className="btn btn--primary" onClick={openCreate}>
          <IoAddOutline /> {t("vanLog.addEntry")}
        </button>
      </div>

      {stats && (
        <div className="van-log__stats">
          <div className="van-log__stat van-log__stat--total">
            <span>{t("vanLog.totalSpent")}</span>
            <strong>{stats.totalAmount.toFixed(2)}</strong>
          </div>
          {categoryTotals.map((c) => (
            <div key={c.category} className="van-log__stat">
              <span>{categoryLabel(c.category)}</span>
              <strong>{c.total.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="van-log__list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton van-log__entry-skeleton" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="van-log__empty">
          <p>{t("vanLog.noEntries")}</p>
        </div>
      ) : (
        <div className="van-log__list">
          {entries.map((entry) => (
            <div key={entry.id} className="van-log__entry">
              <div className="van-log__entry-main">
                <div className="van-log__entry-top">
                  <span className="van-log__entry-category">{categoryLabel(entry.category)}</span>
                  <span className="van-log__entry-date">{entry.entryDate?.slice(0, 10)}</span>
                </div>
                {entry.title && <p className="van-log__entry-title">{entry.title}</p>}
                {entry.location?.name && (
                  <p className="van-log__entry-location">
                    {entry.location.name}{entry.location.country ? `, ${entry.location.country}` : ""}
                  </p>
                )}
                {entry.notes && <p className="van-log__entry-notes">{entry.notes}</p>}
              </div>
              <div className="van-log__entry-side">
                {entry.amount != null && (
                  <strong className="van-log__entry-amount">
                    {entry.amount.toFixed(2)} {entry.currency || ""}
                  </strong>
                )}
                <div className="van-log__entry-actions">
                  <button type="button" onClick={() => openEdit(entry)} aria-label={t("common.edit")}>
                    <IoPencilOutline />
                  </button>
                  <button type="button" onClick={() => setDeletingId(entry.id)} aria-label={t("common.delete")}>
                    <IoTrashOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <VanLogFormModal entry={editingEntry} onClose={closeForm} onSaved={handleSaved} />
      )}

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title={t("vanLog.deleteConfirmTitle")}
        description={t("vanLog.deleteConfirmDesc")}
        type="danger"
        loading={deleting}
      />
    </section>
  );
};

export default VanLog;
