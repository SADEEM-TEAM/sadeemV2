import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from '../components/SpaceBackground';
import { Mascot, MascotBubble } from '../components/Mascot';
import { getWorld, getLevel, QuizQuestion, WorldId } from '../data/worlds';
import { useGame } from '../context/GameContext';

// ── COUNTING GAME ──────────────────────────────────────────────────────
function generateCountingRound() {
  const fruits = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍌', '🥝'];
  const fruit = fruits[Math.floor(Math.random() * fruits.length)];
  const count = Math.floor(Math.random() * 8) + 1;
  const correct = count;
  const options = new Set([correct]);
  while (options.size < 4) {
    const n = Math.floor(Math.random() * 10) + 1;
    if (n !== correct) options.add(n);
  }
  return { fruit, count, options: [...options].sort(() => Math.random() - 0.5) };
}

function CountingGame({ onComplete }: { onComplete: (stars: number) => void }) {
  const [round, setRound] = useState(() => generateCountingRound());
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const totalRounds = 3;

  const handleSelect = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === round.count;
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (roundNum >= totalRounds) {
        const stars = score + (isCorrect ? 1 : 0) >= 3 ? 3 : score + (isCorrect ? 1 : 0) >= 2 ? 2 : 1;
        onComplete(stars);
      } else {
        setRound(generateCountingRound());
        setSelected(null);
        setCorrect(null);
        setRoundNum(r => r + 1);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div key={i} className={`w-8 h-2 rounded-full ${i < roundNum ? 'bg-green-400' : 'bg-white/20'}`} />
        ))}
      </div>

      <MascotBubble
        text={`How many ${round.fruit} do you see?`}
        emotion="thinking"
        size={60}
        className="self-start"
      />

      {/* Fruits display */}
      <motion.div
        key={round.fruit + round.count}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-wrap justify-center gap-2 p-5 rounded-3xl w-full max-w-[300px]"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {Array.from({ length: round.count }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.07, type: 'spring' }}
            style={{ fontSize: 36 }}
          >
            {round.fruit}
          </motion.span>
        ))}
      </motion.div>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
        {round.options.map(opt => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
            className="py-4 rounded-2xl text-white relative overflow-hidden"
            style={{
              fontFamily: 'Fredoka One',
              fontSize: 28,
              background: selected === opt
                ? correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'
                : selected !== null && opt === round.count
                ? 'rgba(34,197,94,0.3)'
                : 'rgba(255,255,255,0.08)',
              border: selected === opt
                ? correct ? '2px solid #22c55e' : '2px solid #ef4444'
                : selected !== null && opt === round.count
                ? '2px solid #22c55e'
                : '2px solid rgba(255,255,255,0.15)',
            }}
          >
            {opt}
            {selected !== null && opt === round.count && <span className="text-green-400 text-sm ml-1">✓</span>}
          </motion.button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {correct !== null && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              fontFamily: 'Fredoka One',
              fontSize: 22,
              color: correct ? '#4ade80' : '#f87171',
            }}
          >
            {correct ? '🌟 Amazing!' : '❌ Try next one!'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ADDITION GAME ──────────────────────────────────────────────────────
function generateAdditionRound() {
  const fruits = [['🍎','🍊'],['🍋','🍇'],['🍓','🍑'],['🍌','🥝']];
  const pair = fruits[Math.floor(Math.random() * fruits.length)];
  const a = Math.floor(Math.random() * 5) + 1;
  const b = Math.floor(Math.random() * 4) + 1;
  const sum = a + b;
  const options = new Set([sum]);
  while (options.size < 4) {
    const n = Math.floor(Math.random() * 12) + 1;
    if (n !== sum) options.add(n);
  }
  return { fruitA: pair[0], fruitB: pair[1], a, b, sum, options: [...options].sort(() => Math.random() - 0.5) };
}

function AdditionGame({ onComplete }: { onComplete: (stars: number) => void }) {
  const [round, setRound] = useState(() => generateAdditionRound());
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [roundNum, setRoundNum] = useState(1);
  const [score, setScore] = useState(0);
  const totalRounds = 3;

  const handleSelect = (opt: number) => {
    if (selected !== null) return;
    setSelected(opt);
    const isCorrect = opt === round.sum;
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (roundNum >= totalRounds) {
        const earned = score + (isCorrect ? 1 : 0);
        onComplete(earned >= 3 ? 3 : earned >= 2 ? 2 : 1);
      } else {
        setRound(generateAdditionRound());
        setSelected(null);
        setCorrect(null);
        setRoundNum(r => r + 1);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <MascotBubble text={`What is ${round.a} + ${round.b}?`} emotion="thinking" size={60} className="self-start" />

      <motion.div
        key={round.fruitA + round.a}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3"
      >
        <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: 130 }}>
          {Array.from({ length: round.a }).map((_, i) => (
            <span key={i} style={{ fontSize: 28 }}>{round.fruitA}</span>
          ))}
        </div>
        <span style={{ fontSize: 32, color: 'white' }}>+</span>
        <div className="flex gap-1 flex-wrap justify-center" style={{ maxWidth: 110 }}>
          {Array.from({ length: round.b }).map((_, i) => (
            <span key={i} style={{ fontSize: 28 }}>{round.fruitB}</span>
          ))}
        </div>
        <span style={{ fontSize: 32, color: 'white' }}>=</span>
        <span style={{ fontSize: 40, color: '#60A5FA' }}>?</span>
      </motion.div>

      <p style={{ fontFamily: 'Nunito', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        Round {roundNum} / {totalRounds}
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
        {round.options.map(opt => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt)}
            disabled={selected !== null}
            className="py-4 rounded-2xl text-white"
            style={{
              fontFamily: 'Fredoka One',
              fontSize: 28,
              background: selected === opt ? (correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') : selected !== null && opt === round.sum ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${selected === opt ? (correct ? '#22c55e' : '#ef4444') : selected !== null && opt === round.sum ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
            }}
          >{opt}</motion.button>
        ))}
      </div>

      <AnimatePresence>
        {correct !== null && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontFamily: 'Fredoka One', fontSize: 22, color: correct ? '#4ade80' : '#f87171' }}>
            {correct ? '🎉 Correct!' : `Answer was ${round.sum}!`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── QUIZ GAME ─────────────────────────────────────────────────────────
function QuizGame({ questions, onComplete, worldColor }: { questions: QuizQuestion[]; onComplete: (stars: number) => void; worldColor: string }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const q = questions[qIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = !!q.options[idx].correct;
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (qIdx >= questions.length - 1) {
        const earned = score + (isCorrect ? 1 : 0);
        const pct = earned / questions.length;
        onComplete(pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1);
      } else {
        setQIdx(i => i + 1);
        setSelected(null);
        setCorrect(null);
      }
    }, 1400);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <div className="flex gap-2 mb-2">
        {questions.map((_, i) => (
          <div key={i} className={`w-8 h-2 rounded-full ${i < qIdx ? 'bg-green-400' : i === qIdx ? 'bg-white' : 'bg-white/20'}`} />
        ))}
      </div>

      <MascotBubble text={q.question} emotion="thinking" size={60} className="self-start" />

      <div className="flex flex-col gap-3 w-full">
        {q.options.map((opt, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(idx)}
            disabled={selected !== null}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white w-full active:scale-97"
            style={{
              fontFamily: 'Nunito',
              fontWeight: 700,
              fontSize: 16,
              background: selected === idx
                ? correct ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'
                : selected !== null && opt.correct ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)',
              border: `2px solid ${
                selected === idx ? (correct ? '#22c55e' : '#ef4444') :
                selected !== null && opt.correct ? '#22c55e' : 'rgba(255,255,255,0.12)'
              }`,
              backdropFilter: 'blur(10px)',
            }}
          >
            {opt.emoji && <span style={{ fontSize: 28 }}>{opt.emoji}</span>}
            <span className="flex-1 text-left">{opt.text}</span>
            {selected !== null && opt.correct && <span>✅</span>}
            {selected === idx && !opt.correct && <span>❌</span>}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {correct !== null && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontFamily: 'Fredoka One', fontSize: 20, color: correct ? '#4ade80' : '#f87171' }}>
            {correct ? '🌟 Excellent!' : '💪 Keep going!'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ORDERING GAME (WUDU) ──────────────────────────────────────────────
function OrderingGame({ items, onComplete }: { items: { id: number; emoji: string; label: string }[]; onComplete: (stars: number) => void }) {
  const [shuffled] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleTap = (id: number) => {
    if (feedback) return;
    if (selected.includes(id)) return;

    const next = [...selected, id];
    setSelected(next);

    // Check if correct order so far
    const expectedNext = items[next.length - 1].id;
    if (id !== expectedNext) {
      setFeedback('wrong');
      setTimeout(() => {
        setSelected([]);
        setFeedback(null);
      }, 1500);
      return;
    }

    if (next.length === items.length) {
      setFeedback('correct');
      setTimeout(() => onComplete(3), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <MascotBubble
        text="Tap the Wudu steps in the correct order! Start with step 1."
        emotion="thinking"
        size={60}
        className="self-start"
      />

      {/* Order slots */}
      <div className="flex gap-2 mb-2">
        {items.map((_, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-bold"
            style={{
              background: i < selected.length ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)',
              borderColor: i < selected.length ? '#22c55e' : 'rgba(255,255,255,0.15)',
              color: i < selected.length ? '#4ade80' : 'rgba(255,255,255,0.3)',
              fontFamily: 'Nunito',
            }}
          >
            {i < selected.length ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 w-full">
        {shuffled.map(item => {
          const isSelected = selected.includes(item.id);
          const position = selected.indexOf(item.id) + 1;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTap(item.id)}
              disabled={isSelected || !!feedback}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl active:scale-97 transition-all"
              style={{
                background: isSelected ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                border: `2px solid ${isSelected ? '#22c55e' : 'rgba(255,255,255,0.12)'}`,
                opacity: isSelected ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: 28 }}>{item.emoji}</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, color: 'white', flex: 1, textAlign: 'left' }}>
                {item.label}
              </span>
              {isSelected && (
                <span style={{ fontFamily: 'Fredoka One', color: '#4ade80', fontSize: 18 }}>
                  #{position} ✓
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ fontFamily: 'Fredoka One', fontSize: 20, color: feedback === 'correct' ? '#4ade80' : '#f87171' }}>
            {feedback === 'correct' ? '🌟 Perfect order!' : '❌ Oops! Try again!'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── STORY CHOICE GAME ─────────────────────────────────────────────────
function StoryChoiceGame({ scene, onComplete }: {
  scene: { situation: string; mascotSays: string; choices: { emoji: string; text: string; isCorrect: boolean; response: string }[] };
  onComplete: (stars: number) => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [phase, setPhase] = useState<'choose' | 'response'>('choose');

  const handleChoice = (idx: number) => {
    setChosen(idx);
    setPhase('response');
    if (scene.choices[idx].isCorrect) {
      setTimeout(() => onComplete(3), 2500);
    } else {
      setTimeout(() => {
        setChosen(null);
        setPhase('choose');
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4">
      {/* Situation card */}
      <div className="w-full rounded-3xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, color: 'white', textAlign: 'center', lineHeight: 1.6 }}>
          📖 {scene.situation}
        </p>
      </div>

      <MascotBubble
        text={phase === 'choose' ? scene.mascotSays : (chosen !== null ? scene.choices[chosen].response : '')}
        emotion={phase === 'response' && chosen !== null && scene.choices[chosen].isCorrect ? 'celebrating' : phase === 'response' ? 'sad' : 'thinking'}
        size={70}
        className="self-start"
      />

      <AnimatePresence mode="wait">
        {phase === 'choose' ? (
          <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3 w-full">
            {scene.choices.map((choice, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice(idx)}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white active:scale-97"
                style={{
                  fontFamily: 'Nunito',
                  fontWeight: 700,
                  fontSize: 15,
                  background: 'rgba(255,255,255,0.07)',
                  border: '2px solid rgba(255,255,255,0.12)',
                }}
              >
                <span style={{ fontSize: 28 }}>{choice.emoji}</span>
                <span className="flex-1 text-left">{choice.text}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="response"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            {chosen !== null && scene.choices[chosen].isCorrect ? (
              <div className="flex gap-1">
                {['⭐','⭐','⭐'].map((s, i) => (
                  <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15, type: 'spring' }} style={{ fontSize: 36 }}>{s}</motion.span>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: 'Fredoka One', fontSize: 18, color: '#f87171' }}>Try again! 💪</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── PUZZLE GAME (shapes/visual quiz) ──────────────────────────────────
function PuzzleGame({ quiz, worldColor, onComplete }: { quiz: QuizQuestion[]; worldColor: string; onComplete: (stars: number) => void }) {
  const [pieces, setPieces] = useState(() => {
    const PIECES = ['🏛️', '🕌', '🏰', '🏠', '🌙', '⭐', '🌴', '🏺'];
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      emoji: PIECES[i % PIECES.length],
      placed: false,
    }));
  });
  const [placedCount, setPlacedCount] = useState(0);
  const [done, setDone] = useState(false);

  const handlePlace = (id: number) => {
    if (pieces.find(p => p.id === id)?.placed) return;
    const newPieces = pieces.map(p => p.id === id ? { ...p, placed: true } : p);
    setPieces(newPieces);
    const newCount = placedCount + 1;
    setPlacedCount(newCount);
    if (newCount >= pieces.length) {
      setDone(true);
      setTimeout(() => onComplete(3), 1500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <MascotBubble
        text={done ? "You built it! Amazing! 🎉" : "Tap each piece to place it in the Casbah!"}
        emotion={done ? "celebrating" : "happy"}
        size={60}
        className="self-start"
      />

      {/* Puzzle frame */}
      <div
        className="w-full rounded-3xl p-4 flex flex-wrap gap-2 justify-center"
        style={{
          minHeight: 140,
          background: 'rgba(255,255,255,0.04)',
          border: `2px dashed ${placedCount > 0 ? worldColor : 'rgba(255,255,255,0.15)'}`,
        }}
      >
        <p style={{ fontFamily: 'Nunito', color: 'rgba(255,255,255,0.3)', fontSize: 13, width: '100%', textAlign: 'center', marginBottom: 8 }}>
          🏛️ Build the Casbah ({placedCount}/{pieces.length})
        </p>
        {pieces.filter(p => p.placed).map(p => (
          <motion.span
            key={p.id}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            style={{ fontSize: 36 }}
          >
            {p.emoji}
          </motion.span>
        ))}
        {placedCount === pieces.length && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-full flex justify-center mt-2">
            <span style={{ fontFamily: 'Fredoka One', color: worldColor, fontSize: 22 }}>✨ Complete!</span>
          </motion.div>
        )}
      </div>

      {/* Pieces to place */}
      <div className="flex flex-wrap gap-3 justify-center">
        {pieces.map(piece => (
          <motion.button
            key={piece.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePlace(piece.id)}
            disabled={piece.placed}
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all"
            style={{
              background: piece.placed ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${piece.placed ? '#22c55e44' : 'rgba(255,255,255,0.15)'}`,
              fontSize: 32,
              opacity: piece.placed ? 0.4 : 1,
            }}
          >
            {piece.placed ? '✓' : piece.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── SHAPES QUIZ ───────────────────────────────────────────────────────
function ShapesGame({ onComplete, worldColor }: { onComplete: (stars: number) => void; worldColor: string }) {
  const shapes = [
    { shape: '⬛', question: 'How many sides does a square have?', options: ['3', '4', '6', '5'], answer: '4' },
    { shape: '🔺', question: 'What is the name of this shape?', options: ['Circle', 'Rectangle', 'Triangle', 'Square'], answer: 'Triangle' },
    { shape: '⭕', question: 'How many corners does a circle have?', options: ['2', '1', '4', '0'], answer: '0' },
  ];
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt === shapes[qIdx].answer;
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx >= shapes.length - 1) {
        const earned = score + (isCorrect ? 1 : 0);
        onComplete(earned >= 3 ? 3 : earned >= 2 ? 2 : 1);
      } else {
        setQIdx(i => i + 1);
        setSelected(null);
        setCorrect(null);
      }
    }, 1200);
  };

  const s = shapes[qIdx];
  return (
    <div className="flex flex-col items-center gap-6 px-4">
      <MascotBubble text={s.question} emotion="thinking" size={60} className="self-start" />
      <motion.div key={qIdx} initial={{ scale: 0 }} animate={{ scale: 1 }}
        className="flex items-center justify-center" style={{ fontSize: 80, height: 120 }}>
        {s.shape}
      </motion.div>
      <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
        {s.options.map(opt => (
          <motion.button key={opt} whileTap={{ scale: 0.95 }} onClick={() => handleSelect(opt)} disabled={!!selected}
            className="py-4 rounded-2xl text-white"
            style={{
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 17,
              background: selected === opt ? (correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)') : selected && opt === s.answer ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)',
              border: `2px solid ${selected === opt ? (correct ? '#22c55e' : '#ef4444') : selected && opt === s.answer ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
            }}
          >{opt}</motion.button>
        ))}
      </div>
      {correct !== null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontFamily: 'Fredoka One', fontSize: 20, color: correct ? '#4ade80' : '#f87171' }}>
          {correct ? '🌟 Correct!' : `Answer: ${s.answer}`}
        </motion.p>
      )}
    </div>
  );
}

// ── MAIN GAME SCREEN ───────────────────────────────────────────────────
export function GameScreen() {
  const { worldId, levelId } = useParams<{ worldId: string; levelId: string }>();
  const navigate = useNavigate();
  const { completeLevel, getLevelProgress } = useGame();

  const world = getWorld(worldId as WorldId);
  const level = getLevel(worldId as WorldId, Number(levelId));

  if (!world || !level) return null;

  const handleComplete = useCallback((stars: number) => {
    completeLevel(world.id, level.id, stars, level.gemReward, level.badgeReward);
    navigate('/celebrate', {
      state: {
        stars,
        gems: level.gemReward,
        worldId: world.id,
        levelId: level.id,
        worldName: world.name,
        worldEmoji: world.emoji,
        worldColor: world.color,
        badge: level.badgeReward,
        nextLevelId: level.id + 1,
        hasNextLevel: level.id < world.levels.length,
      }
    });
  }, [world, level, completeLevel, navigate]);

  const renderGame = () => {
    if (worldId === 'math' && Number(levelId) === 1) {
      return <CountingGame onComplete={handleComplete} />;
    }
    if (worldId === 'math' && Number(levelId) === 2) {
      return <AdditionGame onComplete={handleComplete} />;
    }
    if (worldId === 'math' && Number(levelId) === 3) {
      return <ShapesGame onComplete={handleComplete} worldColor={world.color} />;
    }
    if (worldId === 'deen' && Number(levelId) === 1 && level.orderingItems) {
      return <OrderingGame items={level.orderingItems} onComplete={handleComplete} />;
    }
    if (worldId === 'manners' && level.storyScene) {
      return <StoryChoiceGame scene={level.storyScene} onComplete={handleComplete} />;
    }
    if (worldId === 'art' && Number(levelId) === 1) {
      return <PuzzleGame quiz={level.quiz ?? []} worldColor={world.color} onComplete={handleComplete} />;
    }
    if (level.quiz && level.quiz.length > 0) {
      return <QuizGame questions={level.quiz} onComplete={handleComplete} worldColor={world.color} />;
    }
    return (
      <div className="flex flex-col items-center gap-6 px-4">
        <MascotBubble text="This game is coming very soon! 🚀" emotion="excited" size={80} />
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleComplete(3)}
          className="px-8 py-4 rounded-2xl text-white"
          style={{ background: `linear-gradient(135deg, ${world.color}, ${world.color}88)`, fontFamily: 'Fredoka One', fontSize: 20 }}
        >
          Complete Level ✓
        </motion.button>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <SpaceBackground />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${world.glowColor} 0%, transparent 65%)`,
          opacity: 0.35, zIndex: 1,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen max-w-[430px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <button
            onClick={() => navigate(`/world/${worldId}`)}
            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center active:scale-95"
          >
            <span className="text-white text-lg">←</span>
          </button>
          <div className="text-center">
            <p style={{ fontFamily: 'Fredoka One', fontSize: 18, color: 'white' }}>
              {world.emoji} {level.title}
            </p>
            <p style={{ fontFamily: 'Nunito', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {world.name}
            </p>
          </div>
          <div style={{ width: 40 }}>
            <span style={{ fontSize: 20 }}>{level.emoji}</span>
          </div>
        </div>

        {/* Game header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-4 px-4 py-3 rounded-2xl flex items-center gap-3"
          style={{ background: `${world.color}20`, border: `1px solid ${world.color}40` }}
        >
          <span style={{ fontSize: 24 }}>🎮</span>
          <div>
            <p style={{ fontFamily: 'Fredoka One', fontSize: 16, color: 'white' }}>Game Time!</p>
            <p style={{ fontFamily: 'Nunito', fontSize: 12, color: world.textColor }}>
              Earn up to {level.gemReward} 💎 and {level.badgeReward ?? 'stars'}!
            </p>
          </div>
        </motion.div>

        {/* Game content */}
        <div className="flex-1 overflow-y-auto pb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {renderGame()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
