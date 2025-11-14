describe('Registration Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('should display all required registration fields', () => {
    const fields = [
      'first-name-input',
      'last-name-input',
      'email-input',
      'password-input',
      'confirm-password-input',
      'register-button',
      'login-link'
    ]

    fields.forEach(field => {
      cy.get(`[data-testid="${field}"]`).should('be.visible')
    })
  })

  it('should disable register button when form is invalid', () => {
    cy.get('[data-testid="register-button"]').should('be.disabled')
  })

  it('should enable register button when form is valid', () => {
    cy.get('[data-testid="first-name-input"]').type('John')
    cy.get('[data-testid="last-name-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="confirm-password-input"]').type('password123')

    cy.get('[data-testid="register-button"]').should('not.be.disabled')
  })

  it('should show validation errors for invalid fields', () => {
    cy.get('[data-testid="first-name-input"]').type('J')
    cy.get('[data-testid="last-name-input"]').type('D')
    cy.get('[data-testid="email-input"]').type('invalidemail')
    cy.get('[data-testid="password-input"]').type('123')
    cy.get('[data-testid="confirm-password-input"]').type('456')

    cy.get('.v-messages__message').should('exist')
  })
it('should toggle password visibility', () => {
  // Initially hidden
  cy.get('[data-testid="password-input"]')
    .should('have.attr', 'type', 'password')

  // Click the append icon (eye button)
  cy.get('[data-testid="password-input"]')
    .closest('.v-input')        // go to the Vuetify wrapper
    .find('.v-input__append-inner .v-icon') // select the eye icon
    .click()

  // Should now show the password as plain text
  cy.get('[data-testid="password-input"]')
    .should('have.attr', 'type', 'text')
  })

  

  it.skip('should show error alert on failed registration', () => {
    cy.intercept('POST', '**/register', {
      body: { success: false, message: 'Registration failed' },
      statusCode: 400
    }).as('failedRegister')

    cy.get('[data-testid="first-name-input"]').type('John')
    cy.get('[data-testid="last-name-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="confirm-password-input"]').type('password123')

    cy.get('[data-testid="register-button"]').click()

    cy.wait('@failedRegister')

    cy.get('[data-testid="error-alert"]')
  .should('be.visible')
  .should('contain.text', 'Registration failed')
    
  })

  it('should show success alert and redirect on successful registration', () => {
    cy.intercept('POST', '**/register', {
      body: { success: true },
      statusCode: 200
    }).as('successfulRegister')

    cy.get('[data-testid="first-name-input"]').type('John')
    cy.get('[data-testid="last-name-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="confirm-password-input"]').type('password123')

    cy.get('[data-testid="register-button"]').click()

    cy.wait('@successfulRegister')

    cy.get('[data-testid="success-alert"]')
      .should('be.visible')
      .contains('Account created successfully!')

    cy.wait(2100) // wait for redirect
    cy.url().should('include', '/login')
  })

  it('should navigate to login page from link', () => {
    cy.get('[data-testid="login-link"]').click()
    cy.url().should('include', '/login')
  })

  it('should prevent registration when passwords do not match', () => {
    cy.get('[data-testid="first-name-input"]').type('John')
    cy.get('[data-testid="last-name-input"]').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@example.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.get('[data-testid="confirm-password-input"]').type('different')

    cy.get('[data-testid="register-button"]').should('be.disabled')
  })

  it('should show loading state when submitting', () => {
  // Intercept the registration API with a delayed response
  cy.intercept('POST', '**/register', (req) => {
    req.reply({
      delay: 1000,
      statusCode: 200,
      body: { success: true }
    })
  }).as('delayedRegister')

  // Visiting the registration page
  cy.visit('/register')

  // Waiting for the register button to exist and be visible
  cy.get('[data-testid="register-button"]', { timeout: 5000 })
    .should('be.visible')

  // Filling out the form
  cy.get('[data-testid="first-name-input"]').type('John')
  cy.get('[data-testid="last-name-input"]').type('Doe')
  cy.get('[data-testid="email-input"]').type('john@example.com')
  cy.get('[data-testid="password-input"]').type('password123')
  cy.get('[data-testid="confirm-password-input"]').type('password123')

  // Click the register button
  cy.get('[data-testid="register-button"]').click()

  // Check the button shows loading (Vuetify adds class v-btn--loading)
  cy.get('[data-testid="register-button"]').should('have.class', 'v-btn--loading')

  // Wait for the fake API to resolve
  cy.wait('@delayedRegister')
  })
})
