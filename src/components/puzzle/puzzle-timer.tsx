import { cn } from '@/utils/cn';
import { KmTimeCountdown } from '@kokimoki/shared';
import { Clock } from 'lucide-react';

interface PuzzleTimerProps {
	remainingMs: number;
	totalMs?: number;
	className?: string;
}

/**
 * Timer component that shows remaining time with urgency states
 * - Green: > 30 seconds
 * - Yellow/pulsing: 10-30 seconds
 * - Red/fast pulsing: < 10 seconds
 */
export function PuzzleTimer({
	remainingMs,
	totalMs,
	className
}: PuzzleTimerProps) {
	const seconds = Math.ceil(remainingMs / 1000);
	const isWarning = seconds <= 30 && seconds > 10;
	const isDanger = seconds <= 10;

	// Calculate progress for the ring
	const progress = totalMs ? remainingMs / totalMs : undefined;

	return (
		<div
			className={cn(
				'flex items-center gap-2.5 rounded-2xl px-5 py-2.5 font-mono text-lg font-bold shadow-lg transition-all duration-300',
				!isWarning &&
					!isDanger &&
					'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20',
				isWarning &&
					'timer-warning bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20',
				isDanger &&
					'timer-danger bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30',
				className
			)}
		>
			{progress !== undefined ? (
				<svg className="h-6 w-6 -rotate-90" viewBox="0 0 24 24">
					<circle
						cx="12"
						cy="12"
						r="10"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						className="opacity-30"
					/>
					<circle
						cx="12"
						cy="12"
						r="10"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeDasharray={`${2 * Math.PI * 10}`}
						strokeDashoffset={`${2 * Math.PI * 10 * (1 - progress)}`}
						style={{ transition: 'stroke-dashoffset 0.3s linear' }}
					/>
				</svg>
			) : (
				<Clock className={cn('h-5 w-5', isDanger && 'animate-pulse')} />
			)}
			<KmTimeCountdown ms={remainingMs} />
		</div>
	);
}
