-- Zeneelméleti Műhely – E-mail-megerősítés és jelszóhelyreállítás (MySQL 8).
-- A korábban már működő pilotfiókok ellenőrzöttnek számítanak:
-- a meglévő fiókokat nem zárjuk ki; az új fiókoknál kötelező az ellenőrzés.
ALTER TABLE zm_users ADD COLUMN email_verified_at DATETIME NULL DEFAULT NULL;
UPDATE zm_users SET email_verified_at = UTC_TIMESTAMP() WHERE email_verified_at IS NULL;

CREATE TABLE IF NOT EXISTS zm_account_tokens (
  token_hash CHAR(64) NOT NULL PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  purpose ENUM('verify','reset') NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_zm_account_tokens_user_purpose (user_id, purpose),
  INDEX ix_zm_account_tokens_expiry (expires_at),
  CONSTRAINT fk_zm_account_token_user FOREIGN KEY (user_id)
    REFERENCES zm_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
