const db = require('../db')

module.exports = function () {
  db.serialize(function () {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      hashed_password BLOB,
      salt BLOB,
      name TEXT)`
    )

    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      name TEXT UNIQUE,
      user INTEGER,
      timer_enabled INTEGER,
      timer_seconds INTEGER,
      volume INTEGER,
      noise_color TEXT,
      filter_enabled INTEGER,
      filter_type TEXT,
      filter_cutoff INTEGER,
      filter_cutoff_lfo_enabled INTEGER,
      filter_cutoff_lfo_rate REAL,
      filter_cutoff_lfo_min INTEGER,
      filter_cutoff_lfo_max INTEGER,
      tremolo_enabled INTEGER,
      tremolo_frequency REAL,
      tremolo_depth REAL,
      FOREIGN KEY(user) REFERENCES user(id))`
    )
  })
}
