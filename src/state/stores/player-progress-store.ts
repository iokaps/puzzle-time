import { kmClient } from '@/services/km-client';
import type { PlayerProgressState } from '../schemas/player-progress-schema';

/**
 * Player Progress Store (Global)
 *
 * Tracks all players' scores, puzzles solved, and
 * current round completion status.
 * Synced across all connected clients for leaderboard display.
 */
export const playerProgressStore = kmClient.store<PlayerProgressState>(
	'player-progress',
	{
		progress: {}
	}
);
