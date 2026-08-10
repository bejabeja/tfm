import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { sendContact } from "@tobeatraveller/shared";
import { contactSchema } from "../../utils/schemasValidation";
import "./Legal.scss";
import "./Contact.scss";
const CONTACT_EMAIL = "tobeatravellercompany@gmail.com";

const Contact = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t("contact.title")} - ToBeATraveller`;
    window.scrollTo(0, 0);
    return () => { document.title = "ToBeATraveller"; };
  }, [t]);

  const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const result = contactSchema.safeParse(fields);
    if (result.success) {
      setErrors({});
      return true;
    }
    const e = {};
    for (const issue of result.error.issues) {
      e[issue.path[0]] = issue.message;
    }
    setErrors(e);
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await sendContact(fields);
      setStatus("success");
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="legal section__container">
      <div className="legal__header">
        <h1 className="legal__title">{t("contact.title")}</h1>
        <p className="legal__meta">{t("contact.subtitle")}</p>
      </div>

      <div className="contact">
        {status === "success" ? (
          <div className="contact__success">
            <span className="contact__success-icon" aria-hidden="true">✓</span>
            <h2>{t("contact.sent")}</h2>
            <p>{t("contact.sentDesc")}</p>
            <button
              className="btn btn--secondary"
              onClick={() => setStatus("idle")}
            >
              {t("contact.sendAnother")}
            </button>
          </div>
        ) : (
          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="contact__row">
              <Field label={t("contact.yourName")} error={errors.name}>
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder")}
                  autoComplete="name"
                />
              </Field>
              <Field label={t("contact.yourEmail")} error={errors.email}>
                <input
                  type="email"
                  name="email"
                  value={fields.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder")}
                  autoComplete="email"
                />
              </Field>
            </div>

            <Field label={t("contact.subject")} error={errors.subject}>
              <input
                type="text"
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                placeholder={t("contact.subjectPlaceholder")}
              />
            </Field>

            <Field label={t("contact.message")} error={errors.message}>
              <textarea
                name="message"
                value={fields.message}
                onChange={handleChange}
                placeholder={t("contact.messagePlaceholder")}
                rows={6}
              />
            </Field>

            {status === "error" && (
              <p className="contact__error">
                {t("contact.errorMsg")}{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            )}

            <div className="contact__actions">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={status === "sending"}
              >
                {status === "sending" ? t("contact.sending") : t("contact.send")}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="legal__footer">
        <span />
        <Link to="/" className="btn btn--secondary">{t("contact.backToHome")}</Link>
      </div>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div className={`contact__field${error ? " contact__field--error" : ""}`}>
    <label className="contact__label">{label}</label>
    {children}
    {error && <span className="contact__field-error">{error}</span>}
  </div>
);

export default Contact;
