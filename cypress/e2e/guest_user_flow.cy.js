/**
 * ==================== GUEST USER FLOW TESTS ====================
 * This Cypress test suite verifies the guest user experience including:
 * - Navigating through pages without logging in
 * - Exploring available features for guests
 * - Searching for works and users
 * - Viewing work details and profiles
 * - Creating a new account
 * - Logging in with the new account
 * 
 * Note: testIsolation is disabled for this file to preserve session between tests
 */

const NEW_USER = 'testuser';
const NEW_EMAIL = 'testuser'+ '@example.com';
const NEW_PASSWORD = 'TestPassword123';

describe('Guest user flow', { testIsolation: false }, () => {

  // ----- TEST 1: EXPLORE HOME PAGE AS GUEST -----
  it('Step 1: Explores home page without logging in', () => {
    // Navigate to home
    cy.visit('http://localhost:3001/');
    cy.location('pathname').should('eq', '/');
    
    // Verify page title and greeting for guests
    cy.get('h1, h2').first().should('be.visible');
    
    // Verify login prompt banner exists
    cy.contains('button, span, a', /Sign in|Log in|Create/i).should('be.visible');
    
    // Verify popular works carousel/grid is visible
    cy.contains("WEEK\'S TOP 10").should('be.visible');
    cy.get('[class*="carousel"], [class*="grid"], h3').should('exist');
    
    // Verify search bar is available to everyone
    cy.get('input[aria-label="Search works or users"]').should('be.visible');
    
    cy.log('✓ Guest can view home page with search and login prompt');
  });

  // ----- TEST 2: SEARCH FOR WORKS AS GUEST -----
  it('Step 2: Searches for works without logging in', () => {
    // Use search bar to search for a work
    cy.get('input[aria-label="Search works or users"]').clear().type('music');
    cy.contains('TYPE').click({ force: true });
    cy.contains('WORKS').click({ force: true });
    
    // Verify search results page loads
    cy.location('pathname').should('include', '/search');
    
    // Verify work results are displayed
    cy.get('h3, [class*="card"], [class*="item"]').should('have.length.greaterThan', 0);
    
    cy.log('✓ Guest can search for works');
  });

  // ----- TEST 3: VIEW WORK DETAILS AS GUEST -----
  it('Step 3: Views work details and verifies rating disabled for guests', () => {
    // Click on a work from search results
    cy.get('h3').first().click({ force: true });
    
    // Verify work details page loads
    cy.location('pathname').should('include', '/works');
    
    // Verify work information is displayed with rating section
    cy.get('h3').should('contain', 'RATINGS');
    
    // Check for rating buttons with aria-label (e.g., "Rate 1 star", "Rate 2 stars")
    // These buttons should be disabled for guests with "not-allowed" cursor
    cy.get('button[aria-label*="Rate"]').first().then(($btn) => {
      // Verify button is disabled
      expect($btn).to.be.disabled;
      
      // Verify cursor is "not-allowed"
      const cursor = window.getComputedStyle($btn[0]).cursor;
      expect(cursor).to.equal('not-allowed');
      
      // Verify opacity shows disabled state
      const opacity = window.getComputedStyle($btn[0]).opacity;
      expect(opacity).to.equal('0.4');
    });
    
    cy.log('✓ Guest cannot rate works - rating buttons show "not-allowed" state');
  });

  // ----- TEST 4: SEARCH FOR USERS AS GUEST -----
  it('Step 4: Searches for users without logging in', () => {
    // Navigate to home
    cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/');
    
    // Search for users
    cy.get('input[aria-label="Search works or users"]').clear().type('alice');
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
    
    // Verify user search results
    cy.location('pathname').should('include', '/search');
    cy.get('h3').should('have.length.greaterThan', 0);
    
    cy.log('✓ Guest can search for users');
  });

  // ----- TEST 5: VIEW USER PROFILE AS GUEST -----
  it('Step 5: Views user profile and verifies no follow button for guests', () => {
    // Click on a user from search results
    cy.get('h3').first().click({ force: true });
    
    // Verify profile page loads
    cy.location('pathname').should('include', '/profile');
    
    // Verify profile information is visible (username, avatar, etc.)
    cy.get('h1, h2, img[alt*="avatar"], img[alt*="profile"]').should('have.length.greaterThan', 0);
    
    // Verify follow button does NOT exist for guest users
    // Follow button is only rendered when: currentUser && parseInt(userId) !== currentUser.userId
    // For guests, currentUser is null, so button won't render at all
    cy.get('button').filter((i, el) => 
      el.innerText && (el.innerText.includes('+ Follow') || el.innerText.includes('✕ Unfollow'))
    ).should('not.exist');
    
    // Verify Back button still exists
    cy.get('button').should('contain', 'Back');
    
    cy.log('✓ Guest users cannot see follow button - only authenticated users can follow');
  });

  // ----- TEST 6: ACCESS RECOMMENDATIONS PAGE AS GUEST -----
  it('Step 6: Verifies guest has no access to recommendations page', () => {
    // Navigate to home first
    cy.visit('http://localhost:3001/');
    cy.location('pathname').should('eq', '/');
    
    // Try to click recommendations icon/link in header
    // Look for the recommendation icon (heart or similar in header)
    cy.get('a[href="/recommendations"], [aria-label*="recommendations"], [aria-label*="Recommendations"]').then(($btn) => 
        {
        // If the link exists in navigation, click it
        cy.wrap($btn).first().click({ force: true });
        
        // Guest users get redirected to login (protected route)
        cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
      
    });
    
    // Verify on login page
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    
    cy.log('✓ Guest users blocked from recommendations - redirected to login');
  });

  // ----- TEST 7: HEADER NAVIGATION SHOWS LOGIN FOR GUESTS -----
  it('Step 7: Verifies guest header shows login option', () => {
    // Navigate to home
    cy.visit('http://localhost:3001/');
    cy.location('pathname').should('eq', '/');
    
    // Verify header shows login icon/button
    cy.get('[aria-label*="Login"], [aria-label*="login"]').should('be.visible');
    
    // Verify no logout button visible
    cy.get('button[aria-label="Logout"]').should('not.exist');
    
    cy.log('✓ Guest header shows login option only');
  });

  // ----- TEST 8: CREATE NEW ACCOUNT WITH VALID INPUTS -----
  it('Step 8: Creates account with valid inputs', () => {
    // Navigate to login
    cy.get('[aria-label*="Login"]').first().click({ force: true });
    cy.location('pathname').should('include', '/login');
    
    // Switch to signup mode
    cy.get('span').filter((i, el) => 
      el.innerText.includes('Create an account')
    ).first().click({ force: true });
    
    // Verify form switched to signup (email field appears)
    cy.get('input[type="email"]').should('be.visible');
    
    // Fill signup form with valid data
    // Username field (first text input)
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    
    // Email field
    cy.get('input[type="email"]').clear().type(NEW_EMAIL);
    
    // Password field
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    
    // Verify no error messages appear
    cy.get('div').filter((i, el) => 
      el.textContent && el.textContent.toLowerCase().includes('error')
    ).should('not.exist');
    
    cy.log('✓ Form inputs are valid, no validation errors');
    
    // Submit form
    cy.get('button[type="submit"]').should('be.visible').click({ force: true });
    
    // Wait for successful signup and redirect to home
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    
    // Wait for DOM to settle
    cy.wait(1500);
    
    // Verify user is logged in (logout button visible)
    cy.get('button[aria-label="Logout"]', { timeout: 5000 }).should('be.visible');
    
    // Verify username visible in header
    cy.contains(NEW_USER).should('be.visible');
    
    cy.log('✓ Account created successfully and user logged in');
  });

  // ----- TEST 9: VERIFY USER CAN ACCESS PROTECTED FEATURES -----
  it('Step 9: Verifies account can access protected features', () => {
    // Verify still logged in
    cy.get('button[aria-label="Logout"]').should('be.visible');
    cy.contains(NEW_USER).should('be.visible');
    
    // Access account page
    cy.get('[aria-label*="account"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    
    // Verify account information is displayed
    cy.contains(NEW_EMAIL).should('be.visible');
    
    cy.log('✓ Account can access protected features');
  });

    // ----- TEST 10: VERIFY LOGIN CREDENTIALS ARE VALID -----
  it('Step 10: Verifies login with invalid credentials fails', () => {
    // Find and click logout button
    cy.get('button[aria-label="Logout"]').should('be.visible').then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    
    // Try login with wrong password
    cy.get('input[type="text"]').eq(0).type(NEW_USER);
    cy.get('input[type="password"]').eq(0).type('WrongPassword123');
    cy.get('button[type="submit"]').click({ force: true });
    
    // Should stay on login page (not redirect to home)
    cy.location('pathname', { timeout: 5000 }).should('include', '/login');
    
    // Verify error message appears
    cy.get('div[role="alert"]').should('be.visible');
    
    cy.log('✓ Login with invalid credentials fails as expected');
  });

  // ----- TEST 11: LOGIN AGAIN WITH CORRECT CREDENTIALS -----
  it('Step 11: Logs in again with correct credentials', () => {
    // Verify redirected to login
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    
    // Verify logged out (username not visible)
    cy.contains(NEW_USER).should('not.exist');
    
    // Verify on login mode (no email field)
    cy.get('input[type="email"]').should('not.exist');
    
    // Fill login form with created account credentials
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    
    // Submit login
    cy.get('button[type="submit"]').click({ force: true });
    
    // Verify redirected to home
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    
    // Wait for session
    cy.wait(1000);
    
    // Verify logged in again
    cy.contains(NEW_USER).should('be.visible');
    cy.get('button[aria-label="Logout"]').should('be.visible');
    
    cy.log('✓ Successfully logged out and logged back in');

    // Find and click logout button
    cy.get('button[aria-label="Logout"]').should('be.visible').then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    
    cy.location('pathname', { timeout: 5000 }).should('eq', '/');
  });


});
