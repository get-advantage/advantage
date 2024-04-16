describe("template spec", () => {
    it("should verify that integration config is run", () => {
        cy.viewport(1000, 600);
        // Adjust the URL to match your local development environment's URL structure
        cy.visit("http://localhost:8000/tests/topscroll-integration-test.html");

        // Check for exactly two <advantage-wrapper> elements
        cy.get("advantage-wrapper").should("have.length", 1);

        cy.get("advantage-wrapper").should("have.css", "margin-left", "-116px");
    });
});
