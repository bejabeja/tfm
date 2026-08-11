import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword, translateAuthError } from "@tobeatraveller/shared";
import { PasswordInputForm } from "../../components/form/PasswordInputForm";
import SubmitButton from "../../components/form/SubmitButton";
import { resetPasswordSchema } from "../../utils/schemasValidation";
import "./Auth.scss";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (!token) {
    return (
      <section className="auth">
        <div className="auth__panel" style={{ width: "100%" }}>
          <div className="auth__form" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-color)", marginBottom: "1rem" }}>
              {t("errors.invalidLink")}
            </p>
            <Link to="/forgot-password">
              <strong>{t("auth.requestNewLink")} →</strong>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const onSubmit = async ({ newPassword }) => {
    setServerError(null);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (error) {
      setServerError(error.message || t("errors.somethingWrong"));
    }
  };

  return (
    <section className="auth">
      <div className="auth__panel" style={{ width: "100%" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="auth__form">
          <Link to="/" className="auth__form-logo">
            <img src="/logo.svg" alt="ToBeATraveller" height="28" />
          </Link>

          <div className="auth__form-header">
            <h1 className="auth__form-title">{t("auth.setNewPassword")}</h1>
            <p className="auth__form-subtitle">{t("auth.setNewPasswordSubtitle")}</p>
          </div>

          {success ? (
            <div style={{ padding: "1rem 0" }}>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-color)", marginBottom: "0.75rem" }}>
                {t("auth.passwordUpdated")}
              </p>
              <div className="auth__form-link" style={{ paddingTop: "0.75rem" }}>
                <Link to="/login">
                  <strong>{t("auth.signIn")} →</strong>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <PasswordInputForm
                name="newPassword"
                label={t("auth.newPasswordLabel")}
                control={control}
                error={errors.newPassword}
                autoComplete="new-password"
                hint={t("errors.passwordMin")}
              />
              <PasswordInputForm
                name="confirmPassword"
                label={t("auth.confirmNewPasswordLabel")}
                control={control}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <div className="auth__form-error" role="alert" aria-live="assertive">
                {serverError ? (
                  <>
                    {translateAuthError(t, serverError)}{" "}
                    <Link to="/forgot-password" style={{ color: "var(--primary-color)", fontWeight: 600 }}>
                      {t("auth.requestNewLink")}
                    </Link>
                    .
                  </>
                ) : (
                  " "
                )}
              </div>

              <SubmitButton label={t("auth.updatePassword")} loading={isSubmitting} />

              <div className="auth__form-link" style={{ paddingTop: "0.75rem" }}>
                <Link to="/login">{t("auth.backToLogin")}</Link>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
