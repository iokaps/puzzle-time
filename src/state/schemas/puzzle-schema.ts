import { z } from '@kokimoki/kit';

/**
 * Difficulty levels for puzzles
 */
export const difficultySchema = z.enum(['easy', 'medium', 'hard']);
export type Difficulty = z.infer<typeof difficultySchema>;

/**
 * Shape of a puzzle piece as a 2D boolean grid
 * true = filled cell, false = empty cell
 */
export const pieceShapeSchema = z.array(z.array(z.boolean()));
export type PieceShape = z.infer<typeof pieceShapeSchema>;

/**
 * A puzzle piece definition
 */
export const puzzlePieceSchema = z.object({
	id: z.string(),
	shape: pieceShapeSchema,
	color: z.string()
});
export type PuzzlePiece = z.infer<typeof puzzlePieceSchema>;

/**
 * A complete puzzle definition
 */
export const puzzleDefinitionSchema = z.object({
	id: z.string(),
	difficulty: difficultySchema,
	/** Board shape - true = empty space that needs to be filled */
	boardShape: z.array(z.array(z.boolean())),
	/** Pieces available to solve this puzzle */
	pieces: z.array(puzzlePieceSchema)
});
export type PuzzleDefinition = z.infer<typeof puzzleDefinitionSchema>;

/**
 * Game phase enum
 */
export const gamePhaseSchema = z.enum([
	'lobby',
	'playing',
	'between-rounds',
	'ended'
]);
export type GamePhase = z.infer<typeof gamePhaseSchema>;

/**
 * Schema for puzzle game state store (global, synced)
 */
export const puzzleStoreSchema = z.object({
	/** Current game phase */
	phase: gamePhaseSchema,
	/** Selected difficulties for this game (can select multiple) */
	selectedDifficulties: z.array(difficultySchema),
	/** Total number of rounds to play */
	totalRounds: z.number(),
	/** Current round index (0-based) */
	currentRoundIndex: z.number(),
	/** IDs of puzzles used in this game session (pre-selected at game start) */
	puzzleIds: z.array(z.string()),
	/** Timestamp when current round started (for timer) */
	roundStartTimestamp: z.number(),
	/** Duration per round in milliseconds (60 seconds) */
	roundDurationMs: z.number(),
	/** Timestamp when between-rounds phase started */
	betweenRoundsStartTimestamp: z.number(),
	/** Duration of between-rounds phase in milliseconds (10 seconds) */
	betweenRoundsDurationMs: z.number()
});

export type PuzzleState = z.infer<typeof puzzleStoreSchema>;
