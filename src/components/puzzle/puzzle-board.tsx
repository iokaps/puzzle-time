import type { PlacedPiece } from '@/state/schemas/local-puzzle-schema';
import type { PuzzlePiece as PuzzlePieceType } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
import { RotateCw } from 'lucide-react';
import { DraggablePiece } from './draggable-piece';
import { PuzzlePiece } from './puzzle-piece';

interface PuzzleBoardProps {
	boardShape: boolean[][];
	pieces: PuzzlePieceType[];
	placedPieces: Record<string, PlacedPiece>;
	cellSize: number;
	boardBounds?: DOMRect;
	disabled?: boolean;
	onCellClick?: (gridX: number, gridY: number) => void;
	onPieceClick?: (pieceId: string) => void;
	onPieceDragEnd?: (
		pieceId: string,
		gridX: number,
		gridY: number,
		isOnBoard: boolean
	) => void;
	onPieceDoubleTap?: (pieceId: string) => void;
	onPieceRotate?: (pieceId: string) => void;
	onPieceRemove?: (pieceId: string) => void;
	onInvalidDrop?: () => void;
	className?: string;
}

/**
 * Renders the puzzle board with empty spaces and placed pieces
 */
export function PuzzleBoard({
	boardShape,
	pieces,
	placedPieces,
	cellSize,
	boardBounds,
	disabled,
	onCellClick,
	onPieceDragEnd,
	onPieceDoubleTap,
	onPieceRotate,
	onPieceRemove,
	onInvalidDrop,
	className
}: PuzzleBoardProps) {
	const boardHeight = boardShape.length;
	const boardWidth = boardShape[0]?.length || 0;

	return (
		<div
			className={cn(
				'to-zinc-850 relative rounded-2xl bg-gradient-to-br from-zinc-800 p-2 shadow-2xl ring-1 ring-zinc-700/50',
				className
			)}
			style={{
				width: boardWidth * cellSize + 16,
				height: boardHeight * cellSize + 16
			}}
		>
			{/* Board grid container */}
			<div
				className="puzzle-board-grid relative rounded-lg"
				style={{
					width: boardWidth * cellSize,
					height: boardHeight * cellSize,
					backgroundSize: `${cellSize}px ${cellSize}px`
				}}
			>
				{/* Render empty spaces (valid drop zones) */}
				{boardShape.map((row, y) =>
					row.map((isEmpty, x) => (
						<div
							key={`cell-${x}-${y}`}
							className={cn(
								'absolute transition-all duration-200',
								isEmpty ? 'board-cell-empty cursor-pointer' : 'bg-transparent'
							)}
							style={{
								left: x * cellSize,
								top: y * cellSize,
								width: cellSize,
								height: cellSize
							}}
							onClick={() => isEmpty && onCellClick?.(x, y)}
						/>
					))
				)}

				{/* Render placed pieces - draggable if not disabled */}
				{Object.entries(placedPieces).map(([pieceId, placement]) => {
					const piece = pieces.find((p) => p.id === pieceId);
					if (!piece) return null;

					// If disabled (e.g., round completed), render static piece
					if (disabled) {
						return (
							<div
								key={pieceId}
								className="absolute transition-all"
								style={{
									left: placement.gridX * cellSize,
									top: placement.gridY * cellSize,
									zIndex: 10
								}}
							>
								<PuzzlePiece
									shape={piece.shape}
									color={piece.color}
									cellSize={cellSize}
									rotation={placement.rotation}
								/>
							</div>
						);
					}

					// Render draggable piece that can be repositioned, with rotate button
					return (
						<div key={pieceId} className="group">
							<DraggablePiece
								piece={piece}
								cellSize={cellSize}
								rotation={placement.rotation}
								isPlaced={true}
								boardBounds={boardBounds}
								boardShape={boardShape}
								gridPosition={{ x: placement.gridX, y: placement.gridY }}
								onDragEnd={(gridX, gridY, isOnBoard) =>
									onPieceDragEnd?.(pieceId, gridX, gridY, isOnBoard)
								}
								onDoubleTap={() => onPieceDoubleTap?.(pieceId)}
								onRemoveFromBoard={() => onPieceRemove?.(pieceId)}
								onInvalidDrop={onInvalidDrop}
							>
								{/* Rotate button overlay on placed piece */}
								<button
									onMouseDown={(e) => e.stopPropagation()}
									onTouchStart={(e) => e.stopPropagation()}
									onClick={(e) => {
										e.stopPropagation();
										onPieceRotate?.(pieceId);
									}}
									className="absolute -top-2.5 -right-2.5 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-white shadow-lg ring-1 ring-zinc-500/50 transition-all hover:scale-110 hover:bg-teal-500 active:scale-95"
								>
									<RotateCw className="h-3 w-3" />
								</button>
							</DraggablePiece>
						</div>
					);
				})}
			</div>
		</div>
	);
}
