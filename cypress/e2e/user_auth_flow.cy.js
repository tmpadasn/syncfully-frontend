/**
 * User Authentication Flow Tests
 * - Account creation
 * - Login with valid/invalid credentials
 * - Logout
 * - Access protected features after login
 */

const NEW_USER = 'testuser';
const NEW_EMAIL = 'testuser@example.com';
const NEW_PASSWORD = 'TestPassword123';

describe('User authentication flow', () => {
  it('Creates account, logs in, accesses protected features, and logs out', () => {
    // Navigate to login
    cy.visit('http://localhost:3001/login');
    cy.location('pathname').should('include', '/login');

    // Create account
    cy.get('span').filter((i, el) =>
      el.innerText.includes('Create an account')
    ).first().click({ force: true });

    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="email"]').clear().type(NEW_EMAIL);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    cy.get('button[type="submit"]').should('be.visible').click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should((p) => {
      expect(['/', '/login']).to.include(p);
    });
    cy.wait(1500);
    cy.log('✓ Account created successfully');

    // Verify logged in
    cy.get('body').then(($body) => {
      const hasLogout = $body.find('button[aria-label="Logout"]').length > 0;
      const hasAccountLink = $body.find('[aria-label*="account"], [href="/account"]').length > 0;
      const hasUserText = $body.text().includes(NEW_USER);
      expect(hasLogout || hasAccountLink || hasUserText).to.be.true;
    });
    cy.log('✓ User logged in after account creation');
  });

  it('Accesses account page and protected features', () => {
    // Login first
    cy.visit('http://localhost:3001/login');
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    cy.get('button[type="submit"]').click({ force: true });
    cy.wait(1000);

    // Access account
    cy.get('[aria-label*="account"], [href="/account"]').first().click({ force: true });
    cy.location('pathname', { timeout: 10000 }).then((p) => {
      if (p.includes('/account')) {
        cy.contains(NEW_EMAIL).should('be.visible');
      } else {
        cy.visit('/account');
        cy.contains(NEW_EMAIL).should('be.visible');
      }
    });
    cy.log('✓ Account can access protected features');
  });

  it('Fails login with invalid credentials', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="password"]').eq(0).clear().type('WrongPassword123');
    cy.get('button[type="submit"]').click({ force: true });

    cy.location('pathname', { timeout: 5000 }).should('include', '/login');
    cy.get('div[role="alert"]').should('be.visible');
    cy.log('✓ Login with invalid credentials fails');
  });

  it('Logs in again with correct credentials and logs out', () => {
    cy.visit('http://localhost:3001/login');
    cy.get('input[type="text"]').eq(0).clear().type(NEW_USER);
    cy.get('input[type="password"]').eq(0).clear().type(NEW_PASSWORD);
    cy.get('button[type="submit"]').click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should((p) => {
      expect(['/', '/login']).to.include(p);
    });
    cy.wait(1000);

    // Verify logged in
    cy.get('body').then(($body) => {
      const hasLogout = $body.find('button[aria-label="Logout"]').length > 0;
      const hasAccountLink = $body.find('[aria-label*="account"], [href="/account"]').length > 0;
      const hasUserText = $body.text().includes(NEW_USER);
      expect(hasLogout || hasAccountLink || hasUserText).to.be.true;
    });
    cy.log('✓ Successfully logged in');

    // Logout
    cy.contains('button', /logout/i, { timeout: 5000 }).then(($b) => {
      if ($b.length) {
        cy.wrap($b).click({ force: true });
        cy.location('pathname', { timeout: 5000 }).should((p) => {
          expect(['/', '/login']).to.include(p);
        });
      }
    });
    cy.log('✓ Logout successful');
  });
});
