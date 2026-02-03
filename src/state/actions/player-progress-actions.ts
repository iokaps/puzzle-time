import { kmClient } from '@/services/km-client';
import { calculateScore } from '@/utils/puzzleHelpers';
import { playerProgressStore } from '../stores/player-progress-store';

/**
 * Actions for managing player progress
 */
export const playerProgressActions = {
	/**
	 * Mark current round as completed for a player
	 */
	async completeRound(playerId: string, remainingMs: number) {
		const score = calculateScore(remainingMs);

		await kmClient.transact([playerProgressStore], ([state]) => {
			if (!state.progress[playerId]) {
				state.progress[playerId] = {
					totalScore: 0,
					puzzlesSolved: 0,
					currentRoundCompleted: false
				};
			}

			// Only award points if not already completed this round
			if (!state.progress[playerId].currentRoundCompleted) {
				state.progress[playerId].totalScore += score;
				state.progress[playerId].puzzlesSolved += 1;
				state.progress[playerId].currentRoundCompleted = true;
				state.progress[playerId].currentRoundTimeRemaining = remainingMs;
			}
		});
	},

	/**
	 * Initialize a player's progress entry
	 */
	async initializePlayer(playerId: string) {
		await kmClient.transact([playerProgressStore], ([state]) => {
			if (!state.progress[playerId]) {
				state.progress[playerId] = {
					totalScore: 0,
					puzzlesSolved: 0,
					currentRoundCompleted: false
				};
			}
		});
	},

	/**
	 * Reset all player progress (for new game)
	 */
	async resetAllProgress() {
		await kmClient.transact([playerProgressStore], ([state]) => {
			state.progress = {};
		});
	}
};
