import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { LandingBackdrop } from '../../components/landing/LandingBackdrop';
import { GlassPanel } from '../../components/data/Charts';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { TopicIcon } from '../../components/topics/TopicIcon';
import { api } from '@/lib/api';
import type { CourseTopic } from '@/lib/types';

interface Lesson {
  _id: string;
  titleAr: string;
  summaryAr?: string;
  level?: number;
  weekIndex?: number;
  xpReward: number;
  gameCount?: number;
}
interface CoursePack {
  _id: string;
  slug: string;
  topic: CourseTopic;
  titleAr: string;
  accent?: { gradient: string[] };
  lessons: Lesson[];
}

export function TeacherCoursesScreen() {
  const [packs, setPacks] = useState<CoursePack[] | null>(null);
  const [editing, setEditing] = useState<{ courseId: string; lesson?: Lesson } | null>(null);

  const refresh = () => {
    api.get('/teacher/courses').then((r) => setPacks(r.data.data));
  };
  useEffect(refresh, []);

  const remove = async (lessonId: string) => {
    setPacks(
      (p) => p && p.map((c) => ({ ...c, lessons: c.lessons.filter((l) => l._id !== lessonId) }))
    );
    try {
      await api.delete(`/teacher/lessons/${lessonId}`);
    } catch {
      refresh();
    }
  };

  const save = async (form: Lesson, courseId: string) => {
    if (form._id) {
      await api.patch(`/teacher/lessons/${form._id}`, form);
      setPacks(
        (p) =>
          p &&
          p.map((c) =>
            c._id === courseId
              ? { ...c, lessons: c.lessons.map((l) => (l._id === form._id ? { ...l, ...form } : l)) }
              : c
          )
      );
    } else {
      const r = await api.post('/teacher/lessons', form);
      const created = r.data.data as Lesson;
      setPacks(
        (p) => p && p.map((c) => (c._id === courseId ? { ...c, lessons: [...c.lessons, created] } : c))
      );
    }
    setEditing(null);
  };

  return (
    <div className="relative">
      <LandingBackdrop />
      <div className="relative z-10">
        <header className="mb-6 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 28 }}>
              الدّروس
            </h1>
            <p className="text-white/65" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
              أنشئ، عدّل، أو احذف دروسك في كلّ مادّة
            </p>
          </div>
        </header>

        {!packs ? (
          <p className="text-white/55" style={{ fontFamily: 'Cairo' }}>جارٍ التحميل…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {packs.map((c) => {
              const accent = c.accent?.gradient[0] ?? '#A78BFA';
              return (
                <GlassPanel key={c._id} accent={accent}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-9 h-9 rounded-xl grid place-items-center"
                        style={{
                          background: `linear-gradient(135deg, ${c.accent?.gradient[0]}, ${c.accent?.gradient[1] ?? accent})`
                        }}
                      >
                        <TopicIcon topic={c.topic} size={18} className="text-white" />
                      </div>
                      <h3 style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 16, color: 'white' }}>
                        {c.titleAr}
                      </h3>
                    </div>
                    <button
                      onClick={() => setEditing({ courseId: c._id })}
                      className="rounded-full w-8 h-8 grid place-items-center text-white"
                      style={{
                        background: 'linear-gradient(135deg, #FBBF24, #F59E0B, #EF4444)',
                        boxShadow: '0 6px 18px rgba(245,158,11,0.4)'
                      }}
                      title="إضافة درس"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {c.lessons.map((l) => (
                      <div
                        key={l._id}
                        className="rounded-xl px-3 py-2.5 flex items-center gap-2"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        <BookOpen size={14} className="text-white/55 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white truncate" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700, fontSize: 13 }}>
                            {l.titleAr}
                          </p>
                          <p className="text-white/45 truncate" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>
                            المستوى {l.level ?? 1} • أسبوع {l.weekIndex ?? 1} • {l.gameCount ?? 0} لعبة
                          </p>
                        </div>
                        <span style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11, color: '#FACC15', fontWeight: 800 }}>
                          +{l.xpReward}
                        </span>
                        <button
                          onClick={() => setEditing({ courseId: c._id, lesson: l })}
                          className="rounded-full w-7 h-7 grid place-items-center text-white/65 hover:text-white"
                          title="تعديل"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => remove(l._id)}
                          className="rounded-full w-7 h-7 grid place-items-center text-rose-300 hover:bg-rose-500/15"
                          title="حذف"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && <LessonEditor edit={editing} onCancel={() => setEditing(null)} onSave={save} />}
      </AnimatePresence>
    </div>
  );
}

function LessonEditor({
  edit,
  onCancel,
  onSave
}: {
  edit: { courseId: string; lesson?: Lesson };
  onCancel: () => void;
  onSave: (form: Lesson, courseId: string) => void;
}) {
  const [form, setForm] = useState<Lesson>({
    _id: edit.lesson?._id ?? '',
    titleAr: edit.lesson?.titleAr ?? '',
    summaryAr: edit.lesson?.summaryAr ?? '',
    level: edit.lesson?.level ?? 1,
    weekIndex: edit.lesson?.weekIndex ?? 1,
    xpReward: edit.lesson?.xpReward ?? 50
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center p-6"
      style={{ background: 'rgba(8,4,28,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] rounded-3xl p-6"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,12,40,0.92) 0%, rgba(8,4,28,0.92) 100%)',
          border: '1px solid rgba(245,158,11,0.45)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(245,158,11,0.18)'
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, fontSize: 20 }}>
            {edit.lesson ? 'تعديل درس' : 'إضافة درس'}
          </h2>
          <button
            onClick={onCancel}
            className="rounded-full w-8 h-8 grid place-items-center text-white/55 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <Field
            labelAr="عنوان الدرس"
            value={form.titleAr}
            onChange={(v) => setForm({ ...form, titleAr: v })}
          />
          <Field
            labelAr="ملخّص قصير"
            value={form.summaryAr ?? ''}
            onChange={(v) => setForm({ ...form, summaryAr: v })}
            multiline
          />
          <div className="grid grid-cols-3 gap-3">
            <Field
              labelAr="المستوى"
              value={String(form.level ?? 1)}
              onChange={(v) => setForm({ ...form, level: Number(v) || 1 })}
              type="number"
            />
            <Field
              labelAr="الأسبوع"
              value={String(form.weekIndex ?? 1)}
              onChange={(v) => setForm({ ...form, weekIndex: Number(v) || 1 })}
              type="number"
            />
            <Field
              labelAr="نقاط XP"
              value={String(form.xpReward)}
              onChange={(v) => setForm({ ...form, xpReward: Number(v) || 0 })}
              type="number"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="text-white/65 hover:text-white px-4 py-2 text-sm"
            style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 700 }}
          >
            إلغاء
          </button>
          <PrimaryButton
            onClick={() => onSave(form, edit.courseId)}
            gradient={['#FBBF24', '#F59E0B', '#EF4444']}
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} />
              حفظ
            </span>
          </PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({
  labelAr,
  value,
  onChange,
  multiline,
  type = 'text'
}: {
  labelAr: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-white/65 mb-1.5" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12, fontWeight: 700 }}>
        {labelAr}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 resize-none"
          style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/8 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
          style={{ fontFamily: 'Cairo, sans-serif', fontSize: 14 }}
        />
      )}
    </label>
  );
}
