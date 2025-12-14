/**
 * ==================== WORK SEARCH & SHELF WORKFLOW ====================
 * 
 * Work search and shelf management flow:
 * - Logging in 
 * - Navigating to home page
 * - Searching for work 
 * - Opening work details
 * - Adding work to Favourites shelf
 * - Navigating to and confirming the Favourites shelf
 * - Logging out
 * 
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';

describe('Work search and shelf management', () => {
  
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

  // Store sample title across workflow
  let sampleTitle = '';

  it('Complete workflow: Login, Search work, Add to shelf, Verify shelf, Logout', () => {
    // Step 1: Login
    login(TEST_USER, TEST_PASSWORD);
    cy.location('pathname').should('eq', '/');
    cy.contains(TEST_USER).should('be.visible');
    cy.contains(/welcome back/i, { timeout: 10000 }).should('be.visible');
    cy.contains("FRIENDS' FAVOURITES").should('exist');
    cy.contains("WEEK'S TOP 10").should('exist');
    cy.contains('RECENTLY WATCHED').should('exist');
    cy.contains('RECENTLY PLAYED').should('exist');
    cy.get('img', { timeout: 10000 }).should('have.length.gte', 1);
    cy.log('✓ User logged in and home page visible');

    // Step 2: Search for a work
    cy.get('main.page-main img', { timeout: 15000 }).first().invoke('attr', 'alt').then((title) => {
      sampleTitle = title || '';
      const words = (sampleTitle || '').split(/\s+/).slice(0, 2).join(' ');
      cy.get('#search-input').clear().type(`${words}{enter}`);
      cy.location('pathname').should('include', '/search');
      cy.contains(sampleTitle, { timeout: 15000 }).scrollIntoView().should('be.visible');
      cy.log('✓ Work search results displayed');

      // Step 3: Open work details (inside callback so sampleTitle is available)
      cy.get(`img[alt="${sampleTitle}"]`, { timeout: 15000 }).first().click({ force: true });
      cy.location('pathname', { timeout: 10000 }).should('include', '/works/');
      cy.log('✓ Work details page loaded');

      // Step 4: Add work to Favourites shelf (inside callback)
      cy.scrollTo('bottom', { ensureScrollable: false });
      cy.get('button[aria-label="Add work to shelf"]').should('be.visible').click({ force: true });
      cy.wait(500);
      cy.get('button').then(($buttons) => {
        const favBtn = Array.from($buttons).find(btn => 
          btn.innerText && btn.innerText.toLowerCase().includes('favourites')
        );
        if (favBtn) {
          cy.wrap(favBtn).click({ force: true });
          cy.wait(1000);
        }
      });
      cy.log('✓ Work added to Favourites shelf');

      // Step 5: Navigate to shelves (inside callback)
      cy.wait(500);
      cy.get('a[aria-label="View my shelves"]').should('be.visible').click({ force: true });
      cy.location('pathname', { timeout: 10000 }).should('include', '/shelves');
      cy.wait(500);
      cy.get('h1, h2, h3, [class*="shelf"]').should('have.length.greaterThan', 0);
      cy.log('✓ Navigated to shelves page');

      // Step 6: Verify work in Favourites (inside callback so sampleTitle is available)
      cy.contains('Favourites').click({ force: true });
      cy.wait(500);
      cy.contains(sampleTitle).should('be.visible');
      cy.log('✓ Verified ' + sampleTitle + ' is in Favourites shelf');
    });

    // Step 7: Logout
    cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/');
    cy.wait(500);
    cy.get('button[aria-label="Logout"]').should('be.visible', { timeout: 5000 }).then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    cy.log('✓ User logged out successfully');
  });
});



