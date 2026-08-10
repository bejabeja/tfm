import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RichText from "../../components/RichText";
import "./Legal.scss";

const LAST_UPDATED = "29 May 2025";

const Terms = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Terms of Service - ToBeATraveller";
    window.scrollTo(0, 0);
    return () => { document.title = "ToBeATraveller"; };
  }, []);

  const lt = (key, vars) => t(`legalTerms.${key}`, vars);

  return (
    <div className="legal section__container">
      <div className="legal__header">
        <h1 className="legal__title">{lt("documentTitle")}</h1>
        <p className="legal__meta">{lt("lastUpdated", { date: LAST_UPDATED })}</p>
      </div>

      <div className="legal__body">
        <Section title={lt("s1Title")}>
          {lt("s1Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s2Title")}>
          {lt("s2Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s3Title")}>
          <ul>
            {lt("s3Items", { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>

        <Section title={lt("s4Title")}>
          {lt("s4Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
          <p>{lt("s4Warrant")}</p>
          <ul>
            {lt("s4Items", { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>

        <Section title={lt("s5Title")}>
          <p>{lt("s5Intro")}</p>
          <ul>
            {lt("s5Items", { returnObjects: true }).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Section>

        <Section title={lt("s6Title")}>
          <p><RichText text={lt("s6Body")} /></p>
        </Section>

        <Section title={lt("s7Title")}>
          <p><RichText text={lt("s7Body")} /></p>
        </Section>

        <Section title={lt("s8Title")}>
          {lt("s8Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s9Title")}>
          {lt("s9Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s10Title")}>
          {lt("s10Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s11Title")}>
          {lt("s11Body", { returnObjects: true }).map((p, i) => <p key={i}>{p}</p>)}
        </Section>

        <Section title={lt("s12Title")}>
          <p>{lt("s12Body")}</p>
        </Section>

        <Section title={lt("s13Title")}>
          <p>{lt("s13Body")}</p>
        </Section>

        <Section title={lt("s14Title")}>
          <p><RichText text={lt("s14Body")} /></p>
        </Section>
      </div>

      <div className="legal__footer">
        <Link to="/privacy-policy" className="legal__link">{lt("footerPrivacyLink")}</Link>
        <Link to="/" className="btn btn--secondary">{lt("footerBackHome")}</Link>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section className="legal__section">
    <h2 className="legal__section-title">{title}</h2>
    <div className="legal__section-body">{children}</div>
  </section>
);

export default Terms;
