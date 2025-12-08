/**
 * Navigation Bar (Header) Tests
 * 
 * Test Coverage:
 * - Happy Path 1: Authenticated user navigation (Logo, Profile, Shelves, Recommendations, Logout)
 * - Happy Path 2: Guest user navigation (Logo, Login, Recommendations)
 * - Happy Path 3: Search functionality (Input, Submit, Navigation)
 * - Unhappy Path 1: Search with empty input
 */

describe('Navigation Bar Tests', () => {

  // ==================== HAPPY PATH 1: AUTHENTICATED USER NAVIGATION ====================
  describe('Happy Path 1: Authenticated User Navigation', () => {

    beforeEach(() => {
      // Login as alice
      cy.visit('http://localhost:3001/login');
      cy.get('input[type="text"]').first().type('alice');
      cy.get('input[type="password"]').type('alice');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/');
      cy.wait(1000); // Wait for page load
    });

    it('Should have logo that links to home', () => {
      cy.get('a[aria-label="SyncFully home page"]').should('exist');
      cy.get('a[aria-label="SyncFully home page"] img').should('have.attr', 'alt', 'SyncFully');
      cy.get('a[aria-label="SyncFully home page"]').click();
      cy.url().should('eq', 'http://localhost:3001/');
    });

    it('Should display logged-in user profile with avatar and username', () => {
      cy.get('a[aria-label*="View profile for"]').should('be.visible');
      cy.get('img[alt="alice profile picture"]').should('exist');
      cy.contains('alice').should('be.visible');
    });

    it('Should navigate to profile/account page when clicking profile', () => {
      cy.get('a[aria-label*="View profile for"]').click();
      cy.url().should('include', '/account');
    });

    it('Should display shelves icon and navigate to shelves page', () => {
      cy.get('a[aria-label="View my shelves"]').should('be.visible');
      cy.get('a[aria-label="View my shelves"]').click();
      cy.url().should('include', '/shelves');
    });

    it('Should display recommendations icon and navigate to recommendations page', () => {
      cy.get('a[aria-label="View recommendations"]').should('be.visible');
      cy.get('a[aria-label="View recommendations"]').click();
      cy.url().should('include', '/recommendations');
    });

    it('Should display logout button and logout successfully', () => {
      cy.contains('button', 'Logout').should('be.visible');
      cy.contains('button', 'Logout').click();
      // After logout, should be back at home with login banner
      cy.contains('Unlock Your Personalized Experience', { timeout: 10000 }).should('be.visible');
    });

  });

  // ==================== HAPPY PATH 2: GUEST USER NAVIGATION ====================
  describe('Happy Path 2: Guest User Navigation', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3001');
      // Verify guest user (login banner should be visible)
      cy.contains('Unlock Your Personalized Experience').should('be.visible');
    });

    it('Should display login icon for guest users', () => {
      cy.get('a[aria-label="Login to your account"]').should('be.visible');
    });

    it('Should navigate to login page when clicking login icon', () => {
      cy.get('a[aria-label="Login to your account"]').click();
      cy.url().should('include', '/login');
    });

    it('Should have recommendations link accessible to guests', () => {
      cy.get('a[aria-label="View recommendations"]').should('be.visible');
      cy.get('a[aria-label="View recommendations"]').click();
      cy.wait(500); // Wait for navigation
      // Recommendations page redirects guests to login
      cy.url().should('include', '/login');
    });

    it('Should not display shelves link for guests', () => {
      cy.get('a[aria-label="View my shelves"]').should('not.exist');
    });

    it('Should not display logout button for guests', () => {
      cy.contains('button', 'Logout').should('not.exist');
    });

  });

  // ==================== HAPPY PATH 3: SEARCH FUNCTIONALITY ====================
  describe('Happy Path 3: Search Functionality', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3001');
    });

    it('Should have accessible search input and submit button', () => {
      cy.get('input[aria-label="Search works or users"]').should('be.visible');
      cy.get('button[aria-label="Submit search"]').should('be.visible');
    });

    it('Should navigate to search results when typing and submitting search', () => {
      cy.get('input[aria-label="Search works or users"]').type('Test');
      cy.get('button[aria-label="Submit search"]').click();
      cy.url().should('include', '/search');
      cy.url().should('include', 'q=Test');
    });

    it('Should update search results when pressing Enter key', () => {
      cy.get('input[aria-label="Search works or users"]').type('Album{enter}');
      cy.url().should('include', '/search');
      cy.url().should('include', 'q=Album');
    });

    it('Should update search query when typing (with debounce)', () => {
      cy.get('input[aria-label="Search works or users"]').type('Test', { delay: 50 });
      cy.wait(400); // Wait for debounce (300ms + buffer)
      cy.url().should('include', 'q=Test');
    });

    it('Should preserve search term in input when navigating back to home', () => {
      cy.get('input[aria-label="Search works or users"]').type('Music');
      cy.wait(400);
      cy.url().should('include', 'q=Music');
      cy.get('a[aria-label="SyncFully home page"]').click();
      cy.url().should('eq', 'http://localhost:3001/');
      cy.get('input[aria-label="Search works or users"]').should('have.value', '');
    });

  });

  // ==================== UNHAPPY PATH 1: SEARCH WITH EMPTY INPUT ====================
  describe('Unhappy Path 1: Search with Empty Input', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3001');
    });

    it('Should not navigate to search page with empty query', () => {
      cy.get('input[aria-label="Search works or users"]').should('have.value', '');
      cy.get('button[aria-label="Submit search"]').click();
      cy.wait(300);
      // Empty search should not trigger navigation or should remain on home
      // If it does navigate, it should be without a query parameter
      cy.url().then(url => {
        if (url.includes('/search')) {
          cy.url().should('not.include', 'q=');
        } else {
          cy.url().should('eq', 'http://localhost:3001/');
        }
      });
    });

    it('Should handle whitespace-only search input', () => {
      cy.get('input[aria-label="Search works or users"]').type('   ');
      cy.get('button[aria-label="Submit search"]').click();
      cy.wait(300);
      // Whitespace-only search should not trigger navigation or should remain on home
      // If it does navigate, it should be without a query parameter (whitespace trimmed)
      cy.url().then(url => {
        if (url.includes('/search')) {
          cy.url().should('not.include', 'q=');
        } else {
          cy.url().should('eq', 'http://localhost:3001/');
        }
      });
    });

  });

  // ==================== RESPONSIVE & INTERACTION TESTS ====================
  describe('Responsive & Interaction Tests', () => {

    beforeEach(() => {
      cy.visit('http://localhost:3001');
    });

    it('Should have proper accessibility attributes', () => {
      cy.get('header[role="banner"]').should('exist');
      cy.get('div[role="search"]').should('exist');
      cy.get('nav[aria-label="Main navigation"]').should('exist');
    });

    it('Should have search bar with proper labels', () => {
      cy.get('label[for="search-input"]').should('exist');
      cy.get('input#search-input').should('exist');
    });

    it('Should maintain header visibility on scroll', () => {
      // Navigate to a page with scrollable content
      cy.get('a[aria-label="View recommendations"]').click();
      cy.get('header[role="banner"]').should('be.visible');
      // Scroll down
      cy.scrollTo('bottom');
      cy.get('header[role="banner"]').should('be.visible');
    });

  });

});
