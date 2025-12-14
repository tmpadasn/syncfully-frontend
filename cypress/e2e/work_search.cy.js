describe('Full user journey (happy path)', () => {
  it('searches, opens recommendations, opens a work, adds it to Favourites, then visits shelves', () => {
    // Use a real backend flow: fetch first user from backend and login via UI
    let username;
    let password;

    // ----- 0. GET FIRST USER FROM DATABASE -----
    cy.request('GET', 'http://localhost:3000/api/users').then((response) => {
      cy.log(`API Response: ${JSON.stringify(response.body)}`);
      expect(response.status).to.equal(200);

      let users = response.body;
      if (users.data) {
        users = users.data;
      }

      if (Array.isArray(users)) {
        expect(users.length).to.be.greaterThan(0);
        username = users[0].username;
        password = users[0].password || users[0].username;
      } else {
        const userList = Object.values(users);
        expect(userList.length).to.be.greaterThan(0);
        username = userList[0].username;
        password = userList[0].password || userList[0].username;
      }
    // Set up network spies for the rest of the flow
    cy.intercept('GET', '**/api/works*').as('getWorks');
    cy.intercept('GET', '**/api/users/*/recommendations*').as('getRecs');
    cy.intercept('GET', '**/api/works/*').as('getWork');
    cy.intercept('GET', '**/api/users/*/shelves*').as('getShelves');
    cy.intercept('POST', '**/api/shelves/*/works/*').as('addToShelf');

    // ----- 1. LOGIN -----
    // Use the first user from the backend; assume password === username
    const loggedInUsername = username;
    const loggedInPassword = password || username;
    cy.log(`Using user: ${loggedInUsername} with password: ${loggedInPassword}`);

    // Visit the login page directly to avoid clipped header link issues
    cy.visit('/login');
    cy.location('pathname', { timeout: 10000 }).should('include', 'login');

    // Fill in credentials and submit
    cy.get('input[type="text"]').first().clear().type(loggedInUsername);
    cy.get('input[type="password"]').clear().type(loggedInPassword);
    cy.get('button[type="submit"]').click();

    // Allow app to redirect and settle
    cy.wait(1500);
    cy.location('pathname', { timeout: 10000 }).should('eq', '/');

    // ----- 2️⃣ HOME PAGE VERIFICATION -----
    // Verify welcome message appears (showWelcome is set via sessionStorage)
    cy.contains(/welcome back/i, { timeout: 10000 }).should('be.visible');

    // Verify Friends' Favourites heading
    cy.contains("FRIENDS' FAVOURITES").should('exist');

    // Verify popular works heading
    cy.contains("WEEK'S TOP 10").should('exist');

    // Verify Recently sections
    cy.contains('RECENTLY WATCHED').should('exist');
    cy.contains('RECENTLY PLAYED').should('exist');

    // Verify at least some work images load (real backend)
    cy.get('img', { timeout: 10000 }).should('have.length.gte', 1);

    // 1) Choose a visible work from Home and search for it so results match the input
    cy.get('main.page-main img', { timeout: 15000 }).first().invoke('attr', 'alt').then((sampleTitle) => {
      // Use part of the title as the search query to simulate user's typing
      const words = (sampleTitle || '').split(/\s+/).slice(0, 2).join(' ');

      // Perform search using the extracted query
      cy.get('#search-input').clear().type(`${words}{enter}`);
      cy.wait('@getWorks', { timeout: 15000 });
      cy.location('pathname').should('include', '/search');

      // Assert the results include the sampled title
      cy.contains(sampleTitle, { timeout: 15000 }).scrollIntoView().should('be.visible');

      // Click the matching result to open details
      cy.get(`img[alt="${sampleTitle}"]`, { timeout: 15000 }).first().click({ force: true });
      cy.wait('@getWork', { timeout: 15000 });
      cy.location('pathname', { timeout: 10000 }).should('include', '/works/');

      // 4) Click Add to Shelf button → modal opens → choose Favourites
      cy.contains('button', 'Add to Shelf', { timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.contains('button', 'Favourites', { timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.wait('@addToShelf', { timeout: 15000 });

      // Optional: success text from your AddToShelfBtn
      cy.contains(/Added to Favourites!|Work added to shelf!/, { timeout: 10000 }).should('be.visible');

      // 5) Try pressing the header 'View my shelves' icon first (native DOM click), then fallback to visiting
      cy.get('body').then($body => {
        const el = $body.find('a[aria-label="View my shelves"]')[0];
        if (el) {
          cy.log('Clicking header shelves icon via native DOM click');
          el.click();
        } else {
          cy.log('Header shelves icon not found in DOM');
        }
      });

      // If clicking didn't navigate us, visit as a fallback
      // cy.location('pathname').then((p) => {
      //   if (!p.includes('/shelves')) {
      //     cy.visit('/shelves');
      //   }
      // });

      cy.wait('@getShelves', { timeout: 15000 });
      cy.location('pathname').should('include', '/shelves');

      // Expand Favourites shelf and check the work title exists
      cy.contains('Favourites', { timeout: 10000 }).scrollIntoView().click({ force: true });
      cy.contains(sampleTitle, { timeout: 15000 }).scrollIntoView().should('exist');
    });

    // Close the initial cy.request then chain
    });

    // (flow continues inside the first-image callback)
  });
});


