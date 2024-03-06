import React from "react";
import { Register } from "./Register";

describe("Register Component", () => {
    it("Should render the Register component and handle form submission", () => {
        // Mount the component inside a Router and wrap it with Provider
        cy.mount(<Register />);
    
        // Check if the Register form is rendered
        cy.get("form").should("exist");
    
        // Fill in the form fields
        cy.get("#username").type("testuser");
        cy.get("#firstName").type("Test");
        cy.get("#lastName").type("User");
        cy.get("#email").type("testUser@email.com");
        cy.get("#password").type("password");

        // Spy and stub the response
        cy.intercept("POST", "/register", {
            statusCode: 200,
            body: {
                id: 1,
                valid: true,
            },
        });
        // Submit the form
        cy.get('button[type="submit"]').click();
        // Check state after form submission
        cy.window().its("store").invoke("getState").its("auth").its("isLoggedIn").should("eq", true);
        cy.window().its("store").invoke("getState").its("auth").its("userData").its("id").should("eq", 1);
    });

    it("Should redirect to the login page", () => {
        cy.mount(<Register />);

        cy.get('a[href="/login"]').click();
        cy.url().should("include", "/login");
    });

    it("Should enable the submit button when the input fields are filled", () => {
        cy.mount(<Register />);
        cy.get('button[type="submit"]').should("be.disabled");

        cy.get("#username").type("testuser");
        cy.get("#firstName").type("Test");
        cy.get("#lastName").type("User");
        cy.get("#email").type("testUser@email.com");
        cy.get("#password").type("password");
        cy.get('button[type="submit"]').should("not.be.disabled");
    });

    it("Should show an error message when the registration fails", () => {
        cy.mount(<Register />);
        cy.intercept("POST", "/register", {
            statusCode: 400,
            body: {"valid": false},
        });
        cy.get("#username").type("testuser");
        cy.get("#firstName").type("Test");
        cy.get("#lastName").type("User");
        cy.get("#email").type("testUser@email.com");
        cy.get("#password").type("password");
        cy.get('button[type="submit"]').click();
        // Check if there's a window alert that should exist
        cy.window().its("store").invoke("getState").its("snackbar").its("message").should("eq", "An error occurred while registering");
    });

    it("Should focus on the input field when clicked", () => {
        cy.mount(<Register />);
        cy.get("#firstName").focus();
        cy.get("#firstName").should("have.focus");
        // Should have the focused tailwind class applied
        cy.get(".input-label").should("have.class", "transform -translate-y-[1.15rem] scale-[0.8] text-primary");
    });


});