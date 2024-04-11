import React from 'react';
import { Hero } from './Hero';

describe('<Hero />', () => {
    it('renders', () => {
        cy.mount(<Hero />);
        cy.get('h1').should('contain', 'Welcome to The Enchiridion');
        cy.get('a').should('have.length', 2);
    });

    it('renders with user', () => {
        cy.login();
        cy.mount(<Hero />);
        cy.get('h1').should('contain', 'Welcome back, 1!');
        cy.get('p').should('contain', 'Your playlists are just a click away.');
        cy.logout();
    });

    it('navigates to login', () => {
        cy.mount(<Hero />);
        cy.get('a').contains('Sign in').click();
        cy.url().should('contain', '/login');
    });

    it('navigates to register', () => {
        cy.mount(<Hero />);
        cy.get('a').contains('Register').click();
        cy.url().should('contain', '/register');
    });
});
