describe('Recommendations page', () => {

  it('renders recommendations for logged-in user', () => {

    const user = { userId: 123, username: "test" };

    const works = Array.from({ length: 10 }).map((_, i) => ({
      workId: i,
      title: `Work ${i}`,
      coverUrl: `https://placehold.co/200x300?text=${i}`
    }));

    const recommendations = works.slice(0, 5);

    // MUST MATCH YOUR REAL API CALLS!
    cy.intercept('GET', '**/api/works', { statusCode: 200, body: { works } }).as('getWorks');
    cy.intercept('GET', '**/api/users/*/recommendations', { statusCode: 200, body: { recommendations } }).as('getRecs');

    // Set auth BEFORE the app loads
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      }
    });

    // Instead of visiting /recommendations directly, click the header lightning icon
    // (FiZap) to exercise the same user flow
    cy.get('[aria-label="View recommendations"]', { timeout: 10000 }).click();

    // Wait for the backend calls
    cy.wait('@getWorks', { timeout: 15000 });
    cy.wait('@getRecs', { timeout: 15000 });

    // ✔ CHECK: Does the UI show the heading?
    cy.contains('We found some', { timeout: 15000 }).should('be.visible');

    // ✔ CHECK: At least the number of stubbed recommendation images are rendered inside main area
    cy.get('main.page-main', { timeout: 15000 })
      .find('img')
      .should('have.length.gte', recommendations.length);
  });

  it('clicking the lightning icon while logged in opens the recommendations page', () => {
    const user = { userId: 123, username: 'test' };

    const works = Array.from({ length: 10 }).map((_, i) => ({
      workId: i,
      title: `Work ${i}`,
      coverUrl: `https://placehold.co/200x300?text=${i}`
    }));

    const recommendations = works.slice(0, 4);

    // Stub backend calls (match both proxied and non-proxied paths)
    cy.intercept('GET', '**/works*', { statusCode: 200, body: { works } }).as('works2');
    cy.intercept('GET', '**/users/*/recommendations', { statusCode: 200, body: { recommendations } }).as('recs2');

    // Visit root with auth in localStorage so header shows the lightning link for logged-in users
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      }
    });

    // Click the lightning icon by aria-label
    cy.get('[aria-label="View recommendations"]', { timeout: 10000 }).click();

    // Should navigate to /recommendations
    cy.location('pathname', { timeout: 10000 }).should('eq', '/recommendations');

    // Wait for stubs and assert content
    cy.wait('@works2');
    cy.wait('@recs2');
    cy.contains('We found some', { timeout: 10000 }).should('be.visible');
  });
  it('shows an error message when backend fails (unhappy path)', () => {
  const user = { userId: 555, username: 'errortest' };

  // Fail the first API call (works list)
  cy.intercept('GET', '**/works*', {
    statusCode: 500,
    body: {}
  }).as('worksFail');

  // Make user logged in BEFORE the app loads
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('authUser', JSON.stringify(user));
    }
  });

  // Navigate via lightning icon
  cy.get('[aria-label="View recommendations"]', { timeout: 10000 }).click();

  // Wait for failing request
  cy.wait('@worksFail');

  // Check the exact message your UI displays
  cy.contains('Unable to load recommendations. Please try again later', { timeout: 10000 })
    .should('be.visible');
});


//   it('shows an error and empty lists when backend fails', () => {
//     const user = { userId: 555, username: 'errortest' };

//     // Simulate backend failure for the all-works call so the page falls back to error
//     // Note: when the works call fails the component short-circuits and does not
//     // request personalized recommendations, so we only wait on the works failure.
//     cy.intercept('GET', '**/works*', { statusCode: 500, body: {} }).as('worksFail');

//     cy.visit('/', {
//       onBeforeLoad(win) {
//         win.localStorage.setItem('authUser', JSON.stringify(user));
//       }
//     });

//     // Open recommendations via header
//     cy.get('[aria-label="View recommendations"]', { timeout: 10000 }).click();

//     // Wait for the failing works request (recommendations request is not made)
//     cy.wait('@worksFail');

//     // The page shows a top-level error message on failure
//     cy.contains('Unable to load recommendations. Please try again later.', { timeout: 10000 })
//       .should('be.visible');

//     // Each section should render its empty-state message
//     cy.contains('No recommendations available at the moment.').should('be.visible');
//     cy.contains('No profile-based recommendations available.').should('be.visible');
//     cy.contains("No friend-based recommendations available.").should('be.visible');
//   });





});

