import { render } from "@testing-library/react";
import JsonLd from "./JsonLd.jsx";

describe("JsonLd", () => {
  it("renders a script[type=application/ld+json] with the serialized data", () => {
    const data = { "@context": "https://schema.org", "@type": "TouristTrip", name: "Kyoto \"trip\"" };
    const { container } = render(<JsonLd data={data} />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script.textContent)).toEqual(data);
  });

  it("neutralizes user-generated content that tries to break out of the script tag", () => {
    const data = { name: 'Trip</script><script>alert(1)</script>' };
    const { container } = render(<JsonLd data={data} />);

    expect(container.innerHTML).not.toContain("</script><script>alert(1)");
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(JSON.parse(script.textContent)).toEqual(data);
  });
});
