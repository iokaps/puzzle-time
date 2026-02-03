import type { PuzzlePiece as PuzzlePieceType } from '@/state/schemas/puzzle-schema';
import { cn } from '@/utils/cn';
import { getRotatedShape } from '@/utils/puzzleHelpers';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PuzzlePiece } from './puzzle-piece';

interface DraggablePieceProps {
	piece: PuzzlePieceType;
	cellSize: number;
	rotation: number;
	isPlaced: boolean;
	boardBounds?: DOMRect;
	boardShape?: boolean[][];
	gridPosition?: { x: number; y: number };
	onDragStart?: () => void;
	onDragEnd?: (gridX: number, gridY: number, isOnBoard: boolean) => void;
	onDoubleTap?: () => void;
	onRemoveFromBoard?: () => void;
	onInvalidDrop?: () => void;
	className?: string;
}

/**
 * A draggable puzzle piece with touch/mouse support
 * Supports double-tap to rotate and snap-to-grid on drop
 */
export function DraggablePiece({
	piece,
	cellSize,
	rotation,
	isPlaced,
	boardBounds,
	boardShape,
	gridPosition,
	onDragStart,
	onDragEnd,
	onDoubleTap,
	onRemoveFromBoard,
	onInvalidDrop,
	className
}: DraggablePieceProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
	const [isShaking, setIsShaking] = useState(false);
	const pieceRef = useRef<HTMLDivElement>(null);
	const lastTapRef = useRef<number>(0);
	const initialClientPosRef = useRef({ x: 0, y: 0 });

	const handleDoubleTap = useCallback(() => {
		const now = Date.now();
		if (now - lastTapRef.current < 300) {
			onDoubleTap?.();
			lastTapRef.current = 0;
		} else {
			lastTapRef.current = now;
		}
	}, [onDoubleTap]);

	const handleDragStart = useCallback(
		(clientX: number, clientY: number) => {
			if (!pieceRef.current) return;

			initialClientPosRef.current = { x: clientX, y: clientY };

			setIsDragging(true);
			setDragPosition({ x: 0, y: 0 });
			onDragStart?.();
		},
		[onDragStart]
	);

	const handleDragMove = useCallback(
		(clientX: number, clientY: number) => {
			if (!isDragging) return;

			const deltaX = clientX - initialClientPosRef.current.x;
			const deltaY = clientY - initialClientPosRef.current.y;

			setDragPosition({ x: deltaX, y: deltaY });
		},
		[isDragging]
	);

	const triggerShake = useCallback(() => {
		setIsShaking(true);
		onInvalidDrop?.();
		setTimeout(() => setIsShaking(false), 300);
	}, [onInvalidDrop]);

	const handleDragEnd = useCallback(() => {
		if (!isDragging || !boardBounds) {
			setIsDragging(false);
			return;
		}

		const pieceRect = pieceRef.current?.getBoundingClientRect();
		if (!pieceRect) {
			setIsDragging(false);
			return;
		}

		// Board has 8px padding (p-2), so the actual grid starts 8px inside
		const boardPadding = 8;
		const gridLeft = boardBounds.left + boardPadding;
		const gridTop = boardBounds.top + boardPadding;

		// Calculate grid position from the top-left of the piece
		const pieceLeft = pieceRect.left;
		const pieceTop = pieceRect.top;

		// Calculate where the piece's top-left corner would snap to
		const relativeX = pieceLeft - gridLeft;
		const relativeY = pieceTop - gridTop;

		// Calculate snapped grid position
		const gridX = Math.round(relativeX / cellSize);
		const gridY = Math.round(relativeY / cellSize);

		// Get the rotated shape to check all cells
		const rotatedShape = getRotatedShape(piece.shape, rotation);
		const pieceHeight = rotatedShape.length;
		const pieceWidth = rotatedShape[0]?.length || 0;

		// Determine board dimensions
		const boardHeight = boardShape?.length || 0;
		const boardWidth = boardShape?.[0]?.length || 0;

		// Check if the piece (at snapped position) would be on the board
		// A piece is "on board" if its snapped position places at least part of it within board bounds
		const isOverBoard =
			gridX + pieceWidth > 0 &&
			gridX < boardWidth &&
			gridY + pieceHeight > 0 &&
			gridY < boardHeight;

		if (isOverBoard) {
			// Clamp to non-negative values for validation
			const clampedGridX = Math.max(0, gridX);
			const clampedGridY = Math.max(0, gridY);

			onDragEnd?.(clampedGridX, clampedGridY, true);
		} else {
			// Dropped outside board - remove from board if was placed, otherwise shake
			if (isPlaced) {
				onRemoveFromBoard?.();
			} else {
				triggerShake();
			}
			onDragEnd?.(0, 0, false);
		}

		setIsDragging(false);
		setDragPosition({ x: 0, y: 0 });
	}, [
		isDragging,
		boardBounds,
		boardShape,
		cellSize,
		piece.shape,
		rotation,
		isPlaced,
		onDragEnd,
		onRemoveFromBoard,
		triggerShake
	]);

	// Touch event handlers
	const handleTouchStart = useCallback(
		(e: React.TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			handleDoubleTap();
			handleDragStart(touch.clientX, touch.clientY);
		},
		[handleDoubleTap, handleDragStart]
	);

	const handleTouchMove = useCallback(
		(e: React.TouchEvent) => {
			e.preventDefault();
			const touch = e.touches[0];
			handleDragMove(touch.clientX, touch.clientY);
		},
		[handleDragMove]
	);

	const handleTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			e.preventDefault();
			handleDragEnd();
		},
		[handleDragEnd]
	);

	// Mouse event handlers
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			handleDoubleTap();
			handleDragStart(e.clientX, e.clientY);
		},
		[handleDoubleTap, handleDragStart]
	);

	// Global mouse move/up handlers when dragging
	useEffect(() => {
		if (!isDragging) return;

		const handleGlobalMouseMove = (e: MouseEvent) => {
			handleDragMove(e.clientX, e.clientY);
		};

		const handleGlobalMouseUp = () => {
			handleDragEnd();
		};

		window.addEventListener('mousemove', handleGlobalMouseMove);
		window.addEventListener('mouseup', handleGlobalMouseUp);

		return () => {
			window.removeEventListener('mousemove', handleGlobalMouseMove);
			window.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	}, [isDragging, handleDragMove, handleDragEnd]);

	// Calculate the style for placed pieces on the board
	const placedStyle =
		isPlaced && gridPosition
			? {
					position: 'absolute' as const,
					left: gridPosition.x * cellSize,
					top: gridPosition.y * cellSize,
					zIndex: isDragging ? 50 : 10
				}
			: {};

	return (
		<div
			ref={pieceRef}
			className={cn(
				'cursor-grab touch-none select-none active:cursor-grabbing',
				isDragging && 'z-50 opacity-90',
				isShaking && 'animate-shake',
				className
			)}
			style={{
				...placedStyle,
				transform: isDragging
					? `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(1.05)`
					: undefined,
				transition: isDragging ? 'none' : 'transform 0.15s ease-out'
			}}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onMouseDown={handleMouseDown}
		>
			<PuzzlePiece
				shape={piece.shape}
				color={piece.color}
				cellSize={cellSize}
				rotation={rotation}
				isDragging={isDragging}
			/>
		</div>
	);
}
