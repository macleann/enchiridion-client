import React from 'react';
import { Episodes } from './Episodes';
import { isMobile } from '../../utils/useScreenSize';

describe('<Episodes />', () => {
    it('renders the episodes', () => {
        const seasonNumber = 1;
        const route = `/search/1/season/${seasonNumber}`;
        const path = `/search/:resultId/season/:seasonNumber`;
        const episodes = [
            {
                id: 1,
                name: 'Episode 1',
                overview: 'This is the first episode',
                still_path: '/episode1.jpg',
                episode_number: 1
            },
            {
                id: 2,
                name: 'Episode 2',
                overview: 'This is the second episode',
                still_path: '/episode2.jpg',
                episode_number: 2
            }
        ];

        window.history.pushState({}, null, route);
        cy.mount(<Episodes episodes={episodes} isMobile={isMobile} />, { initialEntries: [route], path: path });

        cy.get('h3').should('contain', 'Episode 1');
        cy.get('h3').should('contain', 'Episode 2');
        cy.get('.card').should('have.length', 2);
        cy.get('.card').first().click();
        cy.url().should('include', '/episode/1');
    });
});