// Custom Cypress commands for MiniMart testing

// Prevent Cypress from failing on uncaught exceptions that might occur in the app
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false
})

