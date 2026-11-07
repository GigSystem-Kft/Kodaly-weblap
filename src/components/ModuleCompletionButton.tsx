import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Props {
  completed: boolean;
  onComplete: () => void;
}

/** An explicit self-report, not an exam grade or automatic competency certification. */
export const ModuleCompletionButton: React.FC<Props> = ({ completed, onComplete }) => (
  completed
    ? <span className="inline-flex gap-2 items-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 text-sm">
        <CheckCircle size={17}/> Tanulmányozottnak jelölve
      </span>
    : <button type="button" onClick={onComplete}
        className="inline-flex gap-2 items-center rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold">
        <CheckCircle size={17}/> Modul tanulmányozva
      </button>
);
