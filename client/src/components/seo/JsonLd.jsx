// data can embed user-generated content (itinerary titles, bios); escaping "<" prevents
// a value like "</script><script>..." from breaking out of this script tag.
const JsonLd = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);

export default JsonLd;
