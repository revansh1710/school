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
  // Alter Role enum to add SUPER_ADMIN
  pgm.addTypeValue('Role', 'SUPER_ADMIN');

  // Add phone column to User table
  pgm.addColumn('User', {
    phone: { type: 'text', notNull: false },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumn('User', 'phone');
  // Note: node-pg-migrate does not easily support removing enum values in Postgres.
};
