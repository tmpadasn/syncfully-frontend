/**
 * Cypress E2E Test Helpers for Home Page
 */

/**
 * Login a user
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 */
export const loginUser = (username = 'alice', password = 'alice') => {
  cy.visit('/login');
  cy.get('input[type="text"]').type(username);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/home');
};

/**
 * Logout a user
 */
export const logoutUser = () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
};

/**
 * Wait for home page to fully load
 */
export const waitForHomePageLoad = () => {
  cy.get('[data-testid="page-main"]', { timeout: 5000 }).should('be.visible');
  cy.wait(1000); // Additional buffer for API calls
};

/**
 * Verify welcome message is visible
 */
export const verifyWelcomeMessage = (username) => {
  cy.contains(`Welcome back ${username}`).should('be.visible');
};

/**
 * Verify section title is visible
 */
export const verifySectionTitle = (title) => {
  cy.contains(title).should('be.visible');
};

/**
 * Verify carousel is rendered
 */
export const verifyCarouselExists = () => {
  cy.get('[data-testid="home-carousel"]').should('exist').should('have.length.greaterThan', 0);
};

/**
 * Click on a work card
 */
export const clickWorkCard = (workTitle) => {
  cy.contains(workTitle).parent().click();
};

/**
 * Verify login banner is visible
 */
export const verifyLoginBanner = () => {
  cy.contains(/Unlock Your Personalized Experience/i).should('be.visible');
  cy.contains(/Sign In/i).should('be.visible');
  cy.contains(/Create Account/i).should('be.visible');
};

/**
 * Intercept API calls for mocking
 */
export const interceptPopularWorks = (works = []) => {
  cy.intercept('GET', '**/api/works/popular', {
    statusCode: 200,
    body: {
      success: true,
      data: works,
      message: 'Popular works fetched',
    },
  }).as('getPopularWorks');
};

export const interceptAllUsers = (users = []) => {
  cy.intercept('GET', '**/api/users', {
    statusCode: 200,
    body: {
      success: true,
      data: users,
      message: 'Users fetched',
    },
  }).as('getAllUsers');
};

export const interceptUserFollowing = (following = []) => {
  cy.intercept('GET', '**/api/users/*/following', {
    statusCode: 200,
    body: {
      success: true,
      data: { following },
      message: 'Following list fetched',
    },
  }).as('getUserFollowing');
};

/**
 * Wait for API calls
 */
export const waitForApiCalls = () => {
  cy.wait('@getPopularWorks', { timeout: 5000 }).then((interception) => {
    expect(interception.response.statusCode).to.equal(200);
  });
};
