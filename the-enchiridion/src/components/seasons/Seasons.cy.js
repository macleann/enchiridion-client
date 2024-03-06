import React from 'react'
import { Seasons } from './Seasons'
import seasonsFixture from '../../../cypress/fixtures/seasons.json'
import searchDetailFixture from '../../../cypress/fixtures/searchDetail.json'

describe('<Seasons />', () => {
  it('renders', () => {
    const seasons = seasonsFixture
    cy.mount(<Seasons seasons={seasons} />)
    cy.get('h1').should('contain', 'Seasons')
    cy.get('.card').should('have.length', seasons.length)
  })

  it('renders an error message if the seasons are not found', () => {
    cy.mount(<Seasons seasons={[]} />)
    cy.get('h1').should('contain', 'No seasons found')
  })

  it('links to the season detail', () => {
    const searchDetail = searchDetailFixture
    const seasons = seasonsFixture
    const route = `/search/${searchDetail.id}`
    const path = `/search/:resultId`
    window.history.pushState({}, null, route)
    cy.mount(<Seasons seasons={seasons} />, {initialEntries: [route], path: path})

    cy.get(`#season-${seasons[1].season_number}-link`).should('contain', seasons[1].name).click()
    cy.url().should('contain', `/search/${searchDetail.id}/season/${seasons[1].season_number}`)
  })
})