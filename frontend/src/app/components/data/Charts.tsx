import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar
} from 'recharts';

const TOOLTIP_STYLE = {
  background: 'rgba(8,4,28,0.92)',
  border: '1px solid rgba(245,158,11,0.45)',
  borderRadius: 12,
  fontFamily: 'Cairo, sans-serif',
  fontSize: 12,
  color: 'white',
  padding: '6px 10px'
};

export function PanelHeader({
  titleAr,
  hintAr,
  right
}: {
  titleAr: string;
  hintAr?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="text-white" style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 800, fontSize: 16 }}>
          {titleAr}
        </h3>
        {hintAr && (
          <p className="text-white/55 mt-0.5" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12 }}>
            {hintAr}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

export function GlassPanel({ children, className = '', accent = '#A78BFA' }: { children: React.ReactNode; className?: string; accent?: string }) {
  return (
    <div
      className={`relative rounded-2xl p-5 ${className}`}
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        border: `1px solid ${accent}22`,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)'
      }}
    >
      {children}
    </div>
  );
}

interface AreaSeriesProps {
  data: Array<{ day: string; users: number }>;
  color?: string;
  height?: number;
}
export function DauArea({ data, color = '#FBBF24', height = 220 }: AreaSeriesProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="dauFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fill: 'rgba(255,255,255,0.55)', fontFamily: 'Cairo, sans-serif', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          reversed
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.55)', fontFamily: 'Cairo, sans-serif', fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          orientation="right"
          width={32}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: color, strokeOpacity: 0.4 }} />
        <Area type="monotone" dataKey="users" stroke={color} strokeWidth={2.4} fill="url(#dauFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DonutDatum { name: string; value: number; color: string }
export function DonutPie({ data, height = 220 }: { data: DonutDatum[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={86}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="text-white/55" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>
            المجموع
          </div>
          <div style={{ fontFamily: 'Cairo, sans-serif', fontWeight: 900, color: 'white', fontSize: 22 }}>
            {total}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center flex-wrap gap-3">
        {data.map((d) => (
          <div key={d.name} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: d.color }}
            />
            <span className="text-white/75" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 12, fontWeight: 700 }}>
              {d.name}
            </span>
            <span className="text-white/45" style={{ fontFamily: 'Cairo, sans-serif', fontSize: 11 }}>
              ({d.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalBars({
  data,
  height = 220,
  color = '#38BDF8'
}: {
  data: Array<{ name: string; value: number }>;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: 'rgba(255,255,255,0.55)', fontFamily: 'Cairo, sans-serif', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          tick={{ fill: 'rgba(255,255,255,0.85)', fontFamily: 'Cairo, sans-serif', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          orientation="right"
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" fill={color} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopicBars({
  data,
  height = 200
}: {
  data: Array<{ topic: string; value: number; color: string }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="topic"
          tick={{ fill: 'rgba(255,255,255,0.75)', fontFamily: 'Cairo, sans-serif', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          reversed
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: 'rgba(255,255,255,0.55)', fontFamily: 'Cairo, sans-serif', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
          orientation="right"
          width={32}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GoalRadial({ value, label, color = '#FBBF24', height = 200 }: { value: number; label: string; color?: string; height?: number }) {
  const data = [{ name: label, value }];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart innerRadius="65%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
        <RadialBar background={{ fill: 'rgba(255,255,255,0.08)' }} dataKey="value" cornerRadius={10} fill={color} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
