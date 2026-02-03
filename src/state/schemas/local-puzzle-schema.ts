import { z } from '@kokimoki/kit';

/**
 * A piece that has been placed on the board
 */
export const placedPieceSchema = z.object({
	pieceId: z.string(),
	/** Grid position (top-left corner of piece bounding box) */
	gridX: z.number(),
	gridY: z.number(),
	/** Rotation state: 0, 1, 2, 3 representing 0°, 90°, 180°, 270° */
	rotation: z.number()
});
export type PlacedPiece = z.infer<typeof placedPieceSchema>;

/**
 * Schema for local puzzle state (device-only, not synced)
 * Tracks the player's current piece placements
 */
export const localPuzzleStoreSchema = z.object({
	/** Pieces placed on the board, keyed by piece ID */
	placedPieces: z.record(z.string(), placedPieceSchema),
	/** Currently selected/dragging piece ID */
	selectedPieceId: z.string().nullable()
});

export type LocalPuzzleState = z.infer<typeof localPuzzleStoreSchema>;
