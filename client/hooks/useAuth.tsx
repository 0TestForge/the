import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  username: string;
  email: string;
};

type StoredUser = AuthUser & { password: string };

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  register: (input: { username: string; email: string; password: string }) => Promise<void>;
  login: (input: { identifier: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "auth:users";
const SESSION_KEY = "auth:user";

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StoredUser[];
    return [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (!user) localStorage.removeItem(SESSION_KEY);
  else localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readSession());
  }, []);

  const register = useCallback(async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const users = readUsers();
    const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("An account with that username or email already exists.");
    }
    const newUser: StoredUser = { username, email, password };
    const next = [...users, newUser];
    writeUsers(next);
    const session: AuthUser = { username, email };
    setUser(session);
    writeSession(session);
  }, []);

  const login = useCallback(async ({ identifier, password }: { identifier: string; password: string }) => {
    const users = readUsers();
    const found = users.find(u => u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase());
    if (!found || found.password !== password) {
      throw new Error("Invalid credentials.");
    }
    const session: AuthUser = { username: found.username, email: found.email };
    setUser(session);
    writeSession(session);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  }), [user, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
