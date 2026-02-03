import { kmClient } from '@/services/km-client';
import type { PuzzleState } from '../schemas/puzzle-schema';

/**
 * Puzzle Game State Store (Global)
 *
 * Manages the puzzle game state including current round,
 * selected puzzles, timing, and game phase.
 * Synced across all connected clients.
 */
export const puzzleStore = kmClient.store<PuzzleState>('puzzle-state', {
	phase: 'lobby',
	selectedDifficulties: ['easy'],
	totalRounds: 5,
	currentRoundIndex: 0,
	puzzleIds: [],
	roundStartTimestamp: 0,
	roundDurationMs: 60000, // 60 seconds
	betweenRoundsStartTimestamp: 0,
	betweenRoundsDurationMs: 10000 // 10 seconds
});
