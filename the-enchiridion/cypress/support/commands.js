import { store } from '../../src/redux/store';
import { setLoggedIn, setUserData } from '../../src/redux/actions/authActions';
import '@4tw/cypress-drag-drop'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (id) => {
    if (!id) {
      id = 1;
    }
    store.dispatch(setLoggedIn(true));
    store.dispatch(setUserData({ id: id }));
  });

Cypress.Commands.add('logout', () => {
  store.dispatch(setLoggedIn(false));
  store.dispatch(setUserData({}));
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })