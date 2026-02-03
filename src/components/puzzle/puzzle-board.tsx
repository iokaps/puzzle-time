import type { PlacedPiece } from '@/state/schemas/local-puzzle-schema';
import type { PuzzlePiece as PuzzlePieceType } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
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
	onPieceRemove,
	onInvalidDrop,
	className
}: PuzzleBoardProps) {
	const boardHeight = boardShape.length;
	const boardWidth = boardShape[0]?.length || 0;

	return (
		<div
			className={cn(
				'relative rounded-2xl bg-zinc-800 p-2 shadow-xl ring-1 ring-zinc-700',
				className
			)}
			style={{
				width: boardWidth * cellSize + 16,
				height: boardHeight * cellSize + 16
			}}
		>
			{/* Board grid container */}
			<div
				className="relative"
				style={{
					width: boardWidth * cellSize,
					height: boardHeight * cellSize
				}}
			>
				{/* Render empty spaces (valid drop zones) */}
				{boardShape.map((row, y) =>
					row.map((isEmpty, x) => (
						<div
							key={`cell-${x}-${y}`}
							className={cn(
								'absolute rounded-md transition-colors',
								isEmpty
									? 'cursor-pointer border-2 border-dashed border-zinc-600 bg-zinc-700/50 hover:border-teal-500/50 hover:bg-zinc-600/50'
									: 'bg-transparent'
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

					// Render draggable piece that can be repositioned
					return (
						<DraggablePiece
							key={pieceId}
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
						/>
					);
				})}
			</div>
		</div>
	);
}
