const Database = require('better-sqlite3')
const path = require('path')

const DB_PATH = path.join(__dirname, 'shecan.db')

let db

function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema()
  }
  return db
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name   TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT,
      help_type   TEXT    NOT NULL,
      message     TEXT    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'new',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS donations (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      donor_name    TEXT    NOT NULL,
      email         TEXT    NOT NULL,
      amount        REAL    NOT NULL,
      currency      TEXT    NOT NULL DEFAULT 'INR',
      payment_method TEXT,
      upi_id        TEXT,
      message       TEXT,
      status        TEXT    NOT NULL DEFAULT 'pending',
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS newsletter (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

// ── Submission queries ─────────────────────────────────────────────────────

function createSubmission({ fullName, email, phone, helpType, message }) {
  const stmt = getDb().prepare(`
    INSERT INTO submissions (full_name, email, phone, help_type, message)
    VALUES (@fullName, @email, @phone, @helpType, @message)
  `)
  const result = stmt.run({ fullName, email, phone: phone || null, helpType, message })
  return getSubmissionById(result.lastInsertRowid)
}

function getSubmissionById(id) {
  return getDb().prepare('SELECT * FROM submissions WHERE id = ?').get(id)
}

function getAllSubmissions({ status, limit = 50, offset = 0 } = {}) {
  if (status) {
    return getDb()
      .prepare('SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .all(status, limit, offset)
  }
  return getDb()
    .prepare('SELECT * FROM submissions ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset)
}

function updateSubmissionStatus(id, status) {
  getDb().prepare('UPDATE submissions SET status = ? WHERE id = ?').run(status, id)
  return getSubmissionById(id)
}

function countSubmissions() {
  return getDb().prepare('SELECT COUNT(*) as count FROM submissions').get()
}

// ── Donation queries ──────────────────────────────────────────────────────

function createDonation({ donorName, email, amount, currency = 'INR', paymentMethod, upiId, message }) {
  const stmt = getDb().prepare(`
    INSERT INTO donations (donor_name, email, amount, currency, payment_method, upi_id, message)
    VALUES (@donorName, @email, @amount, @currency, @paymentMethod, @upiId, @message)
  `)
  const result = stmt.run({ donorName, email, amount, currency, paymentMethod: paymentMethod || null, upiId: upiId || null, message: message || null })
  return getDonationById(result.lastInsertRowid)
}

function getDonationById(id) {
  return getDb().prepare('SELECT * FROM donations WHERE id = ?').get(id)
}

function getAllDonations({ limit = 50, offset = 0 } = {}) {
  return getDb()
    .prepare('SELECT * FROM donations ORDER BY created_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset)
}

function getTotalDonations() {
  return getDb().prepare('SELECT SUM(amount) as total, COUNT(*) as count FROM donations WHERE status = "completed"').get()
}

// ── Newsletter queries ────────────────────────────────────────────────────

function subscribeNewsletter(email) {
  try {
    getDb().prepare('INSERT INTO newsletter (email) VALUES (?)').run(email)
    return { success: true, message: 'Subscribed successfully!' }
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return { success: false, message: 'Email already subscribed.' }
    }
    throw err
  }
}

module.exports = {
  getDb,
  createSubmission,
  getSubmissionById,
  getAllSubmissions,
  updateSubmissionStatus,
  countSubmissions,
  createDonation,
  getDonationById,
  getAllDonations,
  getTotalDonations,
  subscribeNewsletter,
}
