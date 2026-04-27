/**
 * Fixture to check that re-export aliases (`export { foo as bar }`)
 * are not flagged as type assertions.
 */
const value = 1;

export { value as exported };
