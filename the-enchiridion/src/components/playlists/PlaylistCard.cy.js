import React from "react";
import { PlaylistCard } from "./PlaylistCard";
import fixture from "../../../cypress/fixtures/playlists.json";

describe("<PlaylistCard />", () => {
    it("renders", () => {
        const playlist = fixture[0];
        cy.mount(<PlaylistCard playlist={playlist} />);
        cy.get(".card-playlists").should("exist");
        cy.get(".card-playlists").find("img").should("exist");
        cy.get("#playlist-title").should("exist");
        cy.get("p").contains(`${playlist.episodes.length} eps`);
    });

    it("renders with a description if not on mobile", () => {
        const playlist = fixture[0];
        cy.viewport("macbook-15");
        cy.mount(<PlaylistCard playlist={playlist} />);
        cy.get("p").contains(playlist.description.slice(0, 100));
    });

    it("sends a like request when the like button is clicked", () => {
        cy.login();
        const playlist = fixture[0];
        playlist.is_liked = false;
        cy.intercept("POST", "/likes", {
            statusCode: 201,
            body: {'message': 'Liked'},
        }).as("likePlaylist");
        cy.mount(<PlaylistCard playlist={playlist} />);
        cy.get("#likeIcon").should("exist").click({force: true});
        cy.wait("@likePlaylist").its("request.body").should("deep.equal", {
            playlist_id: 2
        });
    });

    it("sends an unlike request when the like button is clicked", () => {
        cy.login();
        const playlist = fixture[0];
        playlist.is_liked = true;
        cy.intercept("DELETE", "/likes/*", {
            statusCode: 204,
            body: {'message': 'Unliked'},
        }).as("unlikePlaylist");
        cy.mount(<PlaylistCard playlist={playlist} />);
        cy.get("#likeIcon").should("exist").click({force: true});
        cy.wait("@unlikePlaylist").its("request.url").should("include", "/likes/2");
    });
});