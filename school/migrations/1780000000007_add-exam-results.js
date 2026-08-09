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
  // Create Exam Table
  pgm.createTable('Exam', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    name: { type: 'text', notNull: true },
    examDate: { type: 'date' },
    createdById: { type: 'uuid', references: '"User"(id)', onDelete: 'SET NULL' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Create ExamResult Table
  pgm.createTable('ExamResult', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    examId: { type: 'uuid', notNull: true, references: '"Exam"(id)', onDelete: 'CASCADE' },
    studentId: { type: 'uuid', notNull: true, references: '"Student"(id)', onDelete: 'CASCADE' },
    marks: { type: 'jsonb', notNull: true }, // Format: [{"subject": "Math", "obtained": 80, "max": 100}]
    remarks: { type: 'text' },
    createdById: { type: 'uuid', references: '"User"(id)', onDelete: 'SET NULL' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });

  // Unique constraint to prevent duplicate results for the same student in the same exam
  pgm.addConstraint('ExamResult', 'unique_exam_student', {
    unique: ['examId', 'studentId'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ExamResult');
  pgm.dropTable('Exam');
};
