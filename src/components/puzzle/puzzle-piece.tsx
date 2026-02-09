import type { PieceShape } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
import { getRotatedShape } from '@/utils/puzzleHelpers';
import { useMemo } from 'react';

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
 * For a given cell, determine which of its 4 edges are "outer" (no filled neighbor).
 * Returns { top, right, bottom, left } booleans and a borderRadius string.
 */
function getCellEdgeInfo(
	shape: boolean[][],
	x: number,
	y: number
): {
	top: boolean;
	right: boolean;
	bottom: boolean;
	left: boolean;
	borderRadius: string;
} {
	const rows = shape.length;
	const cols = shape[0]?.length || 0;

	const top = y === 0 || !shape[y - 1]?.[x];
	const bottom = y === rows - 1 || !shape[y + 1]?.[x];
	const left = x === 0 || !shape[y]?.[x - 1];
	const right = x === cols - 1 || !shape[y]?.[x + 1];

	const r = '5px';
	const z = '0px';

	// Only round corners that are on an outer edge on BOTH sides of that corner
	const tl = top && left ? r : z;
	const tr = top && right ? r : z;
	const br = bottom && right ? r : z;
	const bl = bottom && left ? r : z;

	return {
		top,
		right,
		bottom,
		left,
		borderRadius: `${tl} ${tr} ${br} ${bl}`
	};
}

/**
 * Renders a puzzle piece shape as a grid of colored cells with 3D depth.
 * Adjacent cells share edges seamlessly; only outer edges are rounded and highlighted.
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

	// Pre-compute edge info for all filled cells
	const cellInfos = useMemo(() => {
		const infos: Array<{
			x: number;
			y: number;
			edges: ReturnType<typeof getCellEdgeInfo>;
		}> = [];
		for (let y = 0; y < rotatedShape.length; y++) {
			for (let x = 0; x < rotatedShape[y].length; x++) {
				if (rotatedShape[y][x]) {
					infos.push({ x, y, edges: getCellEdgeInfo(rotatedShape, x, y) });
				}
			}
		}
		return infos;
	}, [rotatedShape]);

	return (
		<div
			className={cn(
				'relative transition-transform',
				isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-transparent',
				isDragging && 'scale-105',
				className
			)}
			style={{
				width: width * cellSize,
				height: height * cellSize,
				filter: isDragging
					? 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))'
					: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))'
			}}
		>
			{cellInfos.map(({ x, y, edges }) => {
				// Build a box-shadow that only shows on outer edges
				const shadows: string[] = [];
				if (edges.top) shadows.push('inset 0 2px 0 rgba(255,255,255,0.25)');
				if (edges.bottom) shadows.push('inset 0 -2px 0 rgba(0,0,0,0.2)');
				if (edges.left) shadows.push('inset 2px 0 0 rgba(255,255,255,0.12)');
				if (edges.right) shadows.push('inset -2px 0 0 rgba(0,0,0,0.1)');

				return (
					<div
						key={`${x}-${y}`}
						className="absolute"
						style={{
							left: x * cellSize,
							top: y * cellSize,
							width: cellSize,
							height: cellSize,
							backgroundColor: color,
							borderRadius: edges.borderRadius,
							boxShadow: shadows.join(', ') || 'none'
						}}
					>
						{/* Glossy highlight on outer top-left corner cells */}
						{(edges.top || edges.left) && (
							<div
								className="pointer-events-none absolute inset-0"
								style={{
									borderRadius: edges.borderRadius,
									background:
										'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 60%)'
								}}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}
