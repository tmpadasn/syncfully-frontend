describe('Full user journey (happy path)', () => {
  it('searches, opens recommendations, opens a work, adds it to Favourites, then visits shelves', () => {
    const user = { userId: 42, username: 'tester' };

    const works = [
      { workId: 1, title: 'Work One', coverUrl: 'https://placehold.co/200x300?text=1' },
      { workId: 2, title: 'Work Two', coverUrl: 'https://placehold.co/200x300?text=2' },
    ];

    const recommendations = [works[0]];

    const shelves = [{ shelfId: 10, name: 'Favourites', description: '', works: [] }];

    // ----- API stubs (match the real calls with wildcards) -----
    cy.intercept('GET', '**/api/works*', {
      statusCode: 200,
      body: { works, data: { works } },
    }).as('getWorks');

    cy.intercept('GET', '**/api/users/*/recommendations*', {
      statusCode: 200,
      body: { recommendations, data: { recommendations } },
    }).as('getRecs');

    // Work details call (adjust if your endpoint differs)
    cy.intercept('GET', '**/api/works/1*', {
      statusCode: 200,
      body: { data: works[0], ...works[0] },
    }).as('getWork1');

    // Shelves list (used by shelves page and/or by details modal depending on your app)
    cy.intercept('GET', '**/api/users/*/shelves*', {
      statusCode: 200,
      body: { data: { shelves } },
    }).as('getShelves');

    // Add to shelf (your earlier tests used /api/shelves/:id/works/:workId)
    cy.intercept('POST', '**/api/shelves/*/works/*', {
      statusCode: 200,
      body: { data: {} },
    }).as('addToShelf');

    // ----- Visit app as logged in -----
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      },
    });

    // 1) Search (Enter)
    cy.get('#search-input').clear().type('work{enter}');
    cy.wait('@getWorks');
    cy.location('pathname').should('eq', '/search');

    // 2) Open recommendations via lightning icon
    cy.get('[aria-label="View recommendations"]').first().click();
    cy.wait('@getRecs');
    cy.location('pathname').should('eq', '/recommendations');

    // 3) Open Work details by clicking the image (exists because WorkCard uses img alt=title)
    cy.get('main.page-main img[alt="Work One"]', { timeout: 10000 }).first().click({ force: true });
    cy.wait('@getWork1');
    cy.location('pathname').should('include', '/works/1');

    // 4) Click Add to Shelf button → modal opens → choose Favourites
    cy.contains('button', 'Add to Shelf', { timeout: 10000 }).click();

    // In the modal there is a "Favourites" option (button)
    cy.contains('button', 'Favourites', { timeout: 10000 }).click();

    cy.wait('@addToShelf');

    // Optional: success text from your AddToShelfBtn
    cy.contains(/Added to Favourites!|Work added to shelf!/).should('be.visible');

    // 5) Go to shelves from header grid icon
    cy.get('[aria-label="View my shelves"]').first().click();
    cy.wait('@getShelves');
    cy.location('pathname').should('eq', '/shelves');
    cy.contains('Favourites').should('be.visible');
  });
});
