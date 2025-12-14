/**
 * ==================== USERS INTERACTION WORKFLOW ====================
 * This Cypress test suite verifies the user interaction workflow including:
 * - Logging in and out
 * - Searching for users
 * - Following and unfollowing users
 * - Navigating to the following section
 * 
 * It also includes negative path tests to ensure proper error handling.
 * 
 * Note: testIsolation is disabled for this file only to preserve session between tests
 */

const TEST_USER = 'alice';
const TEST_PASSWORD = 'alice';
const TARGET_USER = 'david';

describe('Users interaction', { testIsolation: false }, () => {
  
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

  const searchAndFilterUser = (username) => {
    cy.get('input[aria-label="Search works or users"]').clear().type(username);
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
  };

  // ----- BEFORE ALL: LOGIN ONCE -----
  before(() => {
    login(TEST_USER, TEST_PASSWORD);
  });

  // ----- TEST 1: LOGIN -----
  it('Step 1: Logs in successfully', () => {
    cy.location('pathname').should('eq', '/');
    cy.contains(TEST_USER).should('be.visible');
  });

  // ----- TEST 2: SEARCH, FILTER & FOLLOW USER -----
  it('Step 2: Searches with user filter for a user and follows them', () => {
    // Make sure we're on home page
    cy.get('body').then(($body) => {
      if (!$body.text().includes(TEST_USER)) {
        // If not on home, click home/logo to navigate
        cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
      }
    });

    // Search for target user and filter to users only
    searchAndFilterUser(TARGET_USER);
    
    // Click on the user profile
    cy.get('h3').contains(TARGET_USER).click({ force: true });
    cy.location('pathname').should('include', '/profile');
    
    // Verify profile page loaded
    cy.get('img').filter((i, el) => el.alt && (el.alt.includes('avatar') || el.alt.includes('profile'))).should('exist');
    cy.get('div').filter((i, el) => el.textContent.includes('EMAIL ADDRESS')).should('be.visible');
    
    // Scroll to action buttons
    cy.scrollTo('bottom', { ensureScrollable: false });
    
    // Follow the user - button should exist
    cy.get('button').filter((i, el) => el.innerText.includes('+ Follow')).first().should('be.visible').click({ force: true });
    
    // Wait a bit for the button to update, then verify it changed to Unfollow
    cy.get('button').filter((i, el) => el.innerText.includes('✕ Unfollow')).should('be.visible', { timeout: 10000 });
  });

  // ----- TEST 3: NAVIGATE FOLLOWING & UNFOLLOW -----
  it('Step 3: Navigates to following section and unfollows a user', () => {
    // Click on account icon/link to navigate to account page
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    cy.contains('👫 Following').should('be.visible');
    
    // Find and click a user in the Following section (NOT david)
    cy.contains('👫 Following').parent().then(($followingSection) => {
      // Find all user avatar images in this section
      cy.wrap($followingSection).find('img[alt]').then(($imgs) => {
        let userCardToClick = null;
        let foundUsername = null;
        
        // Iterate through images to find one that's NOT david
        for (let i = 0; i < $imgs.length; i++) {
          const $img = $imgs.eq(i);
          const $userCard = $img.parent();
          const username = $userCard.find('div').text().trim();
          
          if (username && username !== TARGET_USER && username !== TEST_USER) {
            userCardToClick = $userCard;
            foundUsername = username;
            break;
          }
        }
        
        // If all users are david or test user, just use the first one
        if (!userCardToClick && $imgs.length > 0) {
          userCardToClick = $imgs.eq(0).parent();
          foundUsername = userCardToClick.find('div').text().trim();
        }
        
        if (userCardToClick) {
          cy.log(`Unfollowing user: ${foundUsername}`);
          cy.wrap(userCardToClick).click({ force: true });
        }
      });
    });
    
    // Verify we're on a profile page
    cy.location('pathname', { timeout: 10000 }).should('include', '/profile');
    cy.scrollTo('bottom', { ensureScrollable: false });
    
    // Unfollow the user - button should exist
    cy.get('button').filter((i, el) => el.innerText.includes('✕ Unfollow')).first().should('be.visible').click({ force: true });
    
    // Wait for unfollow to complete
    cy.get('button').filter((i, el) => el.innerText.includes('+ Follow')).should('be.visible', { timeout: 10000 });
  });

  // ----- TEST 4: VERIFY FOLLOWING SECTION -----
  it('Step 4: Verifies following section after unfollow', () => {
    // Click on account icon/link to navigate to account page
    cy.get('[aria-label*="account"], [aria-label*="profile"], [href="/account"]').first().click({ force: true });
    cy.location('pathname').should('eq', '/account');
    
    // Verify target user IS in following section
    cy.contains('👫 Following').parent().within(() => {
      // Look for a div with the target user's name
      cy.get('div').filter((i, el) => el.textContent.trim() === TARGET_USER).should('exist');
    });
  });

  // ----- NEGATIVE PATH TESTS -----
  
  it('Negative: Cannot follow a user already followed', () => {
    // Navigate to home if needed
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Search works or users')) {
        cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
      }
    });
    
    searchAndFilterUser(TARGET_USER);
    cy.get('h3').contains(TARGET_USER).click({ force: true });
    cy.scrollTo('bottom', { ensureScrollable: false });
    
    // Button should show Unfollow (meaning already following)
    cy.get('button').filter((i, el) => el.innerText.includes('✕ Unfollow')).should('be.visible');
    cy.get('button').filter((i, el) => el.innerText.includes('+ Follow')).should('not.exist');
  });

  it('Negative: Search for non-existent user returns no results', () => {
    // Navigate to home if needed
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Search works or users')) {
        cy.get('a[href="/"], [aria-label*="home"]').first().click({ force: true });
      }
    });
    
    cy.get('input[aria-label="Search works or users"]').type('nonexistentuser12345');
    cy.contains('TYPE').click({ force: true });
    cy.contains('USERS').click({ force: true });
    
    // Verify no results shown (either empty state or no user cards visible)
    cy.get('h3').should('not.exist');
  });

  // ----- TEST 5: LOGOUT -----
  it('Step 5: Logs out successfully', () => {
    // Find and click logout button in the header
    cy.get('button[aria-label="Logout"]').should('be.visible').click({ force: true });
    
    // Verify redirected to home page after logout
    cy.location('pathname', { timeout: 5000 }).should('eq', '/');
    cy.contains(TEST_USER).should('not.exist');
  });
});
