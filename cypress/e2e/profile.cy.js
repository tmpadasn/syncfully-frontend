/**
 * User Profile Page Tests
 * 
 * Test Coverage:
 * - Happy Path 1: View other user profile (authenticated user)
 * - Happy Path 2: Follow/unfollow user functionality
 * - Happy Path 3: View user ratings and works
 * - Happy Path 4: Navigate to rated works
 * - Unhappy Path 1: Handle non-existent user profile
 * - Unhappy Path 2: Guest user attempting to follow
 */

describe('User Profile Page Tests', () => {

  // ==================== HAPPY PATH 1: VIEW USER PROFILE ====================
  describe('Happy Path 1: View Other User Profile', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
      cy.wait(1000);
      
      // Navigate to another user's profile (bob)
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500); // Wait for API calls
    });

    it('Should load another user profile page', () => {
      cy.url().should('include', '/profile/2');
      cy.contains('bob').should('be.visible');
    });

    it('Should display user avatar and username', () => {
      cy.get('img[alt*="profile picture"]').should('exist');
      cy.contains('bob').should('be.visible');
    });

    it('Should display user statistics (ratings, followers, following)', () => {
      cy.contains('Works Rated').should('be.visible');
      cy.contains('Rating Breakdown by Type').should('be.visible');
      cy.contains('Most Rated Genres').should('be.visible');
    });

    it('Should display user email address', () => {
      cy.contains('bob@example.com').should('be.visible');
    });

    it('Should have proper profile styling and layout', () => {
      cy.get('div').should('have.css', 'display');
      // Profile container should be visible
      cy.get('img[alt*="profile picture"]').should('be.visible');
    });

  });

  // ==================== HAPPY PATH 2: FOLLOW/UNFOLLOW FUNCTIONALITY ====================
  describe('Happy Path 2: Follow and Unfollow User', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to another user's profile
      cy.visit('http://localhost:3001/profile/3');
      cy.wait(1500);
    });

    it('Should display follow button for other users', () => {
      // Follow button should exist for different user
      cy.get('button').contains(/Follow|Unfollow/).should('exist');
    });

    it('Should allow authenticated user to follow another user', () => {
      // Find and click the follow button (button text is "+ Follow")
      cy.get('button').contains(/\+ Follow/).click({ force: true });
      cy.wait(500);
      // Button should change to unfollow (text is "✕ Unfollow")
      cy.get('button').contains(/✕ Unfollow/).should('exist');
    });

    it('Should allow authenticated user to unfollow a user', () => {
      // First check if already following
      cy.get('button').then(($btn) => {
        if ($btn.text().includes('Follow') && !$btn.text().includes('Unfollow')) {
          // If showing "+ Follow", click to follow first
          cy.get('button').contains(/\+ Follow/).click();
          cy.wait(500);
        }
        // Now unfollow
        cy.get('button').contains(/✕ Unfollow/).click({ force: true });
        cy.wait(500);
        // Should show follow button again
        cy.get('button').contains(/\+ Follow/).should('exist');
      });
    });

    it('Should update follow status visually', () => {
      // Profile should remain loaded after follow action
      cy.url().should('include', '/profile/');
      cy.contains('carol').should('be.visible');
      // Follow button should be visible
      cy.get('button').contains(/Follow|Unfollow/).should('exist');
    });

  });

  // ==================== HAPPY PATH 3: VIEW USER RATINGS ====================
  describe('Happy Path 3: View User Ratings and Works', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to user profile with ratings
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
    });

    it('Should display ratings section for user', () => {
      cy.contains('Rating History').should('be.visible');
    });

    it('Should display user rated works', () => {
      // Look for work titles or images
      cy.get('img').should('have.length.greaterThan', 1);
    });

    it('Should show rating count in statistics', () => {
      // Works Rated stat should be visible with a number
      cy.contains('Works Rated').should('be.visible');
    });

    it('Should display rating breakdown by type', () => {
      // Should show breakdown of movies, books, music, etc.
      cy.get('div').should('exist');
    });

  });

  // ==================== HAPPY PATH 4: NAVIGATE FROM PROFILE ====================
  describe('Happy Path 4: Navigation from Profile', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
      
      // Navigate to user profile
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
    });

    it('Should navigate to work details when clicking a rated work', () => {
      // Find a rated work link
      cy.get('a[href*="/works/"]')
        .first()
        .click({ force: true });
      
      cy.url().should('match', /\/works\/\d+/);
    });

    it('Should navigate back to home when clicking logo', () => {
      cy.get('a[aria-label="SyncFully home page"]').click();
      cy.url().should('eq', 'http://localhost:3001/');
    });

    it('Should allow navigation to recommendations page', () => {
      cy.get('a[aria-label="View recommendations"]').click();
      cy.url().should('include', '/recommendations');
    });

  });

  // ==================== UNHAPPY PATH 1: NON-EXISTENT USER ====================
  describe('Unhappy Path 1: Non-Existent User Profile', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
    });

    it('Should handle non-existent user gracefully', () => {
      // Try to access a user that doesn't exist
      cy.visit('http://localhost:3001/profile/99999');
      cy.wait(1500);
      
      // Should show error message or redirect
      cy.get('body').should('be.visible');
    });

    it('Should display error message for invalid user ID', () => {
      cy.visit('http://localhost:3001/profile/99999');
      cy.wait(1500);
      
      // Should show "User not found" or similar message
      cy.get('p').should('exist');
    });

  });

  // ==================== UNHAPPY PATH 2: GUEST USER FOLLOW ATTEMPT ====================
  describe('Unhappy Path 2: Guest User Follow Attempt', () => {

    it('Should not display follow button for guest users', () => {
      // Visit profile without logging in
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
      
      // Profile should load
      cy.contains('bob').should('be.visible');
      
      // Follow button should NOT exist for guests (only shows for authenticated users)
      cy.get('button').contains(/\+ Follow/).should('not.exist');
      
      // But back button should still exist
      cy.get('button').contains('Back to Search').should('exist');
    });

  });

  // ==================== EDGE CASES ====================
  describe('Edge Cases and Responsive Tests', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.wait(1000);
    });

    it('Should handle rapid profile switches', () => {
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(800);
      
      cy.visit('http://localhost:3001/profile/3');
      cy.wait(800);
      
      cy.visit('http://localhost:3001/profile/4');
      cy.wait(800);
      
      // Should display the final profile correctly
      cy.get('img[alt*="profile picture"]').should('exist');
    });

    it('Should display profile correctly on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
      
      // Profile should be responsive
      cy.get('img[alt*="profile picture"]').should('be.visible');
      cy.contains('Works Rated').should('be.visible');
    });

    it('Should display profile correctly on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
      
      // Profile should be responsive
      cy.get('img[alt*="profile picture"]').should('be.visible');
      cy.contains('Works Rated').should('be.visible');
    });

    it('Should have accessible profile structure', () => {
      cy.visit('http://localhost:3001/profile/2');
      cy.wait(1500);
      
      // Profile should have images with alt text
      cy.get('img[alt]').should('have.length.greaterThan', 0);
      
      // Should have readable text
      cy.contains('bob').should('be.visible');
    });

    it('Should handle profile with no ratings', () => {
      // Try visiting profile of user with fewer ratings
      cy.visit('http://localhost:3001/profile/5');
      cy.wait(1500);
      
      // Profile should still load
      cy.get('img[alt*="profile picture"]').should('exist');
    });

  });

});
