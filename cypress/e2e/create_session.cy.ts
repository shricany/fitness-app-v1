describe('Create Session flow', () => {
  beforeEach(() => {
    // stub modules list
    cy.intercept('GET', '**/rest/v1/modules**', {
      statusCode: 200,
      body: [
        { id: 'mod-1', title: 'Demo Module' },
        { id: 'mod-2', title: 'HIIT' },
      ],
    }).as('getModules');

    // stub session creation
    cy.intercept('POST', '**/rest/v1/exercise_sessions**', (req) => {
      req.reply({ statusCode: 201, body: { id: 'sess-123', title: req.body.title } });
    }).as('createSession');

    // stub participants insert
    cy.intercept('POST', '**/rest/v1/session_participants**', { statusCode: 201, body: {} }).as('addParticipant');

    // stub invites insert
    cy.intercept('POST', '**/rest/v1/session_invites**', { statusCode: 201, body: {} }).as('createInvites');
  });

  it('creates a session via the page form (stubbed backend)', () => {
    cy.visit('/create-session');
    cy.wait('@getModules');
    cy.get('input[placeholder="e.g., Morning Yoga Session"]').type('Cypress Demo Session');
    cy.get('select').select('mod-1');
    cy.get('textarea[placeholder="user1@example.com, user2@example.com"]').type('a@a.com, b@b.com');
    cy.get('button').contains('Create Session').click();

    cy.wait('@createSession');
    cy.wait('@addParticipant');
    cy.wait('@createInvites');

    cy.url().should('include', '/session/sess-123');
  });

  it('creates a session via the quick modal (mobile) - stubbed', () => {
    cy.visit('/');
    // open quick modal by clicking the Create button in the header
    cy.get('button[aria-label="quick-create-session"]').click();
    cy.wait('@getModules');
    cy.get('input').first().type('Quick Cypress Session');
    cy.get('select').select('mod-2');
    cy.get('input').eq(1).type('x@x.com');
    cy.get('button').contains('Create').click();

    cy.wait('@createSession');
    cy.wait('@addParticipant');
    cy.wait('@createInvites');

    cy.url().should('include', '/session/sess-123');
  });
});
