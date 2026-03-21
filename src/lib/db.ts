import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { hashSync, compareSync } from 'bcryptjs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'mindbloom.db');

let db: SqlJsDatabase | null = null;
let sqlJsReady: Promise<any> | null = null;

function getSqlJs() {
  if (!sqlJsReady) {
    sqlJsReady = initSqlJs();
  }
  return sqlJsReady;
}

export async function getDb(): Promise<SqlJsDatabase> {
  if (db) return db;

  const SQL = await getSqlJs();

  try {
    if (fs.existsSync(DB_PATH)) {
      const buffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
    } else {
      db = new SQL.Database();
    }
  } catch {
    db = new SQL.Database();
  }

  initializeDatabase(db);
  return db;
}

function saveDb() {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (e) {
    console.error('Failed to save database:', e);
  }
}

function initializeDatabase(db: SqlJsDatabase) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pin_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      dimensions TEXT NOT NULL DEFAULT '{"verbal":50,"logical":50,"spatial":50,"memory":50}',
      interests TEXT NOT NULL DEFAULT '[]',
      difficulty_level INTEGER NOT NULL DEFAULT 2,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      game_type TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      accuracy REAL NOT NULL DEFAULT 0,
      duration INTEGER NOT NULL DEFAULT 0,
      difficulty INTEGER NOT NULL DEFAULT 2,
      feedback TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      answer_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  saveDb();
}

// ===== Helpers =====

function queryOne(database: SqlJsDatabase, sql: string, params: any[] = []): any {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

function queryAll(database: SqlJsDatabase, sql: string, params: any[] = []): any[] {
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const rows: any[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function runSql(database: SqlJsDatabase, sql: string, params: any[] = []) {
  database.run(sql, params);
  saveDb();
}

function getLastInsertId(database: SqlJsDatabase): number {
  const row = queryOne(database, 'SELECT last_insert_rowid() as id');
  return row?.id || 0;
}

// ===== User Operations =====

export async function createUser(name: string, pin: string): Promise<{ id: number; name: string }> {
  const database = await getDb();
  const pinHash = hashSync(pin, 10);
  runSql(database, 'INSERT INTO users (name, pin_hash) VALUES (?, ?)', [name, pinHash]);
  const userId = getLastInsertId(database);
  runSql(database, 'INSERT INTO profiles (user_id) VALUES (?)', [userId]);
  return { id: userId, name };
}

export async function authenticateUser(name: string, pin: string): Promise<{ id: number; name: string } | null> {
  const database = await getDb();
  const user = queryOne(database, 'SELECT id, name, pin_hash FROM users WHERE LOWER(name) = LOWER(?)', [name]);
  if (!user) return null;
  if (!compareSync(pin, user.pin_hash)) return null;
  return { id: user.id, name: user.name };
}

export async function getUser(userId: number): Promise<{ id: number; name: string; created_at: string } | null> {
  const database = await getDb();
  return queryOne(database, 'SELECT id, name, created_at FROM users WHERE id = ?', [userId]);
}

// ===== Profile Operations =====

export async function getProfile(userId: number) {
  const database = await getDb();
  const row = queryOne(database, 'SELECT * FROM profiles WHERE user_id = ?', [userId]);
  if (!row) return null;
  return {
    userId: row.user_id,
    dimensions: JSON.parse(row.dimensions),
    interests: JSON.parse(row.interests),
    difficultyLevel: row.difficulty_level,
  };
}

export async function updateProfile(userId: number, dimensions: any, interests: string[], difficultyLevel?: number) {
  const database = await getDb();
  if (difficultyLevel !== undefined) {
    runSql(database, 'UPDATE profiles SET dimensions = ?, interests = ?, difficulty_level = ? WHERE user_id = ?',
      [JSON.stringify(dimensions), JSON.stringify(interests), difficultyLevel, userId]);
  } else {
    runSql(database, 'UPDATE profiles SET dimensions = ?, interests = ? WHERE user_id = ?',
      [JSON.stringify(dimensions), JSON.stringify(interests), userId]);
  }
}

export async function updateDifficulty(userId: number, difficulty: number) {
  const database = await getDb();
  runSql(database, 'UPDATE profiles SET difficulty_level = ? WHERE user_id = ?', [difficulty, userId]);
}

// ===== Game Session Operations =====

export async function saveGameSession(session: {
  userId: number;
  gameType: string;
  score: number;
  accuracy: number;
  duration: number;
  difficulty: number;
  feedback?: any;
}) {
  const database = await getDb();
  runSql(database,
    `INSERT INTO game_sessions (user_id, game_type, score, accuracy, duration, difficulty, feedback)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [session.userId, session.gameType, session.score, session.accuracy, session.duration, session.difficulty,
     session.feedback ? JSON.stringify(session.feedback) : null]);
  return getLastInsertId(database);
}

export async function getGameSessions(userId: number, limit = 50) {
  const database = await getDb();
  const rows = queryAll(database,
    'SELECT * FROM game_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [userId, limit]);
  return rows.map(r => ({ ...r, feedback: r.feedback ? JSON.parse(r.feedback) : null }));
}

export async function getGameSessionsByType(userId: number, gameType: string, limit = 10) {
  const database = await getDb();
  const rows = queryAll(database,
    'SELECT * FROM game_sessions WHERE user_id = ? AND game_type = ? ORDER BY created_at DESC LIMIT ?',
    [userId, gameType, limit]);
  return rows.map(r => ({ ...r, feedback: r.feedback ? JSON.parse(r.feedback) : null }));
}

export async function getSessionStats(userId: number) {
  const database = await getDb();
  const total = queryOne(database, 'SELECT COUNT(*) as count FROM game_sessions WHERE user_id = ?', [userId]);
  const avgAccuracy = queryOne(database, 'SELECT AVG(accuracy) as avg FROM game_sessions WHERE user_id = ?', [userId]);
  const totalScore = queryOne(database, 'SELECT SUM(score) as total FROM game_sessions WHERE user_id = ?', [userId]);
  const favoriteGame = queryOne(database,
    `SELECT game_type, COUNT(*) as count FROM game_sessions WHERE user_id = ?
     GROUP BY game_type ORDER BY count DESC LIMIT 1`, [userId]);

  const recentDays = queryAll(database,
    `SELECT DISTINCT date(created_at) as day FROM game_sessions WHERE user_id = ?
     ORDER BY day DESC LIMIT 30`, [userId]);

  let streak = 0;
  for (let i = 0; i < recentDays.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split('T')[0];
    if (recentDays[i]?.day === expected) { streak++; } else { break; }
  }

  return {
    totalSessions: total?.count || 0,
    averageAccuracy: Math.round((avgAccuracy?.avg || 0) * 100) / 100,
    totalScore: totalScore?.total || 0,
    favoriteGame: favoriteGame?.game_type || null,
    streak,
  };
}

// ===== Survey Operations =====

export async function saveSurveyResponses(userId: number, responses: { questionId: string; answerId: string }[]) {
  const database = await getDb();
  runSql(database, 'DELETE FROM survey_responses WHERE user_id = ?', [userId]);
  for (const item of responses) {
    runSql(database, 'INSERT INTO survey_responses (user_id, question_id, answer_id) VALUES (?, ?, ?)',
      [userId, item.questionId, item.answerId]);
  }
}

export async function getSurveyResponses(userId: number) {
  const database = await getDb();
  return queryAll(database, 'SELECT question_id, answer_id FROM survey_responses WHERE user_id = ? ORDER BY id', [userId]);
}

export async function hasSurveyCompleted(userId: number): Promise<boolean> {
  const database = await getDb();
  const result = queryOne(database, 'SELECT COUNT(*) as count FROM survey_responses WHERE user_id = ?', [userId]);
  return (result?.count || 0) >= 10;
}
