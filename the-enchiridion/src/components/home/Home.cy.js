import React from 'react';
import { Home } from './Home';
import fixture from '../../../cypress/fixtures/playlists.json';

describe('<Home />', () => {
    it('renders', () => {
        cy.intercept('GET', '/playlists', { statusCode: 200, body: fixture})
        cy.intercept('GET', '/playlists?trending=true&days=7', { statusCode: 200, body: fixture})
        cy.mount(<Home />);

        cy.get('h2').should('contain', 'Trending Playlists');
        cy.get('h2').should('contain', 'Most Liked Playlists');
        cy.get('.scrolling-wrapper').should('have.length', 2);
    });
});