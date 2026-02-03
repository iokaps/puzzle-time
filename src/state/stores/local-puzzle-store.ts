import { kmClient } from '@/services/km-client';
import type { LocalPuzzleState } from '../schemas/local-puzzle-schema';

/**
 * Local Puzzle State Store (Device-only)
 *
 * Manages the player's current piece placements on the board.
 * Not synced - each player has their own puzzle-solving state.
 */
export const localPuzzleStore = kmClient.localStore<LocalPuzzleState>(
	'local-puzzle',
	{
		placedPieces: {},
		selectedPieceId: null
	}
);
