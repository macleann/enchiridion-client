import React from 'react';
import { Hero } from './Hero';

describe('<Hero />', () => {
    it('renders', () => {
        cy.mount(<Hero />);

        cy.get('h1').should('contain', 'Welcome to The Enchiridion');
        cy.get('p').should('contain', 'Discover and create your own TV playlists!');
    });
});