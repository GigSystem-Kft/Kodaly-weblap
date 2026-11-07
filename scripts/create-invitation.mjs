#!/usr/bin/env node
/**
 * Local administrator helper; NEVER run this from the public web directory.
 * Usage: node scripts/create-invitation.mjs student@example.com
 * Output contains both a secret invitation and one SQL INSERT statement.
 * Do not commit the output or share the complete output in chat/screenshots.
 */
import { randomBytes, createHash } from 'node:crypto';

const email = (process.argv[2] || '').trim().toLowerCase();
if (!/^[^\s@']+@[^\s@']+\.[^\s@']+$/.test(email) || email.length > 254) {
  console.error('Használat: node scripts/create-invitation.mjs email@pelda.hu');
  process.exit(2);
}
const token = randomBytes(32).toString('hex');
const hashed = createHash('sha256').update(token).digest('hex');
const safeEmail = email.replaceAll("'", "''");

console.log('EGYSZER HASZNÁLHATÓ MEGHÍVÓKÓD (bizalmas; csak a címzettnek add át):');
console.log(token);
console.log('\nPHPMyAdmin → zeneelmelet adatbázis → SQL (egy héten át érvényes):');
console.log(
  "INSERT INTO zm_invitations (token_hash,email,expires_at) VALUES " +
  "('" + hashed + "','" + safeEmail + "',DATE_ADD(UTC_TIMESTAMP(),INTERVAL 7 DAY));"
);
console.log('\nA fiók kizárólag ezzel az e-mail-címmel hozható létre. A kód csak egyszer működik.');
