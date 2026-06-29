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
  // Enum for Attendance Status
  pgm.createType('AttendanceStatus', ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']);

  // AdminClass Join Table
  pgm.createTable('AdminClass', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    adminId: { type: 'uuid', notNull: true, references: '"User"(id)', onDelete: 'CASCADE' },
    classId: { type: 'uuid', notNull: true, references: '"Class"(id)', onDelete: 'CASCADE' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('AdminClass', 'unique_admin_class', {
    unique: ['adminId', 'classId'],
  });

  // TeacherSection Join Table
  pgm.createTable('TeacherSection', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    teacherId: { type: 'uuid', notNull: true, references: '"User"(id)', onDelete: 'CASCADE' },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    isClassTeacher: { type: 'boolean', notNull: true, default: false },
    subject: { type: 'text' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('TeacherSection', 'unique_teacher_section', {
    unique: ['teacherId', 'sectionId'],
  });

  // Daily Attendance Record (Header)
  pgm.createTable('Attendance', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    sectionId: { type: 'uuid', notNull: true, references: '"Section"(id)', onDelete: 'CASCADE' },
    date: { type: 'date', notNull: true },
    recordedById: { type: 'uuid', notNull: true, references: '"User"(id)' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('Attendance', 'unique_section_date', {
    unique: ['sectionId', 'date'],
  });

  // Individual Student Attendance (Details)
  pgm.createTable('AttendanceRecord', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    attendanceId: { type: 'uuid', notNull: true, references: '"Attendance"(id)', onDelete: 'CASCADE' },
    studentId: { type: 'uuid', notNull: true, references: '"Student"(id)', onDelete: 'CASCADE' },
    status: { type: '"AttendanceStatus"', notNull: true, default: 'PRESENT' },
    remarks: { type: 'text' },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
  pgm.addConstraint('AttendanceRecord', 'unique_attendance_student', {
    unique: ['attendanceId', 'studentId'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('AttendanceRecord');
  pgm.dropTable('Attendance');
  pgm.dropTable('TeacherSection');
  pgm.dropTable('AdminClass');
  pgm.dropType('AttendanceStatus');
};
