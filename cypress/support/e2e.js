// Cypress support file - runs before each test

// Add custom commands
Cypress.Commands.add('tab', () => {
  cy.focused().trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

// Disable uncaught exception handling for cleaner test runs
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// Configure API timeout
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);