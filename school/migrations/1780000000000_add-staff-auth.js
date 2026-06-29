/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Alter Role enum to add STAFF
  pgm.addTypeValue('Role', 'STAFF');

  // Add username and passwordHash to User table
  pgm.addColumn('User', {
    username: { type: 'text', unique: true, notNull: false },
    passwordHash: { type: 'text', notNull: false },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn('User', 'passwordHash');
  pgm.dropColumn('User', 'username');
  // Note: node-pg-migrate does not easily support removing enum values in Postgres.
};
