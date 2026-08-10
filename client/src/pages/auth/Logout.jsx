import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/modal/Modal";
import { logoutUser } from "../../store/auth/authActions.js";

const Logout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      isOpen
      onClose={() => navigate(-1)}
      onConfirm={() => {
        dispatch(logoutUser());
        navigate("/");
      }}
      title={t("auth.confirmLogoutTitle")}
      description={t("auth.confirmLogoutDesc")}
      confirmText={t("auth.logout")}
      type="danger"
    />
  );
};

export default Logout;
