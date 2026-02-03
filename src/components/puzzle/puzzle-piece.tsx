import type { PieceShape } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
import { getRotatedShape } from '@/utils/puzzleHelpers';

interface PuzzlePieceProps {
	shape: PieceShape;
	color: string;
	cellSize: number;
	rotation?: number;
	className?: string;
	isSelected?: boolean;
	isDragging?: boolean;
}

/**
 * Renders a puzzle piece shape as a grid of colored cells
 */
export function PuzzlePiece({
	shape,
	color,
	cellSize,
	rotation = 0,
	className,
	isSelected = false,
	isDragging = false
}: PuzzlePieceProps) {
	const rotatedShape = getRotatedShape(shape, rotation);
	const height = rotatedShape.length;
	const width = rotatedShape[0]?.length || 0;

	return (
		<div
			className={cn(
				'relative transition-transform',
				isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent',
				isDragging && 'scale-105 opacity-90',
				className
			)}
			style={{
				width: width * cellSize,
				height: height * cellSize
			}}
		>
			{rotatedShape.map((row, y) =>
				row.map(
					(isFilled, x) =>
						isFilled && (
							<div
								key={`${x}-${y}`}
								className="absolute rounded-sm border-2 border-white/30 shadow-sm"
								style={{
									left: x * cellSize,
									top: y * cellSize,
									width: cellSize,
									height: cellSize,
									backgroundColor: color
								}}
							/>
						)
				)
			)}
		</div>
	);
}
