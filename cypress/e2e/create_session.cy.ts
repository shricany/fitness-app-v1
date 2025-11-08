describe('Create Session flow', () => {
  it('loads the create session page and shows the form', () => {
    cy.visit('/create-session')
    cy.get('h1').contains('Create Exercise Session')
    cy.get('input[placeholder="e.g., Morning Yoga Session"]').should('exist')
    cy.get('select').should('exist')
    cy.get('textarea[placeholder="user1@example.com, user2@example.com"]').should('exist')
    cy.get('button').contains('Create Session').should('exist')
  })
})
