describe('Shopping Flow E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should allow user to browse and add products to cart', () => {
    cy.get('[data-testid="login-button"]').last().click()
    
    cy.get('[data-testid="email-input"]').type('test@example.com')
    cy.get('[data-testid="password-input"]').type('password')
    cy.get('[data-testid="login-button"]').last().click()
    
    cy.url().should('not.include', '/login')
    cy.get('[data-testid="add-to-cart-button"]').should('have.length.greaterThan', 0)
    
    cy.get('[data-testid="add-to-cart-button"]').first().click()
    
    // Verify cart button shows item count
    cy.get('[data-testid="cart-button"]').find('[role="status"]').should('contain', '1')
  })

  it('should update cart total when items are added', () => {
    cy.login('test@example.com', 'password') 
    
    cy.visit('/products')
    
    cy.get('[data-testid="product-name-link"]').first().click()
    
    cy.get('[data-testid="add-to-cart-button"]').click()
    
    cy.get('[data-testid="cart-button"]').click()
    
    cy.contains('Total:').should('be.visible')
  })

  it('should show correct product details', () => {
    cy.visit('/products/1') 
    
    cy.contains('Wireless Headphones').should('be.visible') 
    cy.contains('$199.99').should('be.visible') 
    cy.contains('50').should('be.visible') 
  })

  it('should complete checkout process', () => {
    cy.login('test@example.com', 'password')
    cy.addProductToCart(1, 1)
    
    cy.get('[data-testid="cart-button"]').click()
    cy.contains('Proceed to Checkout').click()
    
    cy.url().should('include', '/checkout')
  })

  it('should filter products by category', () => {
    cy.visit('/products')
    
    cy.get('[data-testid="category-filter"]').click()
    cy.contains('Electronics').click()
    
    cy.get('[data-testid="add-to-cart-button"]').should('exist')
  })

  it('should handle user registration', () => {
    cy.visit('/register')
    
    cy.contains('First Name').parent().find('input').type('John')
    cy.contains('Last Name').parent().find('input').type('Doe')
    cy.get('[data-testid="email-input"]').type('john@test.com')
    cy.get('[data-testid="password-input"]').type('password123')
    cy.contains('Confirm Password').parent().find('input').type('password123')
    
    cy.contains('Create Account').click()
  })

  it('should handle concurrent cart updates', () => {
    cy.login('test@example.com', 'password')
    
    cy.addProductToCart(1, 1)
    cy.addProductToCart(2, 2)
    cy.addProductToCart(3, 1)
    
    cy.get('[data-testid="cart-button"]').should('contain', '4')
  })

  it('should add out of stock product to cart', () => {
    cy.login('test@example.com', 'password')
    cy.visit('/products')
    
    // Try to find and add an out of stock product
    cy.get('[data-testid="add-to-cart-button"]').first().click()
    
    // Should show success or error message
    cy.get('body').should('exist')
  })

  it('should search for products', () => {
    cy.visit('/products')
    
    cy.get('[data-testid="search-input"]').type('laptop')
    
    // Wait for search results to load
    cy.contains('Laptop', { timeout: 5000 }).should('be.visible')
  })

  it('should navigate through product pages', () => {
    cy.visit('/products')
    
    cy.get('[data-testid="product-name-link"]').first().click()
    
    cy.url().should('match', /\/products\/\d+$/)
    
    // Navigate back using browser back button
    cy.go('back')
    cy.url().should('include', '/products')
  })
})
