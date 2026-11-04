-- Zenelméleti Műhely – MySQL 8 / MariaDB 10.6+
-- Importálás CloudPanel phpMyAdmin felületen a zeneelmelet adatbázisba.
-- A táblák létrehozása nem töröl korábbi adatokat.
CREATE TABLE IF NOT EXISTS zm_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(254) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(180) NOT NULL,
  role ENUM('student','teacher') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_zm_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS zm_sessions (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_zm_sessions_user (user_id),
  INDEX ix_zm_sessions_expiry (expires_at),
  CONSTRAINT fk_zm_session_user FOREIGN KEY (user_id) REFERENCES zm_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS zm_progress (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  progress_json JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_zm_progress_user FOREIGN KEY (user_id) REFERENCES zm_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
