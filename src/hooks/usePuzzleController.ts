import { useGlobalController } from '@/hooks/useGlobalController';
import { useServerTimer } from '@/hooks/useServerTime';
import { puzzleActions } from '@/state/actions/puzzle-actions';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { playersStore } from '@/state/stores/players-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';

/**
 * Hook that manages puzzle game progression
 * Runs only on the global controller device
 * Handles:
 * - Round timer expiration (auto-advance after 60s)
 * - Between-rounds transition timing
 */
export function usePuzzleController() {
	const isGlobalController = useGlobalController();
	const serverTime = useServerTimer();
	const advancingRef = useRef(false);
	const startingNextRoundRef = useRef(false);

	const puzzleState = useSnapshot(puzzleStore.proxy);
	const progressState = useSnapshot(playerProgressStore.proxy);
	const playersState = useSnapshot(playersStore.proxy);

	useEffect(() => {
		// Only the global controller should manage game progression
		if (!isGlobalController) return;
		if (puzzleState.phase !== 'playing') return;
		if (advancingRef.current) return;

		// Calculate remaining time
		const elapsed = serverTime - puzzleState.roundStartTimestamp;
		const remainingMs = puzzleState.roundDurationMs - elapsed;

		// Check if time's up
		if (remainingMs <= 0) {
			advancingRef.current = true;
			puzzleActions.advanceToNextRound().finally(() => {
				// Reset after a delay to prevent rapid re-triggering
				setTimeout(() => {
					advancingRef.current = false;
				}, 1000);
			});
			return;
		}

		// Check if all players have completed the round
		const playerIds = Object.keys(playersState.players);
		if (playerIds.length > 0) {
			const allCompleted = playerIds.every(
				(playerId) => progressState.progress[playerId]?.currentRoundCompleted
			);

			if (allCompleted) {
				// Wait a moment to show completion, then advance
				advancingRef.current = true;
				setTimeout(() => {
					puzzleActions.advanceToNextRound().finally(() => {
						setTimeout(() => {
							advancingRef.current = false;
						}, 1000);
					});
				}, 2000); // 2 second celebration pause
			}
		}
	}, [
		isGlobalController,
		serverTime,
		puzzleState,
		progressState,
		playersState
	]);

	// Reset advancing flag when round changes
	useEffect(() => {
		advancingRef.current = false;
	}, [puzzleState.currentRoundIndex]);

	// Handle between-rounds countdown
	useEffect(() => {
		if (!isGlobalController) return;
		if (puzzleState.phase !== 'between-rounds') return;
		if (startingNextRoundRef.current) return;

		const elapsed = serverTime - puzzleState.betweenRoundsStartTimestamp;
		const remaining = puzzleState.betweenRoundsDurationMs - elapsed;

		if (remaining <= 0) {
			startingNextRoundRef.current = true;
			puzzleActions.startNextRound().finally(() => {
				setTimeout(() => {
					startingNextRoundRef.current = false;
				}, 1000);
			});
		}
	}, [isGlobalController, serverTime, puzzleState]);

	// Reset flag when phase changes
	useEffect(() => {
		if (puzzleState.phase !== 'between-rounds') {
			startingNextRoundRef.current = false;
		}
	}, [puzzleState.phase]);
}
