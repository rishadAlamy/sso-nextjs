import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: "admin" | "user";
  authType: "local" | "sso";
  samlAttributes?: Record<string, string | number | boolean>;
  createdAt: string;
  lastLogin: string | null;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface ResetToken {
  id: string;
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
}

interface DatabaseData {
  users: User[];
  sessions: Session[];
  resetTokens: ResetToken[];
}

function readDatabase(): DatabaseData {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { users: [], sessions: [], resetTokens: [] };
  }
}

function writeDatabase(data: DatabaseData): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

export function findUserByEmail(email: string): User | null {
  const db = readDatabase();
  return db.users.find((user) => user.email === email) || null;
}

export function findUserById(id: string): User | null {
  const db = readDatabase();
  return db.users.find((user) => user.id === id) || null;
}

export function createUser(
  userData: Omit<User, "id" | "createdAt" | "lastLogin">
): User {
  const db = readDatabase();
  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

export function updateUserLastLogin(userId: string): void {
  const db = readDatabase();
  const userIndex = db.users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex].lastLogin = new Date().toISOString();
    writeDatabase(db);
  }
}

export function createSession(userId: string): Session {
  const db = readDatabase();
  const session: Session = {
    id: crypto.randomUUID(),
    userId,
    token: crypto.randomBytes(32).toString("hex"),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    createdAt: new Date().toISOString(),
  };

  db.sessions.push(session);
  writeDatabase(db);
  return session;
}

export function findSessionByToken(token: string): Session | null {
  const db = readDatabase();
  const session = db.sessions.find(
    (s) => s.token === token && new Date(s.expiresAt) > new Date()
  );
  return session || null;
}

export function deleteSession(token: string): void {
  const db = readDatabase();
  db.sessions = db.sessions.filter((s) => s.token !== token);
  writeDatabase(db);
}

export function createResetToken(email: string): ResetToken {
  const db = readDatabase();
  const resetToken: ResetToken = {
    id: crypto.randomUUID(),
    email,
    token: crypto.randomInt(100000, 999999).toString(), // 6-digit code
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    used: false,
  };

  db.resetTokens.push(resetToken);
  writeDatabase(db);
  return resetToken;
}

export function findValidResetToken(
  email: string,
  token: string
): ResetToken | null {
  const db = readDatabase();
  return (
    db.resetTokens.find(
      (rt) =>
        rt.email === email &&
        rt.token === token &&
        !rt.used &&
        new Date(rt.expiresAt) > new Date()
    ) || null
  );
}

export function markResetTokenAsUsed(tokenId: string): void {
  const db = readDatabase();
  const tokenIndex = db.resetTokens.findIndex((rt) => rt.id === tokenId);
  if (tokenIndex !== -1) {
    db.resetTokens[tokenIndex].used = true;
    writeDatabase(db);
  }
}

export function hashPassword(password: string): string {
  // In production, use bcrypt or similar
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return hashPassword(password) === hashedPassword;
}
