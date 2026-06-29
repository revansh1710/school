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
  // Create EnrollmentType Enum
  pgm.createType('EnrollmentType', ['PAID', 'FEE_WAIVER', 'MANUAL_APPROVAL']);

  // Add enrollment-related columns to Student table
  pgm.addColumns('Student', {
    enrollmentType: { type: '"EnrollmentType"', notNull: false },
    feeWaiverReason: { type: 'text', notNull: false },
    approvedBy: { type: 'text', notNull: false },
    enrolledAt: { type: 'timestamp', notNull: false },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropColumns('Student', ['enrollmentType', 'feeWaiverReason', 'approvedBy', 'enrolledAt']);
  pgm.dropType('EnrollmentType');
};
