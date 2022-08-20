const db = require('../db')
const logger = require('../logger')

module.exports = function () {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      hashed_password BLOB,
      salt BLOB,
      name TEXT,
      is_admin INTEGER,
      dark_mode INTEGER,
      can_upload INTEGER)`
    )

    db.run(`CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT,
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
      FOREIGN KEY(user) REFERENCES users(id),
      UNIQUE(user,name))`
    )

    db.run(`CREATE TABLE IF NOT EXISTS samples (
      id INTEGER PRIMARY KEY,
      name TEXT,
      user INTEGER,
      FOREIGN KEY(user) REFERENCES users(id),
      UNIQUE(user,name))`
    )

    db.run(`CREATE TABLE IF NOT EXISTS profiles_samples (
      id INTEGER PRIMARY KEY,
      profile INTEGER,
      sample INTEGER,
      volume INTEGER,
      FOREIGN KEY(profile) REFERENCES profiles(id),
      FOREIGN KEY(sample) REFERENCES samples(id))`
    )

    db.get('PRAGMA user_version', (err, row) => {
      if (err) {
        logger.error(err)
      } else {
        const userVersion = row.user_version

        if (userVersion < 1) {
          db.run('ALTER TABLE samples ADD COLUMN fade_in REAL DEFAULT 0')
          db.run('ALTER TABLE samples ADD COLUMN loop_points_enabled INTEGER DEFAULT 0')
          db.run('ALTER TABLE samples ADD COLUMN loop_start REAL DEFAULT 0')
          db.run('ALTER TABLE samples ADD COLUMN loop_end REAL DEFAULT 0')

          db.run('PRAGMA user_version = 1')
        }

        if (userVersion < 2) {
          db.run('ALTER TABLE users ADD COLUMN preferences TEXT DEFAULT "{}"')

          db.run('PRAGMA user_version = 2')
        }

        if (userVersion < 3) {
          db.run('ALTER TABLE profiles_samples ADD COLUMN reverb_enabled INTEGER DEFAULT 0')
          db.run('ALTER TABLE profiles_samples ADD COLUMN reverb_pre_delay REAL DEFAULT 0')
          db.run('ALTER TABLE profiles_samples ADD COLUMN reverb_decay REAL DEFAULT 0')
          db.run('ALTER TABLE profiles_samples ADD COLUMN reverb_wet INTEGER DEFAULT 0')
          db.run('ALTER TABLE profiles_samples ADD COLUMN playback_mode TEXT DEFAULT "continuous"')
          db.run('ALTER TABLE profiles_samples ADD COLUMN sporadic_min INTEGER DEFAULT 30')
          db.run('ALTER TABLE profiles_samples ADD COLUMN sporadic_max INTEGER DEFAULT 300')

          db.run('PRAGMA user_version = 3')
        }
      }
    })
  })
}
