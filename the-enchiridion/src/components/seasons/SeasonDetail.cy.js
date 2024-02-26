import React from 'react'
import { SeasonDetail } from './SeasonDetail'
import searchDetailFixture from '../../../cypress/fixtures/searchDetail.json'
import seasonDetailFixture from '../../../cypress/fixtures/seasonDetail.json'

describe('<SeasonDetail />', () => {
  it('renders', () => {
    const searchDetail = searchDetailFixture
    const seasonDetail = seasonDetailFixture
    const route = `/search/${searchDetail.id}/season/${searchDetail.seasons[1].season_number}`
    const path = `/search/:resultId/season/:seasonNumber`
    cy.intercept('GET', `/seasons/${searchDetail.seasons[1].season_number}?series_id=${searchDetail.id}`, {statusCode: 200, body: seasonDetail}).as('season')
    window.history.pushState({}, null, route)
    cy.mount(<SeasonDetail />, {initialEntries: [route], path: path})

    cy.wait('@season')
    cy.get('h2').should('contain', seasonDetail.name)
    cy.get('img').should('exist')
  })

  it('renders an error message if the season is not found', () => {
    const searchDetail = searchDetailFixture
    const route = `/search/${searchDetail.id}/season/100`
    const path = `/search/:resultId/season/:seasonNumber`
    cy.intercept('GET', `/seasons/100?series_id=${searchDetail.id}`, {statusCode: 404, body: {error: 'Season not found'}}).as('season')
    window.history.pushState({}, null, route)
    cy.mount(<SeasonDetail />, {initialEntries: [route], path: path})

    cy.wait('@season')
    cy.get('h1').should('contain', 'TMDB failed to respond')
  })

  it('links back to the show', () => {
    const searchDetail = searchDetailFixture
    const seasonDetail = seasonDetailFixture
    const route = `/search/${searchDetail.id}/season/${searchDetail.seasons[1].season_number}`
    const path = `/search/:resultId/season/:seasonNumber`
    cy.intercept('GET', `/seasons/${searchDetail.seasons[1].season_number}?series_id=${searchDetail.id}`, {statusCode: 200, body: seasonDetail}).as('season')
    window.history.pushState({}, null, route)
    cy.mount(<SeasonDetail />, {initialEntries: [route], path: path})

    cy.wait('@season')
    cy.get('#link-to-search').should('contain', 'Back to show').click()
    cy.url().should('contain', `/search/${searchDetail.id}`)
  })
})