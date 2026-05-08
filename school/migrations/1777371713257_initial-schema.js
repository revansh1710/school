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
  // Create Enums
  pgm.createType('Role', ['PARENT', 'ADMIN']);
  pgm.createType('UserStatus', ['TEMPORARY', 'ACTIVE', 'DISABLED']);
  pgm.createType('AdmissionStatus', ['ENQUIRY', 'DOCUMENTS', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'ENROLLED']);

  // Create User table
  pgm.createTable('User', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email: { type: 'text', notNull: true, unique: true },
    parentName: { type: 'text' },
    role: { type: '"Role"', notNull: true, default: 'PARENT' },
    status: { type: '"UserStatus"', notNull: true, default: 'TEMPORARY' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create Student table
  pgm.createTable('Student', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    firstName: { type: 'text', notNull: true },
    lastName: { type: 'text', notNull: true },
    admissionStatus: { type: '"AdmissionStatus"', notNull: true, default: 'ENQUIRY' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create ParentStudent table (Join table)
  pgm.createTable('ParentStudent', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    parentId: { type: 'uuid', notNull: true, references: '"User"(id)', onDelete: 'CASCADE' },
    studentId: { type: 'uuid', notNull: true, references: '"Student"(id)', onDelete: 'CASCADE' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create MagicToken table
  pgm.createTable('MagicToken', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    tokenHash: { type: 'text', notNull: true },
    userId: { type: 'uuid', notNull: true, references: '"User"(id)', onDelete: 'CASCADE' },
    expiresAt: { type: 'timestamp', notNull: true },
    used: { type: 'boolean', notNull: true, default: false },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create Session table
  pgm.createTable('Session', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    userId: { type: 'uuid', notNull: true, references: '"User"(id)', onDelete: 'CASCADE' },
    expiresAt: { type: 'timestamp', notNull: true },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('Session');
  pgm.dropTable('MagicToken');
  pgm.dropTable('ParentStudent');
  pgm.dropTable('Student');
  pgm.dropTable('User');
  pgm.dropType('AdmissionStatus');
  pgm.dropType('UserStatus');
  pgm.dropType('Role');
};
