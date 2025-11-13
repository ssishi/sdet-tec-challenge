// Cypress support file
import './commands'

// Custom commands for the MiniMart app
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').last().click()
  cy.wait(1000) // Wait for login to complete
})

Cypress.Commands.add('addProductToCart', (productId, quantity = 1) => {
  cy.visit(`/products/${productId}`)
  cy.get('[data-testid="quantity-input"]').clear().type(quantity.toString())
  cy.get('[data-testid="add-to-cart-button"]').click()
  cy.wait(1000) // Wait for cart to update
})
