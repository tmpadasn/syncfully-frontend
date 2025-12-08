/**
 * HOME PAGE E2E TESTS
 * 
 * Test Coverage:
 * - 2 Happy Paths: Authenticated & Unauthenticated users
 * - 1 Unhappy Path: API failure handling
 * 
 * Total: 3 core tests (meeting requirements)
 */

describe('Home Page E2E Tests', () => {
  describe('Happy Paths', () => {
    /**
     * HAPPY PATH 1: Authenticated User - Full Home Page Load
     */
    it('Happy Path 1: Should load home page successfully for authenticated user', () => {
      // Navigate to login page
      cy.visit('/login');
      
      // Fill login form
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      
      // Submit login form
      cy.get('button[type="submit"]').click();

      // Wait for redirect and API calls
      cy.url().should('include', '/');
      cy.wait(2000);

      // Verify welcome message appears
      cy.get('.welcome-text').should('exist');
      cy.get('.welcome-text').should('contain', 'alice');

      // Verify main content sections are visible
      cy.contains('WEEK\'S TOP 10').should('be.visible');
      cy.contains('RECENTLY WATCHED').should('be.visible');
      cy.contains('RECENTLY PLAYED').should('be.visible');

      // Verify no login banner for authenticated users
      cy.contains('Unlock Your Personalized Experience').should('not.exist');

      // Verify content loads (work images)
      cy.get('img').should('have.length.greaterThan', 5);
    });

    /**
     * HAPPY PATH 2: Unauthenticated User - Login Prompt Banner
     */
    it('Happy Path 2: Should display login prompt for unauthenticated user with CTA', () => {
      // Clear any stored auth data
      cy.clearLocalStorage();
      
      // Visit home as unauthenticated user
      cy.visit('/');
      cy.wait(1000);

      // Verify login banner is displayed
      cy.contains('Unlock Your Personalized Experience').should('be.visible');

      // Verify banner descriptive text
      cy.contains('Join Syncfully to get personalized recommendations').should('be.visible');

      // Verify CTA buttons are visible
      cy.contains('Sign In').should('be.visible');
      cy.contains('Create Account').should('be.visible');

      // Verify feature highlights
      cy.contains('Personalized Recommendations').should('be.visible');
      cy.contains('Track Your Collection').should('be.visible');
      cy.contains("See Friends' Favorites").should('be.visible');

      // Verify popular works section still loads for unauthenticated users
      cy.contains('WEEK\'S TOP 10').should('be.visible');

      // Verify work images exist
      cy.get('img').should('have.length.greaterThan', 3);

      // Test Sign In button navigation
      cy.contains('Sign In').first().click();
      cy.url().should('include', '/login');

      // Go back and test Create Account button
      cy.visit('/');
      cy.contains('Create Account').first().click();
      cy.url().should('include', '/login');
    });
  });

  describe('Unhappy Paths', () => {
    /**
     * UNHAPPY PATH 1: API Failure - Backend Returns Error
     */
    it('Unhappy Path 1: Should handle API failure gracefully', () => {
      // Intercept and fail the popular works API endpoint
      cy.intercept('GET', '**/api/works/popular', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Internal Server Error',
        },
      }).as('failedPopularWorks');

      // Visit home page
      cy.visit('/');
      cy.wait(1000);

      // Verify page doesn't crash
      cy.get('body').should('be.visible');

      // Verify page structure still exists
      cy.get('main').should('exist');

      // Verify section titles render even if content failed
      cy.contains('WEEK\'S TOP 10').should('exist');

      // Verify recovery attempt with reload
      cy.reload();
      cy.get('body').should('be.visible');
    });
  });
});
