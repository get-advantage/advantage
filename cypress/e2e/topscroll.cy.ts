describe("template spec", () => {
    it("should find two <advantage-wrapper> elements on the page", () => {
        cy.viewport(1000, 600);
        // Adjust the URL to match your local development environment's URL structure
        cy.visit("http://localhost:8000/tests/topscroll-test.html");

        // Check for exactly two <advantage-wrapper> elements
        cy.get("advantage-wrapper").should("have.length", 1);

        cy.get("advantage-wrapper").should("have.css", "width", "1000px");
        cy.get("advantage-wrapper").should("have.css", "height", "480px");

        cy.get("advantage-wrapper")
            .shadow()
            .find("#container")
            .should("have.css", "width", "1000px");
        cy.get("advantage-wrapper")
            .shadow()
            .find("#container")
            .should("have.css", "position", "absolute");
        cy.get("advantage-wrapper")
            .shadow()
            .find("#container")
            .should("have.css", "clip-path", "inset(0px)");
        cy.get("advantage-wrapper")
            .shadow()
            .find("#ad-slot")
            .should("have.css", "position", "fixed");

        // Navigate through shadow roots to reach the close button
        cy.get("advantage-wrapper")
            .shadow()
            .find("advantage-ui-layer")
            .shadow()
            .find("#close")
            .click();

        cy.wait(1000);

        // Check if advantage-wrapper is set to display: none
        cy.get("advantage-wrapper").should("have.css", "display", "none");
    });

    it("should scroll the page when downArrow is clicked", () => {
        cy.viewport(1000, 1200);
        cy.visit("http://localhost:8000/tests/topscroll-test.html");

        // Verify downArrow exists
        cy.get("advantage-wrapper")
            .shadow()
            .find("advantage-ui-layer")
            .shadow()
            .find("#down-arrow")
            .should("exist");

        // Check initial scroll position
        cy.window().its("scrollY").should("equal", 0);

        // Click the downArrow
        cy.get("advantage-wrapper")
            .shadow()
            .find("advantage-ui-layer")
            .shadow()
            .find("#down-arrow")
            .click();

        // Verify page has scrolled down (using Cypress's built-in retry logic)
        cy.window().its("scrollY").should("be.greaterThan", 0);
    });
});
