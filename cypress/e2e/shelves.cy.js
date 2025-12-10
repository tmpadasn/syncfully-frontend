describe('Shelves page', () => {
  const useRealBackend = Cypress.env('USE_REAL_BACKEND') === true || Cypress.env('USE_REAL_BACKEND') === 'true';

  const user = { userId: 9001, username: 'shelftester' };

  it('creates a new shelf (happy path)', () => {
    const newShelf = { shelfId: 111, name: 'Test Shelf', description: 'My test shelf', works: [] };

    // Stub or spy GET shelves and POST create depending on env
    if (useRealBackend) {
      cy.intercept('GET', '**/users/*/shelves').as('getShelves');
      cy.intercept('POST', `**/users/${user.userId}/shelves`).as('createShelf');
    } else {
      // Backend responses are wrapped in `data` per the client's extractResponseData
      cy.intercept('GET', `**/users/${user.userId}/shelves`, { statusCode: 200, body: { data: { shelves: [] } } }).as('getShelves');
      cy.intercept('POST', `**/users/${user.userId}/shelves`, { statusCode: 201, body: { data: newShelf } }).as('createShelf');
    }

    // Visit shelves with auth set
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      }
    });

    // Navigate to shelves page
    cy.visit('/shelves');

    // Wait for initial shelves load
    cy.wait('@getShelves');

    // Open create modal
    cy.contains('New Shelf').click();

    // Fill form
    cy.get('input[placeholder*="Favorites"]').clear().type(newShelf.name);
    cy.get('textarea[placeholder*="What is this shelf for?"]').clear().type(newShelf.description);

    // Submit
    cy.contains('Create Shelf').click();

    // Wait for create call
    cy.wait('@createShelf');

    // Success message appears (stubbed UI uses this text)
    cy.contains('Shelf created successfully!', { timeout: 10000 }).should('be.visible');

    // New shelf appears in the list
    cy.contains(newShelf.name, { timeout: 10000 }).should('be.visible');
  });
    it('removes a work from a shelf', () => {
    const user = { userId: 123 };

    const shelves = [
      { shelfId: 5, name: "Books", works: [10] }
    ];

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authUser', JSON.stringify(user));
      }
    });

    cy.intercept('GET', '/api/users/123/shelves', { statusCode: 200, body: { data: { shelves } } }).as('loadShelves');

    cy.intercept('GET', '/api/works/10', { statusCode: 200, body: { data: { workId: 10, title: "Harry Potter", coverUrl: "/hp.jpg" } } }).as('loadWork');

    cy.intercept('DELETE', '/api/shelves/5/works/10', { statusCode: 200, body: { data: {} } }).as('removeWork');

    cy.visit('/shelves');
    cy.wait('@loadShelves');

    cy.contains("Books").click();
    cy.wait('@loadWork');

    // First click → highlight remove
    // Click the remove button rendered on the work card
    cy.contains("Harry Potter").closest('div').within(() => {
      cy.get('button[title="Remove from shelf"]').click({ force: true });
    });

    // Second click → confirm remove
    cy.contains("✓ Remove").click();

    cy.wait('@removeWork');

    cy.contains("Harry Potter").should("not.exist");
  });

    it('shows empty state when shelves fail to load (unhappy path)', () => {
  const user = { userId: 123 };

  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('authUser', JSON.stringify(user));
    }
  });

  // Force failure
  cy.intercept('GET', '**/api/users/123/shelves', {
    statusCode: 500,
    body: {}
  }).as('failShelves');

  cy.visit('/shelves');

  cy.wait('@failShelves');

  // The page does NOT show an error banner → it goes to empty state
  cy.contains("You don't have any shelves yet").should('be.visible');
});



// //   it('deletes a shelf (happy path)', () => {
// //     const existingShelf = { shelfId: 222, name: 'DeleteMe', description: '', works: [] };

// //     // Prepare GET to return a shelf that we will delete
// //     if (useRealBackend) {
// //       cy.intercept('GET', '**/users/*/shelves').as('getShelves2');
// //       cy.intercept('DELETE', `**/shelves/${existingShelf.shelfId}`).as('deleteShelf');
// //     } else {
// //       cy.intercept('GET', `**/users/${user.userId}/shelves`, { statusCode: 200, body: { shelves: [existingShelf] } }).as('getShelves2');
// //       cy.intercept('DELETE', `**/shelves/${existingShelf.shelfId}`, { statusCode: 200, body: { success: true } }).as('deleteShelf');
// //     }

// //     cy.visit('/', {
// //       onBeforeLoad(win) {
// //         win.localStorage.setItem('authUser', JSON.stringify(user));
// //       }
// //     });
// //     cy.visit('/shelves');

// //     cy.wait('@getShelves2');

// //     // Ensure shelf exists
// //     cy.contains(existingShelf.name).should('be.visible');

// //     // Click Delete for that shelf - find its header then Delete button
// //     cy.contains(existingShelf.name)
// //       .closest('div')
// //       .within(() => {
// //         cy.contains('Delete').click();
// //       });

// //     // Confirm delete in dialog
// //     cy.contains('Delete').filter(':visible').last().click();

// //     cy.wait('@deleteShelf');

// //     // Success message and shelf removed
// //     cy.contains('Shelf deleted successfully!', { timeout: 10000 }).should('be.visible');
// //     cy.contains(existingShelf.name).should('not.exist');
// //   });

//   (useRealBackend ? it.skip : it)('shows error when creating shelf fails (unhappy path)', () => {
//     const badShelf = { name: 'BadShelf' };

//     // Stub GET shelves to empty, and POST create to 500
//     cy.intercept('GET', `**/users/${user.userId}/shelves`, { statusCode: 200, body: { shelves: [] } }).as('getShelves3');
//     cy.intercept('POST', `**/users/${user.userId}/shelves`, { statusCode: 500, body: { message: 'Server error' } }).as('createFail');

//     cy.visit('/', {
//       onBeforeLoad(win) {
//         win.localStorage.setItem('authUser', JSON.stringify(user));
//       }
//     });
//     cy.visit('/shelves');

//     cy.wait('@getShelves3');

//     cy.contains('New Shelf').click();
//     cy.get('input[placeholder*="Favorites"]').clear().type(badShelf.name);
//     cy.contains('Create Shelf').click();

//     cy.wait('@createFail');

//     // The UI should display an error message
//     cy.contains('An error occurred', { timeout: 10000 }).should('be.visible');
//   });
});
