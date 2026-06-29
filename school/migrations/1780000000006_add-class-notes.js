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
  pgm.createTable('ClassNote', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    teacherId: { type: 'uuid', references: '"User"(id)', onDelete: 'SET NULL' },
    subject: { type: 'text', notNull: true },
    title: { type: 'text', notNull: true },
    content: { type: 'text', notNull: true },
    fileUrl: { type: 'text' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ClassNote');
};
