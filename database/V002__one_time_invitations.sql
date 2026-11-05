-- Zeneelméleti Műhely – egyszer használható meghívók
-- Futtasd a MEGLÉVŐ 'zeneelmelet' adatbázisban phpMyAdmin SQL lapon.
-- Nem módosítja és nem törli a zm_users, zm_sessions, zm_progress táblákat.
CREATE TABLE IF NOT EXISTS zm_invitations (
    token_hash CHAR(64) NOT NULL PRIMARY KEY,
    email VARCHAR(254) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used_at DATETIME DEFAULT NULL,
    used_by CHAR(36) DEFAULT NULL,
    INDEX ix_zm_invites_email (email),
    INDEX ix_zm_invites_expires (expires_at),
    CONSTRAINT fk_zm_invite_used_by
        FOREIGN KEY (used_by) REFERENCES zm_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
