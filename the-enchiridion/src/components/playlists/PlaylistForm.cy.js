import React from "react";
import { PlaylistForm } from "./PlaylistForm";
import playlistFixture from "../../../cypress/fixtures/playlists.json";
import searchFixture from "../../../cypress/fixtures/search.json";
import seasonsFixture from "../../../cypress/fixtures/seasons.json";
import seasonFixture from "../../../cypress/fixtures/seasonDetail.json";

describe("<PlaylistForm />", () => {
    function dragEpisodeToTarget (source, target) {
        cy.get(`#${source.id}-drag-handle`).drag(`#${target.id}`)
      }

    it("renders", () => {
        cy.mount(<PlaylistForm />);
        cy.get("form").should("exist");
        cy.get("h1").should("contain", "Create Playlist");
        cy.get("#name").should("exist");
        cy.get("#description").should("exist");
        cy.get("#search").should("exist");
        cy.get("#season").should("be.hidden");
        cy.get("#episode").should("be.hidden");
        cy.get("#save-playlist").should("contain", "Save Playlist");
        cy.get('#save-playlist').should('be.disabled')
    });

    it("renders with a playlist if editing", () => {
        const playlist = playlistFixture[0];
        const route = `/playlists/${playlist.id}/edit`;
        const path = `/playlists/:playlistId/edit`;

        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistForm playlist={playlist} />, { initialEntries: [route], path: path });
        cy.get("h1").should("contain", "Edit Playlist");
        cy.get("#name").should("have.value", playlist.name);
        cy.get("#description").should("have.value", playlist.description);
        cy.get("#search").should("exist");
        cy.get("#season").should("be.hidden");
        cy.get("#episode").should("be.hidden");
        // A <div> with an id matching each episode's id should exist
        for (const episode of playlist.episodes) {
            cy.get(`#${episode.id}`).should("exist");
        }
        cy.get("#save-playlist").should("contain", "Save Playlist");
        cy.get('#save-playlist').should('not.be.disabled')
    });

    it("can create a new playlist", () => {
        const searchResult = searchFixture[0];
        const season = seasonsFixture[1];
        const episodes = seasonFixture.episodes;

        cy.login();
        cy.intercept("GET", "/series?q=adventure%20time", { statusCode: 200, body: searchFixture }).as("search");
        cy.intercept("GET", "/seasons?series_id=15260", { statusCode: 200, body: seasonsFixture }).as("seasons");
        cy.intercept("GET", "/seasons/1?series_id=15260", { statusCode: 200, body: seasonFixture }).as("episodes");
        cy.intercept("POST", "/playlists", { statusCode: 201, body: {
            id: 1,
            name: "Test Playlist",
            description: "A playlist of the first 4 episodes of Adventure Time",
            user_id: 1,
            series_id: searchResult.id,
            season_id: season.id,
            episodes: episodes.slice(0, 4),
        } }).as("createPlaylist");
        cy.mount(<PlaylistForm />);
        cy.get("#name").type("Test Playlist");
        cy.get("#description").type("A playlist of the first 4 episodes of Adventure Time");
        cy.get("#search").type("adventure time");
        cy.get("#show").select(searchResult.id.toString());
        cy.get("#season").should("exist").select(season.id.toString());
        // Select the first four episodes
        for (let i = 0; i < 4; i++) {
            cy.get("#episode").should("exist").select(episodes[i].id.toString());
        }
        cy.get("#save-playlist").should("contain", "Save Playlist").click();
        cy.url().should("contain", "/playlists");
    });

    it("can edit a playlist", () => {
        const playlist = playlistFixture[0];
        const searchResult = searchFixture[0];
        const season = seasonsFixture[1];
        const episodes = seasonFixture.episodes;
        const route = `/playlists/${playlist.id}/edit`;
        const path = `/playlists/:playlistId/edit`;

        cy.login();
        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        cy.intercept("GET", "/series?q=adventure%20time", { statusCode: 200, body: searchFixture }).as("search");
        cy.intercept("GET", "/seasons?series_id=15260", { statusCode: 200, body: seasonsFixture }).as("seasons");
        cy.intercept("GET", "/seasons/1?series_id=15260", { statusCode: 200, body: seasonFixture }).as("episodes");
        cy.intercept("PUT", `/playlists/${playlist.id}`, { statusCode: 200, body: {
            id: playlist.id,
            name: "Test Playlist",
            description: "A playlist of the first 4 episodes of Adventure Time",
            user_id: 1,
            series_id: searchResult.id,
            season_id: season.id,
            episodes: episodes.slice(0, 4),
        } }).as("updatePlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistForm playlist={playlist} />, { initialEntries: [route], path: path });
        cy.get("#name").clear().type("Test Playlist");
        cy.get("#description").clear().type("A playlist of the first 4 episodes of Adventure Time");
        cy.get("#search").type("adventure time");
        cy.get("#show").select(searchResult.id.toString());
        cy.get("#season").should("exist").select(season.id.toString());
        // Select the first four episodes
        for (let i = 0; i < 4; i++) {
            cy.get("#episode").should("exist").select(episodes[i].id.toString());
        }
        cy.get("#save-playlist").should("contain", "Save Playlist").click();
        cy.url().should("contain", `/playlists/${playlist.id}`);
    });

    it("can reorder episodes via drag and drop", () => {
        const playlist = playlistFixture[0];
        const episodes = playlist.episodes;
        const route = `/playlists/${playlist.id}/edit`;
        const path = `/playlists/:playlistId/edit`;
    
        cy.login();
        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        cy.intercept("PUT", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistForm playlist={playlist} />, { initialEntries: [route], path: path });
        // Ensure the initial order of episodes
        for (let i = 0; i < 4; i++) {
            cy.get(`#${episodes[i].id}`).should("exist");
        }
    
        // Trigger drag-and-drop to move the 1st episode after the 4th episode using the plugin
        dragEpisodeToTarget(episodes[0], episodes[3]);
        // Wait for a moment to ensure the drag-and-drop is completed
        cy.wait(1000);
        // Ensure the new order of episodes
        cy.get(`#${episodes[3].id}`).next().should("have.attr", "id", episodes[0].id);
    
        // Save the playlist
        cy.get("#save-playlist").should("contain", "Save Playlist").click();
        cy.url().should("contain", `/playlists/${playlist.id}`);
    });    
});