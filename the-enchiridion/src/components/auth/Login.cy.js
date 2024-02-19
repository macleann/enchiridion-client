import React from 'react'
import { Login } from './Login'

describe('<Login />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Login />)

    // confirm the component is rendered
    cy.get('form').should('exist')

    // confirm the input fields are present
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')

    // confirm the submit button is present
    cy.get('button[type="submit"]').should('exist')

    // confirm the link to register is present
    cy.get('a[href="/register"]').should('exist')

    // confirm the submit button is disabled
    cy.get('button[type="submit"]').should('be.disabled')

    // confirm the link to login with Google is present
    cy.get('#googleLoginButton').should('exist')
  })

  it('enables the submit button when the input fields are filled', () => {
    cy.mount(<Login />)

    // confirm the submit button is disabled
    cy.get('button[type="submit"]').should('be.disabled')

    // type in the username
    cy.get('input[name="username"]').type('testuser')
    cy.get('button[type="submit"]').should('be.disabled')

    // type in the password
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').should('not.be.disabled')
  })

  it('redirects to the register page', () => {
    cy.mount(<Login />)

    // click the register link
    cy.get('a[href="/register"]').click()

    // confirm the url is correct
    cy.url().should('include', '/register')
  })

  it('submits the form', () => {
    cy.mount(<Login />)

    // spy on the login request
    cy.intercept('POST', '/login*', { statusCode: 200, body: {
      id: 1,
      valid: true
    } }).as('login')

    // type in the username
    cy.get('input[name="username"]').type('testuser')

    // type in the password
    cy.get('input[name="password"]').type('password')

    // submit the form
    cy.get('button[type="submit"]').click()

    // confirm the login request was sent
    cy.wait('@login')

    // confirm the user is redirected to the home page
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('shows an error message when the login fails', () => {
    // this test is failing because Material UI's snackbars are not being rendered in the test environment
    cy.mount(<Login />)

    // spy on and stub the login request
    cy.intercept('POST', '/login*', { statusCode: 401, body: {
      valid: false
    } }).as('login')

    // type in the username
    cy.get('input[name="username"]').type('testuser')

    // type in the password
    cy.get('input[name="password"]').type('password')

    // submit the form
    cy.get('#loginButton').click()

    // confirm the login request was sent
    cy.wait('@login')

    // confirm the error message is in state
    cy.window().its('store').invoke('getState').its('snackbar').its('message').should('eq', 'Invalid login credentials')
  })
})