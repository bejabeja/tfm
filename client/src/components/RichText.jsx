import { Link } from "react-router-dom";
import { parseRichText } from "@tobeatraveller/shared";

const isInternal = (href) => href.startsWith("/");
const isExternal = (href) => href.startsWith("http");

const RichText = ({ text }) => (
  <>
    {parseRichText(text).map((part, i) => {
      if (part.type === "bold") return <strong key={i}>{part.text}</strong>;
      if (part.type === "link") {
        if (isInternal(part.href)) return <Link key={i} to={part.href}>{part.text}</Link>;
        if (isExternal(part.href)) {
          return (
            <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
              {part.text}
            </a>
          );
        }
        return <a key={i} href={part.href}>{part.text}</a>;
      }
      return part.text;
    })}
  </>
);

export default RichText;
