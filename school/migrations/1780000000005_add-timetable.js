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
  // Create DayOfWeek Enum type if it doesn't exist
  pgm.createType('DayOfWeek', ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);

  // Create TimetableEntry Table
  pgm.createTable('TimetableEntry', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    dayOfWeek: { type: '"DayOfWeek"', notNull: true },
    startTime: { type: 'time', notNull: true },
    endTime: { type: 'time', notNull: true },
    subject: { type: 'text', notNull: true },
    teacherId: { type: 'uuid', references: '"User"(id)', onDelete: 'SET NULL' },
    room: { type: 'text' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Unique constraint to prevent duplicate timings in the same section
  pgm.addConstraint('TimetableEntry', 'unique_section_time_day', {
    unique: ['sectionId', 'dayOfWeek', 'startTime'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('TimetableEntry');
  pgm.dropType('DayOfWeek');
};
