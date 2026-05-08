import type { GameType } from '@/lib/types';
import type { GamePlugin } from './_types';

import { QuizGame } from './quiz/QuizGame';
import { FlashcardGame } from './flashcard/FlashcardGame';
import { DragDropGame } from './dragdrop/DragDropGame';
import { ArrowMatchGame } from './arrowmatch/ArrowMatchGame';
import { ImagePuzzleGame } from './imagepuzzle/ImagePuzzleGame';
import { TankAttackGame } from './tankattack/TankAttackGame';

export const GAME_REGISTRY: Record<GameType, GamePlugin> = {
  quiz: { type: 'quiz', Component: QuizGame },
  flashcard: { type: 'flashcard', Component: FlashcardGame },
  dragdrop: { type: 'dragdrop', Component: DragDropGame },
  arrowmatch: { type: 'arrowmatch', Component: ArrowMatchGame },
  imagepuzzle: { type: 'imagepuzzle', Component: ImagePuzzleGame },
  tankattack: { type: 'tankattack', Component: TankAttackGame }
};
