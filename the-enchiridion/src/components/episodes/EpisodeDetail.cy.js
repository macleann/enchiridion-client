import React from 'react'
import { EpisodeDetail } from './EpisodeDetail'
import fixture from '../../../cypress/fixtures/episode.json'

describe('<EpisodeDetail />', () => {
  it('renders from search slug', () => {
    const searchId = 15260
    const seasonNumber = 1
    const episodeNumber = 1
    const route = `/search/${searchId}/season/${seasonNumber}/episode/${episodeNumber}`
    const path = `/search/:resultId/season/:seasonNumber/episode/:episodeNumber`
    cy.intercept('GET', '/episodes/tmdb_single_episode?series_id=15260&season_number=1&episode_number=1', { statusCode: 200, body: fixture }).as('episode')

    window.history.pushState({}, null, route)
    // Use the custom mount command defined in support/component.js
    cy.mount(<EpisodeDetail />, { initialEntries: [route], path: path })
    
    cy.wait('@episode')
    cy.get('#episodeTitle').should('contain', fixture.name)
    cy.get('img').should('have.attr', 'alt', `A still from ${fixture.name}`)
    cy.contains(`${fixture.overview}`)
  })

  it('renders from playlist slug', () => {
    const playlistId = 1
    const episodeId = 1
    const route = `/playlists/${playlistId}/episode/${episodeId}`
    const path = `/playlists/:playlistId/episode/:episodeId`
    cy.intercept('GET', '/episodes/1', { statusCode: 200, body: fixture }).as('episode')

    window.history.pushState({}, null, route)
    cy.mount(<EpisodeDetail />, { initialEntries: [route], path: path })
    
    cy.wait('@episode')
    cy.get('#episodeTitle').should('contain', fixture.name)
    cy.get('img').should('have.attr', 'alt', `A still from ${fixture.name}`)
    cy.contains(`${fixture.overview}`)
  })
})