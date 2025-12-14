/**
 * ==================== GUEST USER FLOW TESTS ====================
 * 
 * Guest User Flow:
 * - Accessing home page as guest
 * - Viewing home page content
 * - Searching for works and work details (without a rating option)
 * - Searching for users and viewing profiles (without follow option)
 * - Attempting to access protected features (recommendations) and being blocked
 * - Creating a new account
 * - Logging in with the new account & accessing protected features
 * - Logging out
 * - Trying to login with invalid credentials (to verfify new account exists)
 * - Logging in with valid credentials
 * 
 */

const NEW_USER = 'testuser';
const NEW_EMAIL = 'testuser'+ '@example.com';
const NEW_PASSWORD = 'TestPassword123';

describe('Guest user flow', () => {

  // ----- COMPLETE GUEST USER FLOW -----
  it('Complete workflow: Browse as guest, Create account, Login, Access features, Logout', () => {
    
    // Step 1: Explore home page as guest
    cy.visit('http://localhost:3001/');
    cy.location('pathname').should('eq', '/');
    cy.get('h1, h2').first().should('be.visible');
    cy.contains('button, span, a', /Sign in|Log in|Create/i).should('be.visible');
    cy.contains("WEEK\'S TOP 10").should('be.visible');
    cy.get('[class*="carousel"], [class*="grid"], h3').should('exist');
    cy.get('input[aria-label="Search works or users"]').should('be.visible');
    cy.log('✓ Guest can view home page');
    
    // Step 2: Search for works as guest
    cy.get('input[aria-label="Search works or users"]').clear().type('music');
    cy.contains('TYPE').click({ force: true });
    cy.contains('WORKS').click({ force: true });
    cy.location('pathname').should('include', '/search');
    cy.get('h3, [class*="card"], [class*="item"]').should('have.length.greaterThan', 0);
    cy.log('✓ Guest can search for works');
    
    // Step 3: View work details - verify rating disabled
    cy.get('h3').first().click({ force: true });
    cy.location('pathname').should('include', '/works');
    cy.get('h3').should('contain', 'RATINGS');
    cy.get('button[aria-label*="Rate"]').first().then(($btn) => {
      expect($btn).to.be.disabled;
      const cursor = window.getComputedStyle($btn[0]).cursor;
      expect(cursor).to.equal('not-allowed');
      const opacity = window.getComputedStyle($btn[0]).opacity;
      expect(opacity).to.equal('0.4');
    });
    cy.log('✓ Guest cannot rate - buttons disabled');
    
    // Step 4: Search for users as guest
    cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/');
    cy.get('input[aria-label="Search works or users"]').clear().type('alice');
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
    cy.location('pathname').should('include', '/search');
    cy.get('h3').should('have.length.greaterThan', 0);
    cy.log('✓ Guest can search for users');
    
    // Step 5: View alice's user profile - verify no follow button for guests
    cy.contains('h3', 'alice').click({ force: true });
    cy.location('pathname').should('include', '/profile');
    cy.get('h1, h2, img[alt*="avatar"], img[alt*="profile"]').should('have.length.greaterThan', 0);
    
    // Explicitly verify follow button does NOT exist for guests
    cy.get('button').filter((i, el) => 
      el.innerText && (el.innerText.includes('+ Follow') || el.innerText.includes('✕ Unfollow'))
    ).should('not.exist');
    
    // Verify attempting to access follow functionality fails (button doesn't exist)
    cy.get('button').filter((i, el) => el.innerText.includes('Follow')).should('have.length', 0);
    
    cy.get('button').should('contain', 'Back');
    cy.log('✓ Guest cannot follow - follow button does not exist');
    
    // Step 6: Verify recommendations page blocked
    cy.get('a[href="/recommendations"], [aria-label*="recommendations"], [aria-label*="Recommendations"]').then(($btn) => {
      cy.wrap($btn).first().click({ force: true });
      cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    });
    cy.get('input[type="text"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.log('✓ Guest blocked from recommendations');
    
    // Step 7: Verify guest header shows login only and not logout
    cy.get('[aria-label*="Login"], [aria-label*="login"]').should('be.visible');
    cy.get('button[aria-label="Logout"]').should('not.exist');
    cy.log('✓ Guest header shows login only');
    
    // Step 8: Create account with valid inputs
    cy.get('[aria-label*="Login"]').first().click({ force: true });
    cy.location('pathname').should('include', '/login');
    cy.get('span').filter((i, el) => 
      el.innerText.includes('Create an account')
    ).first().click({ force: true });

    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="email"]').clear().type(NEW_EMAIL);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);

    cy.get('div').filter((i, el) => 
      el.textContent && el.textContent.toLowerCase().includes('error')
    ).should('not.exist');
    cy.get('button[type="submit"]').should('be.visible').click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    cy.wait(1500);

    cy.get('button[aria-label="Logout"]', { timeout: 5000 }).should('be.visible');
    cy.contains(NEW_USER).should('be.visible');
    cy.log('✓ Account created and user logged in');
    
    // Step 9: Verify access to protected features
    cy.get('button[aria-label="Logout"]').should('be.visible');
    cy.contains(NEW_USER).should('be.visible');
    cy.get('[aria-label*="account"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    cy.contains(NEW_EMAIL).should('be.visible');

    cy.log('✓ Account can access protected features');
    
    // Step 10: Test login with invalid credentials
    cy.get('button[aria-label="Logout"]').should('be.visible').then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');

    cy.get('input[type="text"]').eq(0).type(NEW_USER);
    cy.get('input[type="password"]').eq(0).type('WrongPassword123');
    cy.get('button[type="submit"]').click({ force: true });

    cy.location('pathname', { timeout: 5000 }).should('include', '/login');
    cy.get('div[role="alert"]').should('be.visible');
    cy.log('✓ Login with invalid credentials fails');
    
    // Step 11: Login again with correct credentials
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    cy.contains(NEW_USER).should('not.exist');

    cy.get('input[type="email"]').should('not.exist');
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    cy.get('button[type="submit"]').click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');
    cy.wait(1000);

    cy.contains(NEW_USER).should('be.visible');
    cy.get('button[aria-label="Logout"]').should('be.visible');
    cy.log('✓ Successfully logged out and logged back in');
    
    // Final logout
    cy.get('button[aria-label="Logout"]').should('be.visible').then(($btn) => {
      cy.wrap($btn).click({ force: true });
    });
    cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    cy.log('✓ Final logout successful');
  });


});
