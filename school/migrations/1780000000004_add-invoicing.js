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
  // Create InvoiceStatus Enum
  pgm.createType('InvoiceStatus', ['PENDING', 'PAID', 'WAIVED', 'FAILED']);

  // Create Invoice Table
  pgm.createTable('Invoice', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    studentId: { type: 'uuid', notNull: true, references: '"Student"(id)', onDelete: 'CASCADE' },
    amount: { type: 'numeric', notNull: true },
    description: { type: 'text', notNull: true },
    status: { type: '"InvoiceStatus"', notNull: true, default: 'PENDING' },
    dueDate: { type: 'date', notNull: false },
    razorpayOrderId: { type: 'text', notNull: false },
    razorpayPaymentId: { type: 'text', notNull: false },
    paidAt: { type: 'timestamp', notNull: false },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('Invoice');
  pgm.dropType('InvoiceStatus');
};
