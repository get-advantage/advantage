describe("template spec", () => {
    it("should find two <advantage-wrapper> elements on the page", () => {
        // Adjust the URL to match your local development environment's URL structure
        cy.visit("http://localhost:8000/tests/wrapper-helper-test.html");

        // Check for exactly two <advantage-wrapper> elements
        cy.get("advantage-wrapper").should("have.length", 2);
    });
});
