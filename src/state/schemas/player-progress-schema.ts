import { z } from '@kokimoki/kit';

/**
 * Progress entry for a single player
 */
export const playerProgressEntrySchema = z.object({
	/** Total accumulated score across all rounds */
	totalScore: z.number(),
	/** Number of puzzles successfully solved */
	puzzlesSolved: z.number(),
	/** Whether player completed the current round's puzzle */
	currentRoundCompleted: z.boolean(),
	/** Time remaining when they completed (for score calculation), in ms */
	currentRoundTimeRemaining: z.number().optional()
});
export type PlayerProgressEntry = z.infer<typeof playerProgressEntrySchema>;

/**
 * Schema for player progress store (global, synced)
 * Tracks all players' scores and completion status
 */
export const playerProgressStoreSchema = z.object({
	/** Player progress keyed by client ID */
	progress: z.record(z.string(), playerProgressEntrySchema)
});

export type PlayerProgressState = z.infer<typeof playerProgressStoreSchema>;
