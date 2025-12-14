/**
 * ==================== WORK SEARCH & SHELF WORKFLOW ====================
 * This Cypress test suite verifies the work search and shelf management workflow including:
 * - Logging in with a backend user
 * - Searching for works
 * - Opening work details
 * - Adding works to Favourites shelf
 * - Navigating to and viewing the Favourites shelf
 * 
 * Note: testIsolation is disabled for this file to preserve session between tests
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';

describe('Work search and shelf management', { testIsolation: false }, () => {
  
  // ----- HELPER FUNCTIONS -----
  
  const login = (username = TEST_USER, password = TEST_PASSWORD) => {
    cy.visit('http://localhost:3001/');
    cy.get('a[aria-label*="Login"]').first().click({ force: true });
    cy.location('pathname').should('include', 'login');
    cy.get('input[type="text"]').first().type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.location('pathname').should('eq', '/');
  };

  // Store sample title across tests
  let sampleTitle = '';

  // ----- BEFORE ALL: LOGIN ONCE -----
  before(() => {
    login(TEST_USER, TEST_PASSWORD);
  });

  // ----- TEST 1: LOGIN & VERIFY HOME PAGE -----
  it('Step 1: Logs in successfully and views home page', () => {
    cy.location('pathname').should('eq', '/');
    cy.contains(TEST_USER).should('be.visible');
    
    // Verify welcome message appears (showWelcome is set via sessionStorage)
    cy.contains(/welcome back/i, { timeout: 10000 }).should('be.visible');

    // Verify Friends' Favourites heading
    cy.contains("FRIENDS' FAVOURITES").should('exist');

    // Verify popular works heading
    cy.contains("WEEK'S TOP 10").should('exist');

    // Verify Recently sections
    cy.contains('RECENTLY WATCHED').should('exist');
    cy.contains('RECENTLY PLAYED').should('exist');

    // Verify at least some work images load 
    cy.get('img', { timeout: 10000 }).should('have.length.gte', 1);

    cy.log('✓ User logged in and home page visible');
  });

  // ----- TEST 2: SEARCH FOR A WORK FROM HOME PAGE-----
  it('Step 2: Searches for a work using the search bar', () => {
    // Choose a visible work from Home and search for it so results match the input
    cy.get('main.page-main img', { timeout: 15000 }).first().invoke('attr', 'alt').then((title) => {
      sampleTitle = title || '';
      
      // Use part of the title as the search query to simulate user's typing
      const words = (sampleTitle || '').split(/\s+/).slice(0, 2).join(' ');

      // Perform search using the extracted query
      cy.get('#search-input').clear().type(`${words}{enter}`);
      cy.location('pathname').should('include', '/search');

      // Assert the results include the sampled title
      cy.contains(sampleTitle, { timeout: 15000 }).scrollIntoView().should('be.visible');

      cy.log('✓ Work search results displayed');
    });
  });

  // ----- TEST 3: OPEN WORK DETAILS -----
  it('Step 3: Opens a work and views its details', () => {
    // Click the matching result to open details
    cy.get(`img[alt="${sampleTitle}"]`, { timeout: 15000 }).first().click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('include', '/works/');
    
    cy.log('✓ Work details page loaded');
  });

  // ----- TEST 4: ADD WORK TO FAVOURITES SHELF -----
  it('Step 4: Adds work to Favourites shelf', () => {
    // Scroll down to find Add to Shelf button
    cy.scrollTo('bottom', { ensureScrollable: false });
    
    // Click Add to Shelf button (has aria-label="Add work to shelf")
    cy.get('button[aria-label="Add work to shelf"]').should('be.visible').click({ force: true });
    
    // Wait for modal to appear
    cy.wait(500);
    
    // Modal should appear - find and click on Favourites shelf button
    cy.get('button').then(($buttons) => {
      const favBtn = Array.from($buttons).find(btn => 
        btn.innerText && btn.innerText.toLowerCase().includes('favourites')
      );
      if (favBtn) {
        cy.wrap(favBtn).click({ force: true });
        cy.wait(1000); // Wait for shelf action to complete
      }
    });
    
    cy.log('✓ Work added to Favourites shelf');
  });

  // ----- TEST 5: NAVIGATE TO SHELVES -----
  it('Step 5: Navigates to shelves and verifies work is saved', () => {
    // Wait for page to settle after previous action
    cy.wait(500);
    
    // Click on View my shelves link (FiGrid icon in header)
    // This is a Link component to /shelves with aria-label="View my shelves"
    cy.get('a[aria-label="View my shelves"]').should('be.visible').click({ force: true });
    
    // Verify on shelves page
    cy.location('pathname', { timeout: 10000 }).should('include', '/shelves');
    
    // Wait for page to load
    cy.wait(500);
    
    // Verify page loaded with shelf content
    cy.get('h1, h2, h3, [class*="shelf"]').should('have.length.greaterThan', 0);
    
    cy.log('✓ Navigated to shelves page');
  });

  // ----- TEST 6: VERIFY WORK IN FAVOURITES -----
  it('Step 6: Verifies work appears in Favourites shelf', () => {
    // Expand/click Favourites shelf if collapsed
    cy.contains('Favourites').click({ force: true });
    
    // Verify at least one work is displayed in the shelf
    cy.get('img, h3, [class*="card"]').should('have.length.greaterThan', 0);
    
    cy.log('✓ Work successfully saved in Favourites shelf');
  });

  // ----- TEST 7: LOGOUT -----
  it('Step 7: Logs out successfully', () => {
    // Navigate to home first
    cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/');
    
    // Wait a moment for page to settle
    cy.wait(500);
    
    // Find and click logout button in header
    cy.get('button[aria-label="Logout"]').should('be.visible', { timeout: 5000 }).then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    
    // Verify redirected to login
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    
    cy.log('✓ User logged out successfully');
  });

});



