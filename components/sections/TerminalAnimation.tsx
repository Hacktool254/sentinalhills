'use client';

import { useEffect, useMemo, useState } from 'react';

const AUTOMATION_EXAMPLES = [
  {
    comment: '// Lead capture system — runs 24/7',
    lines: [
      'const lead = await captureFormSubmission(req)',
      'await qualifyLead(lead, criteria)',
      'await sendWhatsApp(lead.phone, template)',
      'await updateCRM(lead, status: "qualified")',
      '// → 3× more leads converted',
    ],
  },
  {
    comment: '// AI-powered customer support bot',
    lines: [
      'const query = await parseCustomerMessage(msg)',
      'const response = await ai.resolve(query)',
      'await sendReply(customer.channel, response)',
      'if (complex) await escalateToHuman(query)',
      '// → 80% queries handled automatically',
    ],
  },
  {
    comment: '// M-Pesa payment integration',
    lines: [
      'const payment = await mpesa.stk_push({',
      '  phone: customer.phone,',
      '  amount: order.total,',
      '})',
      '// → Payments collected instantly 🇰🇪',
    ],
  },
];

type TerminalState = {
  exampleIndex: number;
  displayedLines: string[];
  currentLineIndex: number;
  currentChar: number;
};

const INITIAL_STATE: TerminalState = {
  exampleIndex: 0,
  displayedLines: [],
  currentLineIndex: 0,
  currentChar: 0,
};

export function TerminalAnimation() {
  const [state, setState] = useState<TerminalState>(INITIAL_STATE);
  const [showCursor, setShowCursor] = useState(true);

  const { exampleIndex, displayedLines, currentLineIndex, currentChar } = state;
  const current = AUTOMATION_EXAMPLES[exampleIndex];
  const allLines = useMemo(() => [current.comment, ...current.lines], [current]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  // Single typewriter effect — all transitions happen inside setTimeout callbacks
  useEffect(() => {
    // All lines finished — wait then advance to next example
    if (currentLineIndex >= allLines.length) {
      const id = setTimeout(() => {
        setState({
          exampleIndex: (exampleIndex + 1) % AUTOMATION_EXAMPLES.length,
          displayedLines: [],
          currentLineIndex: 0,
          currentChar: 0,
        });
      }, 2500);
      return () => clearTimeout(id);
    }

    const targetLine = allLines[currentLineIndex];

    // Still typing the current line — advance one char
    if (currentChar < targetLine.length) {
      const id = setTimeout(() => {
        setState((prev) => ({ ...prev, currentChar: prev.currentChar + 1 }));
      }, 30);
      return () => clearTimeout(id);
    }

    // Line complete — commit and advance to next line
    const id = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        displayedLines: [...prev.displayedLines, targetLine],
        currentLineIndex: prev.currentLineIndex + 1,
        currentChar: 0,
      }));
    }, 80);
    return () => clearTimeout(id);
  }, [currentChar, currentLineIndex, exampleIndex, allLines]);

  const activeLine =
    currentLineIndex < allLines.length ? allLines[currentLineIndex].slice(0, currentChar) : '';

  return (
    <div className="rounded-2xl overflow-hidden border border-[#2A2A3A] shadow-2xl shadow-[#6C63FF]/10 bg-[#0D0D14] font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1A1A24] border-b border-[#2A2A3A]">
        <span className="w-3 h-3 rounded-full bg-red-500 opacity-75" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-75" />
        <span className="w-3 h-3 rounded-full bg-green-400 opacity-75" />
        <span className="ml-auto text-xs text-[#5A5A7A]">sentinalhills — automation.ts</span>
      </div>

      {/* Code body */}
      <div className="p-5 min-h-[220px] space-y-1">
        {displayedLines.map((line, i) => (
          <div key={i} className={line.startsWith('//') ? 'text-[#5A5A7A]' : 'text-[#A8D5A2]'}>
            <span className="text-[#5A5A7A] mr-3 select-none">{(i + 1).toString().padStart(2, '0')}</span>
            {line}
          </div>
        ))}
        {currentLineIndex < allLines.length && (
          <div className={activeLine.startsWith('//') ? 'text-[#5A5A7A]' : 'text-[#A8D5A2]'}>
            <span className="text-[#5A5A7A] mr-3 select-none">
              {(displayedLines.length + 1).toString().padStart(2, '0')}
            </span>
            {activeLine}
            <span
              className={`inline-block w-2 h-4 bg-[#6C63FF] align-middle ml-0.5 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
