import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { AuthProvider } from '../../providers/AuthProvider';
import { NavBar } from './NavBar';

describe('NavBar Component', () => {
  it('Should render the NavBar component and handle login button click', () => {
    // Mount the component inside a Router and wrap it with Provider
    cy.mount(
      <Provider store={store}>
        <Router>
          <AuthProvider>
            <NavBar />
          </AuthProvider>
        </Router>
      </Provider>
    );

    // Check if the NavBar is rendered
    cy.get('#navBar').should('exist');

    // Simulate a click on the login button
    cy.get('#hamburgerIcon').click();
    // For the hamburgerMenu, we need to click the <ListItemButton> element when the passed item.text is "Login"
    cy.get('#hamburgerMenu').contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('Should show the logout button when logged in', () => {
    // Bypasses the login process and sets a user id and logged in state in global state
    cy.login();
    cy.mount(
      <Provider store={store}>
        <Router>
          <AuthProvider>
            <NavBar />
          </AuthProvider>
        </Router>
      </Provider>
    );

    cy.get('#navBar').should('exist');

    cy.get('#hamburgerIcon').click();
    // Spy and stub the logout request
    cy.intercept('POST', '/logout*', {statusCode: 200})
    // Assert that the logout button is present
    cy.get('#hamburgerMenu').contains('Logout').should('exist').click();
  });
});
