/**
 * Violinkulcs, C4–C5: a legalsó vonal E4 (y=99),
 * az egyvonalas C (C4) a legalsó vonal alatti első pótvonalon (y=115).
 * Fél vonalköz / diatonikus fok = 8 SVG-egység.
 */
export const TREBLE_STAFF_LINES=[35,51,67,83,99] as const;
export const FIRST_LEDGER_LINE_Y=115;
export const DIATONIC_STAFF_ORDER=['C4','D4','E4','F4','G4','A4','H4','C5'] as const;

export function trebleStaffY(note:string):number{
 const index=DIATONIC_STAFF_ORDER.indexOf(note as typeof DIATONIC_STAFF_ORDER[number]);
 if(index<0)throw new Error('Ismeretlen kottahang: '+note);
 return FIRST_LEDGER_LINE_Y-index*8;
}
export function hasLowerLedgerLine(note:string):boolean {
 return note==='C4';
}
