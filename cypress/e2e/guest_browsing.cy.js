/**
 * Guest User Browsing Tests
 * - Accessing home page as guest
 * - Searching for works and viewing details (without rating)
 * - Searching for users and viewing profiles (without follow)
 * - Attempting to access protected features (recommendations)
 */

describe('Guest user browsing', () => {
  it('Guest can browse home, search works, and view details', () => {
    // Home page
    cy.visit('http://localhost:3001/');
    cy.location('pathname').should('eq', '/');
    cy.get('h1, h2').first().should('be.visible');
    cy.contains('button, span, a', /Sign in|Log in|Create/i).should('be.visible');
    cy.contains("WEEK\'S TOP 10").should('be.visible');
    cy.log('✓ Guest can view home page');

    // Search for works
    cy.get('input[aria-label="Search works or users"]').clear().type('music');
    cy.contains('TYPE').click({ force: true });
    cy.contains('WORKS').click({ force: true });
    cy.location('pathname').should('include', '/search');
    cy.get('h3, [class*="card"], [class*="item"]').should('have.length.greaterThan', 0);
    cy.log('✓ Guest can search for works');

    // View work details - verify rating disabled
    cy.get('h3').first().click({ force: true });
    cy.location('pathname').should('include', '/works');
    cy.get('h3').should('contain', 'RATINGS');
    cy.get('button[aria-label*="Rate"]').first().then(($btn) => {
      expect($btn).to.be.disabled;
      expect(window.getComputedStyle($btn[0]).cursor).to.equal('not-allowed');
      expect(window.getComputedStyle($btn[0]).opacity).to.equal('0.4');
    });
    cy.log('✓ Guest cannot rate - buttons disabled');
  });

  it('Guest can search for users and view profiles', () => {
    cy.visit('http://localhost:3001/');
    cy.get('input[aria-label="Search works or users"]').clear().type('alice');
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
    cy.location('pathname').should('include', '/search');
    cy.get('h3').should('have.length.greaterThan', 0);
    cy.log('✓ Guest can search for users');

    // View user profile - verify no follow button
    cy.contains('h3', 'alice').click({ force: true });
    cy.location('pathname').should('include', '/profile');
    cy.get('h1, h2, img[alt*="avatar"], img[alt*="profile"]').should('have.length.greaterThan', 0);
    cy.get('button').filter((i, el) =>
      el.innerText && (el.innerText.includes('+ Follow') || el.innerText.includes('✕ Unfollow'))
    ).should('not.exist');
    cy.log('✓ Guest cannot follow - follow button does not exist');
  });

  it('Guest is blocked from recommendations and protected features', () => {
    cy.visit('http://localhost:3001/');
    cy.get('a[href="/recommendations"], [aria-label*="recommendations"], [aria-label*="Recommendations"]').then(($btn) => {
      cy.wrap($btn).first().click({ force: true });
      cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    });
    cy.get('input[type="password"]').should('be.visible');
    cy.log('✓ Guest blocked from recommendations');

    // Verify guest header
    cy.get('[aria-label*="Login"], [aria-label*="login"]').should('be.visible');
    cy.get('button[aria-label="Logout"]').should('not.exist');
    cy.log('✓ Guest header shows login only');
  });
});
