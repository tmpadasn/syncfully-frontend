/**
 * ==================== EDIT ACCOUNT FLOW ====================
 * This Cypress test suite verifies the account edit functionality including:
 * - Navigating to edit account page
 * - Editing email address
 * - Saving changes
 * - Validating error handling for invalid inputs
 * 
 * Note: testIsolation is disabled for this file to preserve session between tests
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';
const WRONG_PASSWORD = 'wrongpassword';

describe('Edit profile', { testIsolation: false }, () => {
  
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

  // ----- TEST 1: LOGIN WITH WRONG PASSWORD -----
  it('Step 1: Login with wrong password fails', () => {
    // Navigate to home
    cy.visit('http://localhost:3001/');
    
    // Click sign in button in the middle of the page (banner button)
    cy.contains('button, a, span', /Sign in|Log in/i).filter(':visible').first().click({ force: true });
    cy.location('pathname').should('include', 'login');
    
    // Enter correct username but wrong password (manually, not using login helper)
    cy.get('input[type="text"]').first().type(TEST_USER);
    cy.get('input[type="password"]').type(WRONG_PASSWORD);
    cy.get('button[type="submit"]').click();
    
    // Verify we're still on login page (not redirected to home)
    cy.location('pathname', { timeout: 5000 }).should('include', 'login');
    
    // Verify error message is displayed with role="alert"
    cy.get('div[role="alert"]').should('be.visible').and('contain', 'The credentials dont match');
  });

  // ----- TEST 2: LOGIN SUCCESSFULLY -----
  it('Step 2: Logs in successfully with correct password', () => {
    login(TEST_USER, TEST_PASSWORD);
    cy.location('pathname').should('eq', '/');
    cy.contains(TEST_USER).should('be.visible');
  });

  // ----- TEST 3: EDIT PROFILE -----
  it('Step 3: Edits account email and saves changes', () => {
    // Click on account icon/link to navigate to account page
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    
    // Navigate to edit page
    cy.get('button').filter((i, el) => el.innerText.includes('Edit')).first().click({ force: true });
    cy.location('pathname').should('include', '/account/edit');
    
    // Verify edit page layout
    cy.get('h1').filter((i, el) => el.textContent.includes('Edit Profile')).should('be.visible');
    cy.get('input[name="email"]').should('exist');
    
    // Update email
    const newEmail = `${TEST_USER}.updated@example.com`;
    cy.get('input[name="email"]').clear().type(newEmail);
    
    // Save changes
    cy.get('button').filter((i, el) => el.innerText.includes('Save')).first().click({ force: true });
    
    // Wait for redirect back to account page
    cy.location('pathname', { timeout: 10000 }).should('eq', '/account');
    
    // Verify the updated email is displayed
    cy.contains(newEmail).should('be.visible', { timeout: 5000 });
  });

  // ----- TEST 4: EDIT ACCOUNT WITH INVALID EMAIL -----
  it('Step 4: Edit account with invalid email fails', () => {
    // Click on account icon/link to navigate to account page
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    
    // Navigate to edit page
    cy.get('button').filter((i, el) => el.innerText.includes('Edit')).first().click({ force: true });
    cy.location('pathname').should('include', '/account/edit');
    
    // Try to save with invalid email
    cy.get('input[name="email"]').clear().type('invalid-email-format');
    cy.get('button').filter((i, el) => el.innerText.includes('Save')).first().click({ force: true });
    
    // Verify error message or page doesn't redirect
    cy.location('pathname').should('include', '/account/edit');
    cy.get('div').filter((i, el) => 
      el.textContent && (el.textContent.toLowerCase().includes('error') || el.textContent.toLowerCase().includes('invalid'))
    ).should('be.visible');
  });


});
