import React from "react";
import { PlaylistDetail } from "./PlaylistDetail";
import fixture from "../../../cypress/fixtures/playlists.json";

describe("<PlaylistDetail />", () => {
    it ("renders", () => {
        const playlist = fixture[0];
        const route = `/playlists/${playlist.id}`;
        const path = `/playlists/:playlistId`;
        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistDetail />, { initialEntries: [route], path: path });
        
        cy.wait("@getPlaylist");
        cy.get("h2").should("contain", playlist.name);
        cy.get("div").contains(playlist.description);
        // Get the link back to playlists
        cy.get("#playlist-slug").should("contain", "Back to playlists").click();
        cy.url().should("contain", "/playlists");
    });

    it("renders a message if the playlist is not found", () => {
        const route = "/playlists/100";
        const path = "/playlists/:playlistId";
        cy.intercept("GET", "/playlists/100", { statusCode: 404, body: { message: "Playlist not found" } }).as("getPlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistDetail />, { initialEntries: [route], path: path });
        
        cy.wait("@getPlaylist");
        cy.get("h1").should("contain", "Playlist not found");
    });

    it("renders the edit button if the user is the owner", () => {
        const playlist = fixture[0];
        const route = `/playlists/${playlist.id}`;
        const path = `/playlists/:playlistId`;
        cy.login(playlist.user_id);
        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistDetail />, { initialEntries: [route], path: path });
        
        cy.wait("@getPlaylist");
        cy.get(".button-primary").should("contain", "Edit Playlist").click();
        cy.url().should("contain", `/playlists/${playlist.id}/edit`);
    });

    it("renders the delete button if the user is the owner", () => {
        const playlist = fixture[0];
        const route = `/playlists/${playlist.id}`;
        const path = `/playlists/:playlistId`;
        cy.login(playlist.user_id);
        cy.intercept("GET", `/playlists/${playlist.id}`, { statusCode: 200, body: playlist }).as("getPlaylist");
        cy.intercept("DELETE", `/user-playlists/${playlist.id}`, { statusCode: 204, body: {} }).as("deletePlaylist");
        window.history.pushState({}, null, route);
        cy.mount(<PlaylistDetail />, { initialEntries: [route], path: path });
        
        cy.wait("@getPlaylist");
        cy.get(".button-delete").should("contain", "Delete Playlist").click();
        cy.wait("@deletePlaylist");
        cy.url().should("contain", "/playlists");
    });
});