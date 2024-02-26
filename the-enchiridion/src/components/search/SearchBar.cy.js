import React from 'react'
import { SearchBar } from './SearchBar'
import fixture from '../../../cypress/fixtures/search.json'

describe('<SearchBar />', () => {
  it('renders', () => {
    const searchResults = fixture
    cy.intercept('GET', '/series?q=Adventure%20Time', { fixture: 'search.json' }).as('search')
    cy.mount(<SearchBar />)
    cy.get('input').should('exist').type('Adventure Time')
    cy.wait('@search')
    cy.get('.card-search-result').should('exist')
  });

  it('renders an error message if the search fails', () => {
    cy.intercept('GET', '/series?q=Adventure%20Time', { statusCode: 500, body: {"error": "TMDB took too long to respond"} }).as('search')
    cy.mount(<SearchBar />)
    cy.get('input').should('exist').type('Adventure Time')
    cy.wait('@search')
    cy.get('h1').should('contain', 'TMDB failed to respond')
  });
})