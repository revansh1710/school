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
  // Create Class table
  pgm.createTable('Class', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'text', notNull: true }, // 'Nursery', 'LKG', 'UKG', 'Grade 1', etc.
    order: { type: 'integer', notNull: true }, // for sorting
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create Section table
  pgm.createTable('Section', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    classId: { type: 'uuid', notNull: true, references: '"Class"(id)', onDelete: 'CASCADE' },
    name: { type: 'text', notNull: true }, // 'A', 'B', 'C'
    maxCapacity: { type: 'integer', notNull: true, default: 40 },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Add new columns to Student table
  pgm.addColumns('Student', {
    classId: { type: 'uuid', references: '"Class"(id)', onDelete: 'SET NULL' },
    sectionId: { type: 'uuid', references: '"Section"(id)', onDelete: 'SET NULL' },
    rollNumber: { type: 'integer' },
    dateOfBirth: { type: 'date' },
    gender: { type: 'text' },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns('Student', ['classId', 'sectionId', 'rollNumber', 'dateOfBirth', 'gender']);
  pgm.dropTable('Section');
  pgm.dropTable('Class');
};
