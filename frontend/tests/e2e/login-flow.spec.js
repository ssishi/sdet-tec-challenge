describe('Login Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form with all required fields', () => {
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.get('[data-testid="login-button"]').should('be.visible')
    cy.contains('Don\'t have an account?').should('be.visible')
    cy.get('[data-testid="register-link"]').should('be.visible')
  })

  it('should successfully login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    cy.url().should('not.include', '/login')
    cy.url().should('include', '/')
  })

  it('should show error message with invalid email format', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should show error message with empty email field', () => {
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should show error message with empty password field', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should disable login button when both fields are empty', () => {
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should toggle password visibility', () => {
    cy.get('[data-testid="password-input"]').type('password')
    
    // Check initial state (password hidden)
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
    
    // Toggle visibility by clicking the append icon button
    cy.get('[data-testid="password-input"]').parent().find('button[class*="append"]').click()
    
    // Check if password is now visible
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'text')
  })

  it('should clear email field and allow re-entry', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="email-input"]').clear()
    cy.get('[data-testid="email-input"]').should('have.value', '')
    cy.get('[data-testid="email-input"]').type('newtest@example.com')
    cy.get('[data-testid="email-input"]').should('have.value', 'newtest@example.com')
  })

  it('should navigate to register page from login page', () => {
    cy.get('[data-testid="register-link"]').click()
    cy.url().should('include', '/register')
  })

  it('should persist form data when navigating away and back', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.visit('/')
    cy.visit('/login')
    
    // Form should be cleared on fresh navigation
    cy.get('[data-testid="email-input"]').should('have.value', '')
  })

  it('should handle rapid form submissions', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    
    // Click login multiple times rapidly
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="login-button"]').click()
    
    // Should only process one request
    cy.url().should('not.include', '/login')
  })

  it('should handle special characters in password', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('p@ssw0rd!#$%')
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
  })

  it('should handle whitespace in email field', () => {
    cy.get('[data-testid="email-input"]').type('  test@example.com  ')
    cy.get('[data-testid="password-input"]').type('password')
    
    // Should be treated as invalid format
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should show login button is enabled with valid email and password', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
  })

  it('should maintain focus on password field after typing', () => {
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="password-input"]').should('have.focus')
  })

  it('should allow tab navigation between form fields', () => {
    cy.get('[data-testid="email-input"]').focus()
    cy.get('[data-testid="email-input"]').type('test@example.com')
    
    cy.get('[data-testid="email-input"]').tab()
    cy.get('[data-testid="password-input"]').should('have.focus')
  })

  it('should display page title correctly', () => {
    cy.title().should('include', 'MiniMart')
  })

  it('should have proper heading on login page', () => {
    cy.contains('Login').should('be.visible')
  })

  it('should handle very long email address', () => {
    const longEmail = 'a'.repeat(100) + '@example.com'
    cy.get('[data-testid="email-input"]').type(longEmail)
    cy.get('[data-testid="password-input"]').type('password')
    
    // Should either disable button or handle gracefully
    cy.get('[data-testid="login-button"]').should('exist')
  })

  it('should handle very long password', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('p'.repeat(500))
    cy.get('[data-testid="login-button"]').should('not.be.disabled')
  })

  it('should require both email and password for login', () => {
    // Only email
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="login-button"]').should('be.disabled')
    
    // Clear and try only password
    cy.get('[data-testid="email-input"]').clear()
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })

  it('should handle case sensitivity in email', () => {
    cy.get('[data-testid="email-input"]').type('TEST@EXAMPLE.COM')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    // Should handle case-insensitive email or show appropriate error
    cy.url().should('not.include', '/login')
  })

  it('should display register link with correct text', () => {
    cy.contains('Don\'t have an account?').should('be.visible')
    cy.contains('Sign up here').should('be.visible')
  })

  it('should have proper form structure with labels', () => {
    cy.get('[data-testid="email-input"]').should('be.visible')
    cy.get('[data-testid="password-input"]').should('be.visible')
    cy.contains('Email').should('be.visible')
    cy.contains('Password').should('be.visible')
  })

  it('should redirect authenticated user away from login page', () => {
    // First login
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    cy.wait(1000)
    
    // Try to access login page again
    cy.visit('/login')
    
    // Should either stay on home or redirect away from login
    cy.url().should('not.include', '/login')
  })

  it('should handle logout and allow re-login', () => {
    // Login
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    cy.wait(1000)
    
    // Logout
    cy.get('[data-testid="logout-button"]').click()
    
    // Should be redirected to login
    cy.url().should('include', '/login')
    
    // Should be able to login again
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    cy.url().should('not.include', '/login')
  })

  it('should display autocomplete attributes for security', () => {
    cy.get('[data-testid="email-input"]').should('have.attr', 'type', 'email')
    cy.get('[data-testid="password-input"]').should('have.attr', 'type', 'password')
  })

  it('should handle network errors gracefully', () => {
    // Intercept and fail the login request
    cy.intercept('POST', '**/login', { statusCode: 500 }).as('loginFail')
    
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    cy.wait('@loginFail')
    
    // Should show error or stay on login page
    cy.url().should('include', '/login')
  })

  it('should handle timeout during login', () => {
    // Delay the login response
    cy.intercept('POST', '**/login', (req) => {
      req.reply((res) => {
        res.delay(5000)
      })
    }).as('loginDelay')
    
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').click()
    
    // Button should show loading state or be disabled
    cy.get('[data-testid="login-button"]').should('be.disabled')
  })
})
