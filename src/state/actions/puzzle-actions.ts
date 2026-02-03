import { getRandomPuzzleIds } from '@/data/puzzles';
import { kmClient } from '@/services/km-client';
import type { Difficulty } from '../schemas/puzzle-schema';
import { playerProgressStore } from '../stores/player-progress-store';
import { puzzleStore } from '../stores/puzzle-store';

/**
 * Actions for managing puzzle game state
 */
export const puzzleActions = {
	/**
	 * Toggle a difficulty level on/off
	 * Ensures at least one difficulty is always selected
	 */
	async toggleDifficulty(difficulty: Difficulty) {
		await kmClient.transact([puzzleStore], ([state]) => {
			const current = state.selectedDifficulties;
			const index = current.indexOf(difficulty);

			if (index >= 0) {
				// Remove only if more than one selected
				if (current.length > 1) {
					current.splice(index, 1);
				}
			} else {
				current.push(difficulty);
			}
		});
	},

	/**
	 * Set the total number of rounds
	 */
	async setTotalRounds(rounds: number) {
		await kmClient.transact([puzzleStore], ([state]) => {
			state.totalRounds = rounds;
		});
	},

	/**
	 * Start a new game with the current settings
	 */
	async startGame() {
		const { selectedDifficulties, totalRounds } = puzzleStore.proxy;

		// Get random puzzles from selected difficulties
		const puzzleIds = getRandomPuzzleIds(
			[...selectedDifficulties],
			totalRounds
		);

		await kmClient.transact(
			[puzzleStore, playerProgressStore],
			([puzzle, progress]) => {
				puzzle.phase = 'playing';
				puzzle.currentRoundIndex = 0;
				puzzle.puzzleIds = puzzleIds;
				puzzle.roundStartTimestamp = kmClient.serverTimestamp();

				// Reset all player progress
				progress.progress = {};
			}
		);
	},

	/**
	 * Advance to the next round (called by global controller)
	 */
	async advanceToNextRound() {
		const { currentRoundIndex, totalRounds } = puzzleStore.proxy;

		if (currentRoundIndex + 1 >= totalRounds) {
			// Game over
			await kmClient.transact([puzzleStore], ([state]) => {
				state.phase = 'ended';
			});
		} else {
			// Show between-rounds phase with timestamp for countdown
			await kmClient.transact(
				[puzzleStore, playerProgressStore],
				([puzzle, progress]) => {
					puzzle.phase = 'between-rounds';
					puzzle.betweenRoundsStartTimestamp = kmClient.serverTimestamp();

					// Reset current round completion for all players
					for (const playerId of Object.keys(progress.progress)) {
						progress.progress[playerId].currentRoundCompleted = false;
						progress.progress[playerId].currentRoundTimeRemaining = undefined;
					}
				}
			);
		}
	},

	/**
	 * Start the next round (called by global controller after between-rounds countdown)
	 */
	async startNextRound() {
		await kmClient.transact([puzzleStore], ([state]) => {
			state.currentRoundIndex += 1;
			state.phase = 'playing';
			state.roundStartTimestamp = kmClient.serverTimestamp();
		});
	},

	/**
	 * End the current game (host action)
	 */
	async endGame() {
		await kmClient.transact([puzzleStore], ([state]) => {
			state.phase = 'ended';
		});
	},

	/**
	 * Reset to lobby (for playing again)
	 */
	async resetToLobby() {
		await kmClient.transact(
			[puzzleStore, playerProgressStore],
			([puzzle, progress]) => {
				puzzle.phase = 'lobby';
				puzzle.currentRoundIndex = 0;
				puzzle.puzzleIds = [];
				puzzle.roundStartTimestamp = 0;

				// Reset all progress
				progress.progress = {};
			}
		);
	},

	/**
	 * Skip current round (host action)
	 */
	async skipRound() {
		await puzzleActions.advanceToNextRound();
	}
};
