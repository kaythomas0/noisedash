const db = require('../db')

module.exports = function () {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      hashed_password BLOB,
      salt BLOB,
      name TEXT,
      is_admin INTEGER)`
    )

    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      user INTEGER,
      timer_enabled INTEGER,
      duration INTEGER,
      volume INTEGER,
      noise_color TEXT,
      filter_enabled INTEGER,
      filter_type TEXT,
      filter_cutoff INTEGER,
      lfo_filter_cutoff_enabled INTEGER,
      lfo_filter_cutoff_frequency REAL,
      lfo_filter_cutoff_low INTEGER,
      lfo_filter_cutoff_high INTEGER,
      tremolo_enabled INTEGER,
      tremolo_frequency REAL,
      tremolo_depth REAL,
      FOREIGN KEY(user) REFERENCES users(id))`
    )

    db.run(`CREATE TABLE IF NOT EXISTS samples (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      volume INTEGER,
      user INTEGER,
      FOREIGN KEY(user) REFERENCES users(id))`
    )

    db.run(`CREATE TABLE IF NOT EXISTS profiles_samples (
      id INTEGER PRIMARY KEY,
      profile INTEGER,
      sample INTEGER,
      FOREIGN KEY(profile) REFERENCES profiles(id),
      FOREIGN KEY(sample) REFERENCES samples(id))`
    )
  })
}
