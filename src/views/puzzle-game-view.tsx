import { DraggablePiece, PuzzleBoard, PuzzleTimer } from '@/components/puzzle';
import { PUZZLES_BY_ID } from '@/data/puzzles';
import { useServerTimer } from '@/hooks/useServerTime';
import { kmClient } from '@/services/km-client';
import { localPuzzleActions } from '@/state/actions/local-puzzle-actions';
import { playerProgressActions } from '@/state/actions/player-progress-actions';
import type { PlacedPiece } from '@/state/schemas/local-puzzle-schema';
import { localPuzzleStore } from '@/state/stores/local-puzzle-store';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { cn } from '@/utils/cn';
import { canPlacePiece, checkPuzzleSolved } from '@/utils/puzzleHelpers';
import { Check, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

/**
 * Wrapper component that remounts PuzzleGameContent when round changes
 * This ensures piece state is reset without using setState in effects
 */
export function PuzzleGameView() {
	const puzzleState = useSnapshot(puzzleStore.proxy);

	// Clear external store pieces when round changes
	useEffect(() => {
		// Clear pieces when round changes - this is syncing with external state
		localPuzzleActions.clearAllPieces();
	}, [puzzleState.currentRoundIndex]);

	// Use key to remount component and reset local state when round changes
	return <PuzzleGameContent key={puzzleState.currentRoundIndex} />;
}

/**
 * Main puzzle game view content for players
 * Shows the current puzzle, timer, and piece tray
 */
function PuzzleGameContent() {
	const { t } = useTranslation();
	const serverTime = useServerTimer();
	const boardRef = useRef<HTMLDivElement>(null);
	const [boardBounds, setBoardBounds] = useState<DOMRect | undefined>();
	const [pieceRotations, setPieceRotations] = useState<Record<string, number>>(
		{}
	);

	const puzzleState = useSnapshot(puzzleStore.proxy);
	const progressState = useSnapshot(playerProgressStore.proxy);
	const localPuzzleState = useSnapshot(localPuzzleStore.proxy);

	const currentPuzzleId = puzzleState.puzzleIds[puzzleState.currentRoundIndex];
	const puzzle = currentPuzzleId ? PUZZLES_BY_ID[currentPuzzleId] : null;

	const myProgress = progressState.progress[kmClient.id];
	const hasCompletedRound = myProgress?.currentRoundCompleted || false;

	// Calculate remaining time
	const elapsed = serverTime - puzzleState.roundStartTimestamp;
	const remainingMs = Math.max(0, puzzleState.roundDurationMs - elapsed);

	// Determine cell size based on puzzle and screen size
	const cellSize = 44;

	// Update board bounds on mount and resize
	useEffect(() => {
		const updateBounds = () => {
			if (boardRef.current) {
				setBoardBounds(boardRef.current.getBoundingClientRect());
			}
		};

		updateBounds();
		window.addEventListener('resize', updateBounds);
		return () => window.removeEventListener('resize', updateBounds);
	}, [puzzle]);

	// Check for puzzle completion
	useEffect(() => {
		if (!puzzle || hasCompletedRound || puzzleState.phase !== 'playing') return;

		const placements = localPuzzleStore.proxy.placedPieces;
		const isSolved = checkPuzzleSolved(
			puzzle.boardShape,
			puzzle.pieces,
			placements
		);

		if (isSolved) {
			// Submit completion!
			playerProgressActions.completeRound(kmClient.id, remainingMs);
		}
	}, [
		localPuzzleState.placedPieces,
		puzzle,
		hasCompletedRound,
		remainingMs,
		puzzleState.phase
	]);

	const handlePieceDragEnd = useCallback(
		async (
			pieceId: string,
			gridX: number,
			gridY: number,
			isOnBoard: boolean
		) => {
			if (!puzzle || hasCompletedRound) return;

			const piece = puzzle.pieces.find((p) => p.id === pieceId);
			if (!piece) return;

			// Check if piece was already placed (repositioning)
			const wasPlaced = !!localPuzzleStore.proxy.placedPieces[pieceId];
			const currentPlacement = localPuzzleStore.proxy.placedPieces[pieceId];

			// Get rotation: use current placement rotation if repositioning, otherwise use tray rotation
			const rotation = currentPlacement
				? currentPlacement.rotation
				: pieceRotations[pieceId] || 0;

			if (isOnBoard) {
				// Get other placements for collision detection (excluding current piece)
				const otherPlacements = Object.entries(
					localPuzzleStore.proxy.placedPieces
				)
					.filter(([id]) => id !== pieceId)
					.map(([, placement]) => ({
						piece: puzzle.pieces.find((p) => p.id === placement.pieceId)!,
						placement
					}))
					.filter((p) => p.piece);

				// Check if valid placement
				if (
					canPlacePiece(
						puzzle.boardShape,
						piece,
						gridX,
						gridY,
						rotation,
						otherPlacements
					)
				) {
					// If repositioning, remove first then place at new position
					if (wasPlaced) {
						await localPuzzleActions.removePiece(pieceId);
					}
					await localPuzzleActions.placePiece(pieceId, gridX, gridY, rotation);
				}
				// If invalid, piece stays where it was (either in tray or on board)
			} else if (wasPlaced) {
				// Dragged off board - remove piece and return to tray
				setPieceRotations((prev) => ({
					...prev,
					[pieceId]: rotation
				}));
				await localPuzzleActions.removePiece(pieceId);
			}
		},
		[puzzle, pieceRotations, hasCompletedRound]
	);

	const handlePieceRotate = useCallback(
		(pieceId: string) => {
			if (hasCompletedRound) return;

			// Check if piece is placed on board
			const placement = localPuzzleStore.proxy.placedPieces[pieceId];
			if (placement) {
				// Rotate on board
				localPuzzleActions.rotatePiece(pieceId);
			} else {
				// Rotate in tray
				setPieceRotations((prev) => ({
					...prev,
					[pieceId]: ((prev[pieceId] || 0) + 1) % 4
				}));
			}
		},
		[hasCompletedRound]
	);

	const handleRemovePiece = useCallback(
		async (pieceId: string) => {
			if (hasCompletedRound) return;
			const placement = localPuzzleStore.proxy.placedPieces[pieceId];
			if (placement) {
				// Preserve the rotation when returning to tray
				setPieceRotations((prev) => ({
					...prev,
					[pieceId]: placement.rotation
				}));
				await localPuzzleActions.removePiece(pieceId);
			}
		},
		[hasCompletedRound]
	);

	if (!puzzle) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p className="text-zinc-400">{t('ui:loading')}</p>
			</div>
		);
	}

	// Get unplaced pieces
	const unplacedPieces = puzzle.pieces.filter(
		(p) => !localPuzzleState.placedPieces[p.id]
	);

	return (
		<div className="flex flex-1 flex-col items-center gap-4 overflow-auto p-4">
			{/* Header with timer and round info */}
			<div className="flex w-full items-center justify-between gap-4">
				<div className="text-sm font-semibold text-zinc-300">
					{t('ui:roundCounter', {
						current: puzzleState.currentRoundIndex + 1,
						total: puzzleState.totalRounds
					})}
				</div>
				<PuzzleTimer remainingMs={remainingMs} />
			</div>

			{/* Completion overlay */}
			{hasCompletedRound && (
				<div className="animate-in zoom-in flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-white shadow-lg shadow-emerald-500/25">
					<Check className="h-6 w-6" />
					<span className="font-bold">{t('ui:puzzleComplete')}</span>
					<span className="text-emerald-100">
						+
						{myProgress?.currentRoundTimeRemaining
							? Math.floor(myProgress.currentRoundTimeRemaining / 1000) + 100
							: 100}{' '}
						pts
					</span>
				</div>
			)}

			{/* Puzzle board */}
			<div ref={boardRef} className="relative">
				<PuzzleBoard
					boardShape={puzzle.boardShape}
					pieces={puzzle.pieces}
					placedPieces={
						localPuzzleState.placedPieces as Record<string, PlacedPiece>
					}
					cellSize={cellSize}
					boardBounds={boardBounds}
					disabled={hasCompletedRound}
					onPieceDragEnd={handlePieceDragEnd}
					onPieceDoubleTap={handlePieceRotate}
					onPieceRemove={handleRemovePiece}
					className={cn(
						hasCompletedRound &&
							'ring-4 ring-emerald-500 ring-offset-4 ring-offset-zinc-900'
					)}
				/>
			</div>

			{/* Instructions */}
			<p className="text-center text-sm text-zinc-400">
				{hasCompletedRound
					? t('ui:waitingNextRound')
					: t('ui:puzzleInstructions')}
			</p>

			{/* Piece tray */}
			{!hasCompletedRound && unplacedPieces.length > 0 && (
				<div className="flex flex-wrap items-center justify-center gap-4 rounded-xl bg-zinc-800/80 p-4 ring-1 ring-zinc-700 backdrop-blur-sm">
					{unplacedPieces.map((piece) => (
						<div key={piece.id} className="relative">
							<DraggablePiece
								piece={piece}
								cellSize={cellSize}
								rotation={pieceRotations[piece.id] || 0}
								isPlaced={false}
								boardBounds={boardBounds}
								boardShape={puzzle.boardShape}
								onDragEnd={(gridX, gridY, isOnBoard) =>
									handlePieceDragEnd(piece.id, gridX, gridY, isOnBoard)
								}
								onDoubleTap={() => handlePieceRotate(piece.id)}
							/>
							{/* Rotate button for accessibility */}
							<button
								onClick={() => handlePieceRotate(piece.id)}
								className="absolute -top-2 -right-2 rounded-full bg-zinc-600 p-1 text-white shadow-md hover:bg-zinc-500"
								title={t('ui:rotateTip')}
							>
								<RotateCw className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>
			)}

			{/* Hint text */}
			{!hasCompletedRound && (
				<p className="text-center text-xs text-zinc-500">{t('ui:rotateTip')}</p>
			)}
		</div>
	);
}
