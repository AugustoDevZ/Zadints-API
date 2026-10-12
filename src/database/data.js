import Database from 'better-sqlite3'

export const data = new Database('database.sqlite');

data.prepare(`
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`).run();

data.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        img TEXT,
        theme TEXT NOT NULL,
        lang TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL ,
        password TEXT NOT NULL
        
    )
`).run();

