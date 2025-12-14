/**
 * ==================== USERS INTERACTION WORKFLOW ====================
*
* Users interaction flow:
 * - Logging in
 * - Searching for and following user
 * - Navigating to following section to confirm follow
 * - Unfollowing another user from account following section
 * - Verifying following section after actions
 * - Logging out
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';
const TO_FOLLOW_USER = 'david';
const TO_UNFOLLOW_USER = 'bob';

describe('Users interaction', () => {
  
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

  const logout = () => {
    cy.get('button[aria-label="Logout"]').should('be.visible').click({ force: true });
    cy.location('pathname', { timeout: 5000 }).should('eq', '/login');
  };

  const searchAndFilterUser = (username) => {
    cy.get('input[aria-label="Search works or users"]').clear().type(username);
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
  };

  // ----- COMPLETE USER INTERACTION WORKFLOW -----
  it('Complete workflow: Login, Follow, Unfollow, Verify', () => {
    // Step 1: Login
    login(TEST_USER, TEST_PASSWORD);
    cy.location('pathname').should('eq', '/');
    cy.contains(TEST_USER).should('be.visible');

    cy.get('body').then(($body) => {
      if (!$body.text().includes(TEST_USER)) {
        cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
      }
    });
    cy.log('✓ Logged in successfully');
    
    // Step 2: Search and follow user
    searchAndFilterUser(TO_FOLLOW_USER);
    cy.get('h3').contains(TO_FOLLOW_USER).click({ force: true });
    cy.location('pathname').should('include', '/profile');
    
    // Verify profile loaded
    cy.get('img').filter((i, el) => el.alt && (el.alt.includes('avatar') || el.alt.includes('profile'))).should('exist');
    cy.get('div').filter((i, el) => el.textContent.includes('EMAIL ADDRESS')).should('be.visible');
    
    // Follow the user
    cy.scrollTo('bottom', { ensureScrollable: false });
    cy.get('button').filter((i, el) => el.innerText.includes('+ Follow')).first().should('be.visible').click({ force: true });
    cy.get('button').filter((i, el) => el.innerText.includes('✕ Unfollow')).should('be.visible', { timeout: 10000 });
    cy.log('✓ Followed user: ' + TO_FOLLOW_USER);
    
    // Step 3: Navigate to account and verify following section
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    cy.contains('👫 Following').should('be.visible');
    
    // Verify TO_FOLLOW_USER in following section
    cy.contains('👫 Following').parent().within(() => {
      cy.get('div').filter((i, el) => el.textContent.trim() === TO_FOLLOW_USER).should('exist');
    });
    cy.log('✓ Verified followed user in account following section');
    
    // Step 4: Unfollow TO_UNFOLLOW_USER from following section
    cy.contains('👫 Following').parent().within(() => {
      cy.get('div').filter((i, el) => el.textContent.trim() === TO_UNFOLLOW_USER).first().click({ force: true });
    });
    
    cy.location('pathname', { timeout: 10000 }).should('include', '/profile');
    cy.scrollTo('bottom', { ensureScrollable: false });
    
    // Unfollow
    cy.get('button').filter((i, el) => el.innerText.includes('✕ Unfollow')).first().should('be.visible').click({ force: true });
    cy.get('button').filter((i, el) => el.innerText.includes('+ Follow')).should('be.visible', { timeout: 10000 });
    cy.log('✓ Unfollowed user: ' + TO_UNFOLLOW_USER);
    
    // Step 5: Verify TO_FOLLOW_USER still in following section and TO_UNFOLLOW_USER is NOT there
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    
    cy.contains('👫 Following').parent().within(() => {
      cy.get('div').filter((i, el) => el.textContent.trim() === TO_FOLLOW_USER).should('exist');
      cy.get('div').filter((i, el) => el.textContent.trim() === TO_UNFOLLOW_USER).should('not.exist');
    });
    cy.log('✓ Verified ' + TO_FOLLOW_USER + ' still in following, ' + TO_UNFOLLOW_USER + ' removed');
    
    // Step 6: Logout
    logout();
    cy.log('✓ Logged out successfully');
  });

});
