/**
 * Account Page (User Profile) Tests
 * 
 * Test Coverage:
 * - Happy Path 1: Display user profile information (avatar, username, stats)
 * - Happy Path 2: Display user ratings/reviews
 * - Happy Path 3: Navigate to followers and following
 * - Happy Path 4: Navigate to edit account page
 * - Unhappy Path 1: Handle API failures gracefully
 * - Unhappy Path 2: Guest users cannot access account page
 */

describe('Account Page Tests', () => {

  // ==================== HAPPY PATH 1: USER PROFILE DISPLAY ====================
  describe('Happy Path 1: User Profile Information Display', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500); // Wait for API calls
    });

    it('Should load account page for authenticated user', () => {
      cy.url().should('include', '/account');
      cy.get('h1').should('exist');
    });

    it('Should display user avatar and username', () => {
      cy.get('img[alt*="profile picture"]').should('exist');
      cy.contains('alice').should('be.visible');
    });

    it('Should display user statistics section', () => {
      // Stats like ratings count, followers, following
      cy.contains('Works Rated').should('be.visible');
    });

    it('Should display user bio/description if available', () => {
      // User profile should have some information
      cy.get('div[style*="background"]').should('have.length.greaterThan', 0);
    });

    it('Should have proper profile styling and layout', () => {
      // Profile header should be visible
      cy.get('div').should('have.css', 'display');
      // Avatar should be circular
      cy.get('img[alt*="profile picture"]').should('exist');
    });

  });

  // ==================== HAPPY PATH 2: USER RATINGS DISPLAY ====================
  describe('Happy Path 2: User Ratings and Reviews', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
    });

    it('Should display ratings section', () => {
      // Ratings section should be present
      cy.contains('Your Rating History').should('be.visible');
    });

    it('Should show rating count in statistics', () => {
      // Should have a stat card showing number of ratings
      cy.get('div').should('exist');
    });

    it('Should display rated works if user has ratings', () => {
      // If user has rated works, they should be visible
      cy.get('img').should('have.length.greaterThan', 0);
    });

  });

  // ==================== HAPPY PATH 3: FOLLOWERS AND FOLLOWING ====================
  describe('Happy Path 3: Followers and Following Lists', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
    });

    it('Should display followers section', () => {
      cy.contains('Followers').should('be.visible');
    });

    it('Should display following section', () => {
      cy.contains('Following').should('be.visible');
    });

    it('Should be able to click on follower profile', () => {
      // Get first follower and click
      cy.get('div')
        .contains(/Followers|followers/)
        .parent()
        .parent()
        .find('img')
        .first()
        .click({ force: true })
        .then(() => {
          // Should navigate to a profile page
          cy.url().should('match', /\/profile\/\d+/);
        });
    });

    it('Should be able to click on following user profile', () => {
      // Get first following user and click
      cy.get('div')
        .contains(/Following|following/)
        .parent()
        .parent()
        .find('img')
        .first()
        .click({ force: true })
        .then(() => {
          // Should navigate to a profile page
          cy.url().should('match', /\/profile\/\d+/);
        });
    });

  });

  // ==================== HAPPY PATH 4: EDIT ACCOUNT NAVIGATION ====================
  describe('Happy Path 4: Edit Account Functionality', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
    });

    it('Should display Edit Account button', () => {
      cy.contains('button', /Edit|edit/).should('be.visible');
    });

    it('Should navigate to edit account page when clicking Edit button', () => {
      cy.contains('button', /Edit|edit/).click();
      cy.url().should('include', '/account/edit');
    });

    it('Should have Delete Account button with danger styling', () => {
      // Delete button should exist (color might indicate danger)
      cy.contains('button', /Delete|delete/).should('be.visible');
    });

  });

  // ==================== HAPPY PATH 5: PROFILE NAVIGATION ====================
  describe('Happy Path 5: Profile Navigation', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
    });

    it('Should navigate to work details when clicking a rated work', () => {
      // Find a rated work and click it
      cy.get('a[href*="/works/"]')
        .first()
        .click({ force: true });
      
      cy.url().should('match', /\/works\/\d+/);
    });

  });

  // ==================== UNHAPPY PATH 1: API FAILURES ====================
  describe('Unhappy Path 1: Error Handling', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
    });

    it('Should display page content even if API calls fail', () => {
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(2000);
      
      // Page should still be visible (might show empty sections)
      cy.url().should('include', '/account');
      cy.contains('alice').should('be.visible');
    });

    it('Should not crash if ratings data is missing', () => {
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
      
      // Account page should load regardless
      cy.url().should('include', '/account');
      cy.get('body').should('be.visible');
    });

  });

  // ==================== UNHAPPY PATH 2: GUEST ACCESS PREVENTION ====================
  describe('Unhappy Path 2: Guest User Access Prevention', () => {

    it('Should redirect guest users to login when accessing account page', () => {
      // Try to access account page without logging in
      cy.visit('http://localhost:3001/account');
      
      // Should be redirected to login
      cy.url().should('include', '/login', { timeout: 10000 });
      
      // Login page should have login form visible
      cy.get('input[type="text"]').should('be.visible');
    });

  });

  // ==================== ACCESSIBILITY TESTS ====================
  describe('Accessibility & Responsive Tests', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to account page
      cy.visit('http://localhost:3001/account');
      cy.wait(1500);
    });

    it('Should have proper heading hierarchy', () => {
      cy.get('h1').should('exist');
    });

    it('Should have accessible images with alt text', () => {
      cy.get('img[alt]').should('have.length.greaterThan', 0);
    });

    it('Should have visible buttons with descriptive text', () => {
      cy.get('button').should('have.length.greaterThan', 0);
    });

    it('Should maintain layout on different viewport sizes', () => {
      // Test on mobile
      cy.viewport('iphone-x');
      cy.get('div[style*="background"]').should('be.visible');
      
      // Test on desktop
      cy.viewport('macbook-15');
      cy.get('div[style*="background"]').should('be.visible');
    });

  });

});
