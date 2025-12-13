describe('Full user journey (unhappy path with logged-in user)', () => {
  it('handles backend failures gracefully while user remains logged in', () => {

    const user = { userId: 99, username: 'unhappyUser' };

    // ❌ Backend failures
    cy.intercept('GET', '**/api/works*', { statusCode: 500 }).as('worksFail');
    cy.intercept('GET', '**/api/users/*/recommendations*', { statusCode: 500 }).as('recsFail');
    cy.intercept('GET', '**/api/users/*', { statusCode: 500 }).as('profileFail');

    // Logged-in user
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      }
    });

    // 1️⃣ Go to recommendations → backend fails
    cy.get('[aria-label="View recommendations"]').click();
    cy.wait('@worksFail');

    // UI shows fallback message
    cy.contains('Unable to load recommendations', { timeout: 10000 })
      .should('be.visible');

    // 2️⃣ Go to account page → backend fails but UI still works
    cy.visit('/account');

    // Username from localStorage still visible
    cy.contains(user.username, { timeout: 10000 }).should('be.visible');

    // 3️⃣ Try visiting another user's profile (backend fails)
    cy.visit('/profile/123');

    // Page does not crash → header still exists
    cy.get('header').should('be.visible');

    // 4️⃣ User is STILL logged in
    cy.get('[aria-label="Logout"]').should('be.visible');
  });
});
