import { buildRejectionEmail } from "..";

describe("emails", () => {
  it("buildRejectionEmail populates the template with the given context", () => {
    const { subject, html } = buildRejectionEmail({
      firstName: "Tracy",
      position: "Product Designer",
      term: "Fall 2026",
    });

    expect(subject).toBe("Your UW Blueprint Fall 2026 Application");
    expect(html).toContain("Hi Tracy,");
    expect(html).toContain("<strong>Product Designer</strong>");
    expect(html).toContain("Fall 2026 term");
    expect(html).not.toContain("{{");
  });
});
