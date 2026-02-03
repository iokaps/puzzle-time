import { kmClient } from '@/services/km-client';
import type { PlacedPiece } from '../schemas/local-puzzle-schema';
import { localPuzzleStore } from '../stores/local-puzzle-store';

/**
 * Actions for managing local puzzle state (piece placements)
 */
export const localPuzzleActions = {
	/**
	 * Place a piece on the board
	 */
	async placePiece(
		pieceId: string,
		gridX: number,
		gridY: number,
		rotation: number
	) {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			state.placedPieces[pieceId] = {
				pieceId,
				gridX,
				gridY,
				rotation
			};
			state.selectedPieceId = null;
		});
	},

	/**
	 * Remove a piece from the board (back to tray)
	 */
	async removePiece(pieceId: string) {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			delete state.placedPieces[pieceId];
		});
	},

	/**
	 * Update a piece's position (for dragging on board)
	 */
	async updatePiecePosition(pieceId: string, gridX: number, gridY: number) {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			if (state.placedPieces[pieceId]) {
				state.placedPieces[pieceId].gridX = gridX;
				state.placedPieces[pieceId].gridY = gridY;
			}
		});
	},

	/**
	 * Rotate a piece (increment rotation by 1, wrapping at 4)
	 */
	async rotatePiece(pieceId: string) {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			if (state.placedPieces[pieceId]) {
				state.placedPieces[pieceId].rotation =
					(state.placedPieces[pieceId].rotation + 1) % 4;
			}
		});
	},

	/**
	 * Select a piece for interaction
	 */
	async selectPiece(pieceId: string | null) {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			state.selectedPieceId = pieceId;
		});
	},

	/**
	 * Clear all placed pieces (reset for new round)
	 */
	async clearAllPieces() {
		await kmClient.transact([localPuzzleStore], ([state]) => {
			state.placedPieces = {};
			state.selectedPieceId = null;
		});
	},

	/**
	 * Get current placements (sync read)
	 */
	getPlacements(): Record<string, PlacedPiece> {
		return { ...localPuzzleStore.proxy.placedPieces };
	}
};
