import React from 'react';
import { Scroll, Sigma, Code2 } from 'lucide-react';
import type { CourseTopic } from '@/lib/types';

const MAP: Record<CourseTopic, React.ComponentType<any>> = {
  history: Scroll,
  math: Sigma,
  coding: Code2
};

export function TopicIcon({
  topic,
  size = 24,
  className
}: {
  topic: CourseTopic;
  size?: number;
  className?: string;
}) {
  const Icon = MAP[topic] || Scroll;
  return <Icon size={size} className={className} />;
}
