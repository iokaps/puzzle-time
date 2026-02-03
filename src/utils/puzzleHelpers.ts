import type { PlacedPiece } from '@/state/schemas/local-puzzle-schema';
import type { PieceShape, PuzzlePiece } from '@/state/schemas/puzzle-schema';

/**
 * Rotate a piece shape 90 degrees clockwise
 */
export function rotatePieceShape(shape: PieceShape): PieceShape {
	const rows = shape.length;
	const cols = shape[0].length;
	const rotated: PieceShape = [];

	for (let col = 0; col < cols; col++) {
		rotated[col] = [];
		for (let row = rows - 1; row >= 0; row--) {
			rotated[col][rows - 1 - row] = shape[row][col];
		}
	}
	return rotated;
}

/**
 * Get piece shape after applying rotation
 * rotation: 0 = 0°, 1 = 90°, 2 = 180°, 3 = 270°
 */
export function getRotatedShape(
	shape: PieceShape,
	rotation: number
): PieceShape {
	let result = shape;
	const normalizedRotation = ((rotation % 4) + 4) % 4;
	for (let i = 0; i < normalizedRotation; i++) {
		result = rotatePieceShape(result);
	}
	return result;
}

/**
 * Get the bounding dimensions of a piece shape
 */
export function getShapeDimensions(shape: PieceShape): {
	width: number;
	height: number;
} {
	return {
		width: shape[0]?.length || 0,
		height: shape.length
	};
}

/**
 * Get all filled cell positions for a piece at a given grid position
 */
export function getPieceCells(
	piece: PuzzlePiece,
	gridX: number,
	gridY: number,
	rotation: number
): Array<{ x: number; y: number }> {
	const shape = getRotatedShape(piece.shape, rotation);
	const cells: Array<{ x: number; y: number }> = [];

	for (let py = 0; py < shape.length; py++) {
		for (let px = 0; px < shape[py].length; px++) {
			if (shape[py][px]) {
				cells.push({
					x: gridX + px,
					y: gridY + py
				});
			}
		}
	}

	return cells;
}

/**
 * Check if a piece can be placed at a given position on the board
 */
export function canPlacePiece(
	boardShape: boolean[][],
	piece: PuzzlePiece,
	gridX: number,
	gridY: number,
	rotation: number,
	otherPlacements: Array<{ piece: PuzzlePiece; placement: PlacedPiece }>
): boolean {
	const cells = getPieceCells(piece, gridX, gridY, rotation);

	// Build set of occupied cells from other pieces
	const occupiedCells = new Set<string>();
	for (const { piece: otherPiece, placement } of otherPlacements) {
		const otherCells = getPieceCells(
			otherPiece,
			placement.gridX,
			placement.gridY,
			placement.rotation
		);
		for (const cell of otherCells) {
			occupiedCells.add(`${cell.x},${cell.y}`);
		}
	}

	for (const cell of cells) {
		// Check bounds
		if (
			cell.y < 0 ||
			cell.y >= boardShape.length ||
			cell.x < 0 ||
			cell.x >= (boardShape[0]?.length || 0)
		) {
			return false;
		}

		// Check if this position is a valid empty space on the board
		if (!boardShape[cell.y][cell.x]) {
			return false;
		}

		// Check collision with other placed pieces
		if (occupiedCells.has(`${cell.x},${cell.y}`)) {
			return false;
		}
	}

	return true;
}

/**
 * Snap a position to the nearest valid grid position
 */
export function snapToGrid(
	pixelX: number,
	pixelY: number,
	cellSize: number
): { gridX: number; gridY: number } {
	return {
		gridX: Math.round(pixelX / cellSize),
		gridY: Math.round(pixelY / cellSize)
	};
}

/**
 * Check if the puzzle is completely solved
 * All empty spaces on the board must be filled by pieces
 */
export function checkPuzzleSolved(
	boardShape: boolean[][],
	pieces: PuzzlePiece[],
	placements: Record<string, PlacedPiece>
): boolean {
	// All pieces must be placed
	if (Object.keys(placements).length !== pieces.length) {
		return false;
	}

	// Create a set of all cells that need to be filled
	const requiredCells = new Set<string>();
	for (let y = 0; y < boardShape.length; y++) {
		for (let x = 0; x < (boardShape[y]?.length || 0); x++) {
			if (boardShape[y][x]) {
				requiredCells.add(`${x},${y}`);
			}
		}
	}

	// Create a set of all cells covered by placed pieces
	const coveredCells = new Set<string>();
	for (const placement of Object.values(placements)) {
		const piece = pieces.find((p) => p.id === placement.pieceId);
		if (!piece) continue;

		const cells = getPieceCells(
			piece,
			placement.gridX,
			placement.gridY,
			placement.rotation
		);
		for (const cell of cells) {
			const key = `${cell.x},${cell.y}`;
			// Check for overlapping pieces (invalid)
			if (coveredCells.has(key)) {
				return false;
			}
			// Check if piece is placed outside valid area
			if (!requiredCells.has(key)) {
				return false;
			}
			coveredCells.add(key);
		}
	}

	// All required cells must be covered
	return requiredCells.size === coveredCells.size;
}

/**
 * Calculate score based on remaining time
 * Base score: 100 points
 * Time bonus: 1 point per second remaining (max 60)
 * Total max score: 160 points per puzzle
 */
export function calculateScore(remainingMs: number): number {
	const baseScore = 100;
	const timeBonus = Math.max(0, Math.floor(remainingMs / 1000));
	return baseScore + timeBonus;
}

/**
 * Get board dimensions
 */
export function getBoardDimensions(boardShape: boolean[][]): {
	width: number;
	height: number;
} {
	return {
		width: boardShape[0]?.length || 0,
		height: boardShape.length
	};
}

/**
 * Count total cells that need to be filled on the board
 */
export function countBoardCells(boardShape: boolean[][]): number {
	let count = 0;
	for (const row of boardShape) {
		for (const cell of row) {
			if (cell) count++;
		}
	}
	return count;
}

/**
 * Count total cells in all pieces
 */
export function countPieceCells(pieces: PuzzlePiece[]): number {
	let count = 0;
	for (const piece of pieces) {
		for (const row of piece.shape) {
			for (const cell of row) {
				if (cell) count++;
			}
		}
	}
	return count;
}
