// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18'
import { Provider } from 'react-redux'
import { store } from '../../src/redux/store'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from '../../src/providers/AuthProvider'
import { EpisodeProvider } from '../../src/providers/EpisodeProvider'
import { PlaylistProvider } from '../../src/providers/PlaylistProvider'
import { SearchProvider } from '../../src/providers/SearchProvider'
import { SeasonProvider } from '../../src/providers/SeasonProvider'

Cypress.Commands.add('mount', (component, options = {}) => {
    // Use the default store if one is not provided
    const { reduxStore = store, ...mountOptions } = options
    // expose store to the window object
    window.store = reduxStore
  
    const wrapped = <Provider store={reduxStore}>
        <Router>
            <AuthProvider>
                <EpisodeProvider>
                    <PlaylistProvider>
                        <SearchProvider>
                            <SeasonProvider>
                                {component}
                            </SeasonProvider>
                        </SearchProvider>
                    </PlaylistProvider>
                </EpisodeProvider>
            </AuthProvider>
        </Router>
    </Provider>
  
    return mount(wrapped, mountOptions)
  })

// Example use:
// cy.mount(<MyComponent />)