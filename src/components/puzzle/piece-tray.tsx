import type { PlacedPiece } from '@/state/schemas/local-puzzle-schema';
import type { PuzzlePiece as PuzzlePieceType } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
import { DraggablePiece } from './draggable-piece';

interface PieceTrayProps {
	pieces: PuzzlePieceType[];
	placedPieces: Record<string, PlacedPiece>;
	cellSize: number;
	boardBounds?: DOMRect;
	onPieceDragEnd: (
		pieceId: string,
		gridX: number,
		gridY: number,
		isOnBoard: boolean
	) => void;
	onPieceRotate: (pieceId: string) => void;
	className?: string;
}

/**
 * Container for unplaced puzzle pieces
 */
export function PieceTray({
	pieces,
	placedPieces,
	cellSize,
	boardBounds,
	onPieceDragEnd,
	onPieceRotate,
	className
}: PieceTrayProps) {
	// Filter to show only unplaced pieces
	const unplacedPieces = pieces.filter((p) => !placedPieces[p.id]);

	return (
		<div
			className={cn(
				'flex flex-wrap items-center justify-center gap-4 rounded-xl bg-zinc-800/80 p-4 ring-1 ring-zinc-700 backdrop-blur-sm',
				className
			)}
		>
			{unplacedPieces.length > 0 ? (
				unplacedPieces.map((piece) => (
					<DraggablePiece
						key={piece.id}
						piece={piece}
						cellSize={cellSize}
						rotation={0}
						isPlaced={false}
						boardBounds={boardBounds}
						onDragEnd={(gridX, gridY, isOnBoard) =>
							onPieceDragEnd(piece.id, gridX, gridY, isOnBoard)
						}
						onDoubleTap={() => onPieceRotate(piece.id)}
					/>
				))
			) : (
				<p className="text-sm text-zinc-400">All pieces placed!</p>
			)}
		</div>
	);
}
