import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import FeatureLoadState from "../../components/featureLoadState/FeatureLoadState";
import Modal from "../../components/modal/Modal";
import Spinner from "../../components/spinner/Spinner";
import useDebouncedEffect from "../../hooks/useDebounced";
import { deleteUserById, getAllUsersForAdmin, updateUserRole } from "../../services/users";
import { selectAuthUser } from "../../store/auth/authSelectors";
import { selectMe } from "../../store/user/userInfoSelectors";
import "./InternalUsers.scss";

const PAGE_SIZE = 20;
const ASSIGNABLE_ROLES = ["user", "admin", "superadmin"];

const InternalUsers = () => {
  const { t } = useTranslation();
  const authUser = useSelector(selectAuthUser);
  const meDetail = useSelector(selectMe);
  const currentUserId = (meDetail ?? authUser)?.id;

  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  // { kind: "delete" | "grantSuperadmin", user, newRole? }
  const [pendingAction, setPendingAction] = useState(null);
  const [confirmingAction, setConfirmingAction] = useState(false);

  const loadUsers = (targetPage = 1, name = searchName, sort = sortBy) => {
    setLoading(true);
    getAllUsersForAdmin({ searchName: name, page: targetPage, limit: PAGE_SIZE, sortBy: sort })
      .then((res) => {
        setUsers(res.users);
        setPage(res.currentPage);
        setTotalPages(res.totalPages);
        setError(null);
      })
      .catch(() => setError("error"))
      .finally(() => setLoading(false));
  };

  useDebouncedEffect(() => loadUsers(1, searchName, sortBy), [searchName, sortBy], 400);

  const applyRoleChange = async (user, newRole) => {
    setUpdatingRoleId(user.id);
    try {
      await updateUserRole(user.id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      toast.success(t("admin.roleUpdated"));
    } catch (err) {
      toast.error(err.message || t("admin.roleUpdateError"));
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleRoleChange = (user, newRole) => {
    if (newRole === user.role) return;
    if (newRole === "superadmin") {
      setPendingAction({ kind: "grantSuperadmin", user, newRole });
      return;
    }
    applyRoleChange(user, newRole);
  };

  const confirmPendingAction = async () => {
    setConfirmingAction(true);
    try {
      if (pendingAction.kind === "delete") {
        await deleteUserById(pendingAction.user.id);
        toast.success(t("admin.userDeleted"));
        loadUsers(page);
      } else {
        await applyRoleChange(pendingAction.user, pendingAction.newRole);
      }
      setPendingAction(null);
    } catch (err) {
      toast.error(err.message || t("admin.deleteError"));
    } finally {
      setConfirmingAction(false);
    }
  };

  if (error) {
    return <FeatureLoadState status={error} onRetry={() => loadUsers(page)} />;
  }

  const modalCopy = pendingAction?.kind === "delete"
    ? {
        title: t("admin.deleteConfirmTitle"),
        description: t("admin.deleteConfirmDesc", { username: pendingAction.user.username }),
      }
    : pendingAction
    ? {
        title: t("admin.grantSuperadminTitle"),
        description: t("admin.grantSuperadminDesc", { username: pendingAction.user.username }),
      }
    : null;

  return (
    <section className="internal-users">
      <div className="internal-users__header">
        <input
          type="text"
          className="internal-users__search"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder={t("community.searchPlaceholder")}
        />
        <select
          className="internal-users__sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="username">{t("community.sortAZ")}</option>
          <option value="newest">{t("admin.sortNewest")}</option>
          <option value="itineraries">{t("community.sortMostItineraries")}</option>
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : users.length === 0 ? (
        <p className="internal-users__empty">{t("admin.noUsers")}</p>
      ) : (
        <div className="internal-users__list">
          {users.map((user) => {
            const roleOptions = ASSIGNABLE_ROLES.includes(user.role)
              ? ASSIGNABLE_ROLES
              : [user.role, ...ASSIGNABLE_ROLES];

            return (
              <div key={user.id} className="internal-users__row">
                <img className="internal-users__avatar" src={user.avatarUrl} alt="" />
                <div className="internal-users__info">
                  <span className="internal-users__username">
                    {user.username}
                    {user.isPremium ? ` · ${t("admin.premium")}` : ""}
                  </span>
                  <span className="internal-users__meta">{user.email}</span>
                  <span className="internal-users__meta">
                    {t("admin.joined", { date: new Date(user.createdAt).toLocaleDateString() })}
                    {" · "}
                    {t("admin.itinerariesCount", { count: user.totalItineraries })}
                  </span>
                </div>
                <select
                  className="internal-users__role-select"
                  value={user.role}
                  disabled={user.id === currentUserId || updatingRoleId === user.id}
                  onChange={(e) => handleRoleChange(user, e.target.value)}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="internal-users__delete"
                  onClick={() => setPendingAction({ kind: "delete", user })}
                  disabled={user.id === currentUserId}
                  aria-label={t("common.delete")}
                >
                  <IoTrashOutline />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="internal-users__pagination">
          <button type="button" disabled={page <= 1} onClick={() => loadUsers(page - 1)}>
            {t("admin.previous")}
          </button>
          <span>{t("admin.pageOf", { page, totalPages })}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => loadUsers(page + 1)}>
            {t("admin.next")}
          </button>
        </div>
      )}

      <Modal
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={confirmPendingAction}
        title={modalCopy?.title}
        description={modalCopy?.description}
        type="danger"
        loading={confirmingAction}
      />
    </section>
  );
};

export default InternalUsers;
