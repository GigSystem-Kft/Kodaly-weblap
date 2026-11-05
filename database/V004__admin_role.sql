-- V004: hozzáférés-vezérelt adminisztráció. A meglévő fiókok és eredmények megmaradnak.
-- Importáld EGYSZER a zeneelmelet adatbázisba.
ALTER TABLE zm_users MODIFY COLUMN role ENUM('student','teacher','admin') NOT NULL DEFAULT 'student';
-- Az első admin kijelölése külön, kézi ellenőrzéssel történik:
-- UPDATE zm_users SET role='admin' WHERE email='A_SAJAT_EMAIL_CIMED' AND email_verified_at IS NOT NULL;
-- Ellenőrizd előtte az e-mailt, és ne módosítsd más fiókját.
