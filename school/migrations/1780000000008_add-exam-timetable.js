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
  // Create ExamTimetableEntry Table
  pgm.createTable('ExamTimetableEntry', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    examId: { type: 'uuid', notNull: true, references: '"Exam"(id)', onDelete: 'CASCADE' },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    subject: { type: 'text', notNull: true },
    examDate: { type: 'date', notNull: true },
    startTime: { type: 'time', notNull: true },
    endTime: { type: 'time', notNull: true },
    room: { type: 'text' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Unique constraint to prevent duplicate exam slots for the same subject in the same exam
  pgm.addConstraint('ExamTimetableEntry', 'unique_exam_subject', {
    unique: ['examId', 'subject'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ExamTimetableEntry');
};
