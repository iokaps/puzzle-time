import { cn } from '@/utils/cn';
import { KmTimeCountdown } from '@kokimoki/shared';
import { Clock } from 'lucide-react';

interface PuzzleTimerProps {
	remainingMs: number;
	className?: string;
}

/**
 * Timer component that shows remaining time with urgency states
 * - Green: > 30 seconds
 * - Yellow/pulsing: 10-30 seconds
 * - Red/fast pulsing: < 10 seconds
 */
export function PuzzleTimer({ remainingMs, className }: PuzzleTimerProps) {
	const seconds = Math.ceil(remainingMs / 1000);
	const isWarning = seconds <= 30 && seconds > 10;
	const isDanger = seconds <= 10;

	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-bold transition-colors',
				!isWarning && !isDanger && 'bg-emerald-500 text-white',
				isWarning && 'timer-warning bg-amber-500 text-white',
				isDanger && 'timer-danger bg-red-500 text-white',
				className
			)}
		>
			<Clock className={cn('h-5 w-5', isDanger && 'animate-pulse')} />
			<KmTimeCountdown ms={remainingMs} />
		</div>
	);
}
