describe('Search bar', () => {
  beforeEach(() => {
    // Visit the app root. Ensure your dev server is running (npm start)
    cy.visit('/');
  });

  it('navigates to /search?q=term when pressing Enter', () => {
    const term = 'hobbit';
    cy.get('#search-input').clear().type(`${term}{enter}`);

    cy.location('pathname').should('eq', '/search');
    cy.location('search').should('include', `q=${term}`);
  });

  it('navigates to /search?q=term after debounce when typing', () => {
    const term = 'potter';

    // Control timers so the component debounce behaves deterministically
    cy.clock();
    cy.get('#search-input').clear().type(term);

    // advance clock by the debounce delay used in the app (300ms)
    cy.tick(300);

    cy.location('pathname').should('eq', '/search');
    cy.location('search').should('include', `q=${term}`);
  });

  it('navigates to /search?q=term when clicking search button', () => {
    const term = 'dune';
    cy.get('#search-input').clear().type(term);
    cy.get('[aria-label="Submit search"]').click();

    cy.location('pathname').should('eq', '/search');
    cy.location('search').should('include', `q=${term}`);
  });

  it('shows all works when search is empty ', () => {

  const works = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    workId: i,
    title: `Work ${i}`,
    coverUrl: `https://placehold.co/200x300?text=${i}`
  }));

  // Stub the /works call used by the Search page
  cy.intercept('GET', '**/api/works*', {
    statusCode: 200,
    body: { works }
  }).as('getWorks');

  cy.visit('/');

  // Search input must be empty
  cy.get('#search-input').should('have.value', '');

  // User presses Enter
  cy.get('#search-input').type('{enter}');

  // Should navigate to /search (WITHOUT q parameter)
  cy.location('pathname', { timeout: 8000 }).should('eq', '/search');

  // Backend call for all works must happen
  cy.wait('@getWorks');

  // Should display ALL works on screen
  cy.get('img')
    .should('have.length', works.length);
});

it('shows empty results when no works match the query (unhappy path)', () => {
  cy.intercept('GET', '**/api/works*', {
    statusCode: 200,
    body: { works: [] }
  }).as('emptyResults');

  cy.visit('/');

  cy.get('#search-input').type('unicorns {enter}');
  cy.wait('@emptyResults');

  cy.contains('No results found').should('be.visible');
  //cy.get('img').should('have.length', 0);
});


  // const useRealBackend = Cypress.env('USE_REAL_BACKEND') === true || Cypress.env('USE_REAL_BACKEND') === 'true';

  // (useRealBackend ? it.skip : it)('shows no-results message when search backend fails', () => {
  //   const term = 'nothinghere123';

  //   // Stub the search endpoint to fail so the search page falls back to an empty result set
  //   cy.intercept('GET', '**/search*', { statusCode: 500, body: {} }).as('searchFail');

  //   cy.get('#search-input').clear().type(`${term}{enter}`);

  //   // Wait for the failed search request and assert the UI shows the empty message
  //   cy.wait('@searchFail');
  //   cy.location('pathname').should('eq', '/search');
  //   cy.contains(`No results found for "${term}"`, { timeout: 10000 }).should('be.visible');
  // });

  //   it('blank search (space) shows all works', () => {
  //     const works = Array.from({ length: 5 }).map((_, i) => ({
  //       workId: i,
  //       title: `Work ${i}`,
  //       coverUrl: `https://placehold.co/200x300?text=${i}`,
  //     }));

  //     // Spy or stub the all-works endpoint which SearchResults calls when query.trim() === ''
  //     if (useRealBackend) {
  //       cy.intercept('GET', '**/works*').as('allWorks');
  //     } else {
  //       cy.intercept('GET', '**/works*', { statusCode: 200, body: { works } }).as('allWorks');
  //     }

  //     // Type a single space and press Enter to simulate a blank search
  //     cy.get('#search-input').clear().type(' {enter}');

  //     // Wait for the all-works request and assert the results view shows the works count
  //     cy.wait('@allWorks');

  //     // The results page renders an H2 with text like 'WORKS (N)'
  //     cy.contains(/^WORKS \(\d+\)$/).should('contain.text', `WORKS (${works.length})`);
  //   });
});