import React from 'react'
import { SearchDetail } from './SearchDetail'
import fixture from '../../../cypress/fixtures/searchDetail.json'

describe('<SearchDetail />', () => {
  it('renders', () => {
    const searchResult = fixture
    const route = `/search/${searchResult.id}`
    const path = `/search/:resultId`
    cy.intercept('GET', `/series/${searchResult.id}`, {statusCode: 200, body: searchResult}).as('search')
    window.history.pushState({}, null, route)
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SearchDetail />, {initialEntries: [route], path: path})

    cy.wait('@search')
    cy.get('h2').should('contain', searchResult.name)
  });

  it('renders an error message if the search fails', () => {
    const route = '/search/100'
    const path = '/search/:resultId'
    cy.intercept('GET', '/series/100', {statusCode: 404, body: {error: 'Result not found'}}).as('search')
    window.history.pushState({}, null, route)
    cy.mount(<SearchDetail />, {initialEntries: [route], path: path})

    cy.wait('@search')
    cy.get('h1').should('contain', 'TMDB failed to respond')
  });
})