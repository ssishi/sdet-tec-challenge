// Reusable helper for registration
Cypress.Commands.add('register', (firstName, surname, email, password) => {
  if (firstName) cy.get('[data-testid="first-name-input"]').clear().type(firstName)
  if (surname) cy.get('[data-testid="surname-input"]').clear().type(surname)
  if (email) cy.get('[data-testid="email-input"]').clear().type(email)
  if (password) cy.get('[data-testid="password-input"]').clear().type(password)
  cy.get('[data-testid="register-button"]').click()
})

describe('Registration Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/register') // Navigate to registration page
  })

  // 1️ Verify registration page opens
  it('should display registration form with all required fields', () => {
    const fields = ['first-name-input', 'surname-input', 'email-input', 'password-input', 'register-button']
    fields.forEach(field => cy.get(`[data-testid="${field}"]`).should('be.visible'))
  })

  // 2️ Verify successful registration
  it('should register successfully with valid details', () => {
    cy.register('Test', 'User', 'test@example.com', 'password')
    cy.contains(/account created successfully/i).should('be.visible')
    cy.url().should('not.include', '/register')
  })

  // 3️ Verify registration fails with existing email
  it('should fail registration with existing email', () => {
    // Use the same email but assume it already exists in the system
    cy.register('Test', 'User', 'test@example.com', 'password')
    cy.contains(/email.*already.*in use/i).should('be.visible')
  })

  // 4️ Verify password validation
  it('should validate weak password', () => {
    cy.register('Test', 'User', 'test@example.com', '12345')
    cy.contains(/password.*weak/i).should('be.visible')
  })

  // 5️Verify empty fields validation
  it('should show errors for empty fields', () => {
    cy.register('', '', '', '')
    ['first name', 'surname', 'email', 'password'].forEach(msg =>
      cy.contains(new RegExp(`${msg}.*required`, 'i')).should('be.visible')
    )
  })

  // 6 Verify email format validation
  it('should validate email format', () => {
    cy.register('Test', 'User', 'aaec', 'password')
    cy.contains(/invalid.*email/i).should('be.visible')
  })
})
