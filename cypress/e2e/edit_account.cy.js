/**
 * ==================== EDIT ACCOUNT FLOW ====================
 * 
 * Edit account workflow:
 * - Logging in with wrong password
 * - Logging in with valid credentials
 * - Navigating to edit account page
 * - Editing email address with invalid format
 * - Editing email address with valid format
 * - Saving changes
 * - Logging out
 * 
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';
const WRONG_PASSWORD = 'wrongpassword';

describe('Edit account', () => {
  
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

  // ----- COMPLETE ACCOUNT EDIT WORKFLOW -----
  it('Complete workflow: Wrong password, Login, Edit profile, Invalid email, Logout', () => {
    
    // Step 1: Test login with wrong password
    cy.visit('http://localhost:3001/');
    cy.contains('button, a, span', /Sign in|Log in/i).filter(':visible').first().click({ force: true });
    cy.location('pathname').should('include', 'login');

    cy.get('input[type="text"]').first().type(TEST_USER);
    cy.get('input[type="password"]').type(WRONG_PASSWORD);
    cy.get('button[type="submit"]').click();

    cy.location('pathname', { timeout: 5000 }).should('include', 'login');
    cy.get('div[role="alert"]').should('be.visible').and('contain', 'The credentials dont match');
    cy.log('✓ Verified wrong password fails');
    
    // Step 2: Login successfully
    login(TEST_USER, TEST_PASSWORD);
    cy.contains(TEST_USER).should('be.visible');
    cy.log('✓ Logged in successfully');
    
    // Step 3: Edit account with invalid email first
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');

    cy.get('button').filter((i, el) => el.innerText.includes('Edit')).first().click({ force: true });
    cy.location('pathname').should('include', '/account/edit');

    cy.get('input[name="email"]').clear().type('invalid-email-format');
    cy.get('button').filter((i, el) => el.innerText.includes('Save')).first().click({ force: true });
    cy.location('pathname').should('include', '/account/edit');

    cy.get('div').filter((i, el) => 
      el.textContent && (el.textContent.toLowerCase().includes('error') || el.textContent.toLowerCase().includes('invalid'))
    ).should('be.visible');
    cy.log('✓ Verified invalid email fails');
    
    // Step 4: Edit account with valid email
    cy.get('input[name="email"]').clear();
    const newEmail = `${TEST_USER}.updated@example.com`;
    
    cy.get('input[name="email"]').type(newEmail);
    cy.get('button').filter((i, el) => el.innerText.includes('Save')).first().click({ force: true });
    cy.location('pathname', { timeout: 10000 }).should('eq', '/account');
    cy.contains(newEmail).should('be.visible', { timeout: 5000 });
    cy.log('✓ Successfully edited account email with valid email');
    
    // Step 5: Logout
    cy.get('button[aria-label="Logout"]').should('be.visible').click({ force: true });
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
    cy.contains(TEST_USER).should('not.exist');
    cy.log('✓ Logged out successfully');
  });
});
