import { kmClient } from '@/services/km-client';
import { puzzleActions } from '@/state/actions/puzzle-actions';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { playersStore } from '@/state/stores/players-store';
import { cn } from '@/utils/cn';
import { Award, Medal, RotateCcw, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

// Confetti colors matching our puzzle piece theme
const CONFETTI_COLORS = [
	'#ef4444', // red
	'#f97316', // orange
	'#facc15', // yellow
	'#22c55e', // green
	'#3b82f6', // blue
	'#a855f7', // purple
	'#ec4899', // pink
	'#14b8a6' // teal
];

// Pre-generate confetti data outside component to avoid impure function errors
function generateConfettiPieces(count: number) {
	return Array.from({ length: count }, (_, i) => ({
		id: i,
		left: Math.random() * 100,
		delay: Math.random() * 2,
		duration: 2 + Math.random() * 2,
		color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
		size: 6 + Math.random() * 8,
		swayDuration: 1 + Math.random() * 2,
		isRound: Math.random() > 0.5
	}));
}

/** Generate confetti pieces */
function Confetti({ count = 50 }: { count?: number }) {
	// Use useState with initializer to generate pieces only once
	const [pieces] = useState(() => generateConfettiPieces(count));

	return (
		<>
			{pieces.map((piece) => (
				<div
					key={piece.id}
					className="confetti-piece"
					style={{
						left: `${piece.left}%`,
						width: piece.size,
						height: piece.size,
						backgroundColor: piece.color,
						borderRadius: piece.isRound ? '50%' : '2px',
						animationDelay: `${piece.delay}s`,
						animationDuration: `${piece.duration}s, ${piece.swayDuration}s`
					}}
				/>
			))}
		</>
	);
}

/** Animated counter that rolls up from 0 */
function AnimatedScore({
	target,
	delay = 0
}: {
	target: number;
	delay?: number;
}) {
	const [value, setValue] = useState(0);
	const [started, setStarted] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setStarted(true), delay);
		return () => clearTimeout(timer);
	}, [delay]);

	useEffect(() => {
		if (!started || target === 0) return;

		const duration = 1000; // 1 second
		const startTime = Date.now();

		const animate = () => {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Ease out cubic for satisfying deceleration
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Math.floor(eased * target));

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				setValue(target);
			}
		};

		requestAnimationFrame(animate);
	}, [started, target]);

	return <span className="tabular-nums">{value}</span>;
}

/**
 * Results view shown at the end of the game
 * Displays final leaderboard sorted by total score
 */
export function PuzzleResultsView() {
	const { t } = useTranslation();
	const progressState = useSnapshot(playerProgressStore.proxy);
	const playersState = useSnapshot(playersStore.proxy);

	// Create sorted leaderboard
	const leaderboard = Object.entries(progressState.progress)
		.map(([playerId, progress]) => ({
			playerId,
			name: playersState.players[playerId]?.name || 'Unknown',
			totalScore: progress.totalScore,
			puzzlesSolved: progress.puzzlesSolved
		}))
		.sort((a, b) => b.totalScore - a.totalScore);

	const isHost = kmClient.clientContext.mode === 'host';

	// Find current player's rank
	const myRank = leaderboard.findIndex((e) => e.playerId === kmClient.id);

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 0:
				return (
					<Trophy className="animate-trophy-bounce h-6 w-6 text-yellow-400" />
				);
			case 1:
				return <Medal className="h-6 w-6 text-zinc-300" />;
			case 2:
				return <Award className="h-6 w-6 text-amber-500" />;
			default:
				return (
					<span className="w-6 text-center font-bold text-zinc-400">
						{rank + 1}
					</span>
				);
		}
	};

	const getRankMessage = (rank: number) => {
		switch (rank) {
			case 0:
				return t('ui:rank1Message');
			case 1:
				return t('ui:rank2Message');
			case 2:
				return t('ui:rank3Message');
			default:
				return t('ui:rankOtherMessage');
		}
	};

	const getRankBgColor = (rank: number) => {
		switch (rank) {
			case 0:
				return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50';
			case 1:
				return 'bg-gradient-to-r from-zinc-400/20 to-zinc-500/10 border-zinc-400/50';
			case 2:
				return 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500/50';
			default:
				return 'bg-zinc-800/50 border-zinc-700';
		}
	};

	return (
		<div className="relative flex flex-1 flex-col items-center gap-6 overflow-hidden p-4">
			{/* Confetti celebration */}
			<Confetti count={60} />

			{/* Header */}
			<div className="animate-score-pop text-center">
				<h1 className="text-3xl font-bold text-white">
					🎉 {t('ui:finalResults')}
				</h1>
				<p className="mt-2 text-zinc-400">{t('ui:gameComplete')}</p>
				{myRank >= 0 && (
					<p className="mt-3 text-lg font-semibold text-teal-400">
						{getRankMessage(myRank)}
					</p>
				)}
			</div>

			{/* Leaderboard */}
			<div className="w-full max-w-md space-y-3 overflow-auto">
				{leaderboard.map((entry, rank) => (
					<div
						key={entry.playerId}
						className={cn(
							'animate-slide-in-up flex items-center gap-4 rounded-xl border p-4 transition-all',
							getRankBgColor(rank),
							entry.playerId === kmClient.id && 'ring-2 ring-teal-500',
							rank === 0 && 'animate-winner-glow'
						)}
						style={{ animationDelay: `${rank * 0.15}s`, opacity: 0 }}
					>
						{/* Rank */}
						<div className="flex h-10 w-10 items-center justify-center">
							{getRankIcon(rank)}
						</div>

						{/* Player info */}
						<div className="flex-1">
							<p className="font-semibold text-white">
								{entry.name}
								{entry.playerId === kmClient.id && (
									<span className="ml-2 text-xs text-teal-400">(you)</span>
								)}
							</p>
							<p className="text-sm text-zinc-400">
								{entry.puzzlesSolved} {t('ui:puzzlesSolved')}
							</p>
						</div>

						{/* Animated Score */}
						<div className="text-right">
							<p className="text-2xl font-bold text-white">
								<AnimatedScore
									target={entry.totalScore}
									delay={rank * 150 + 300}
								/>
							</p>
							<p className="text-xs text-zinc-400">{t('ui:points')}</p>
						</div>
					</div>
				))}

				{leaderboard.length === 0 && (
					<p className="text-center text-zinc-400">{t('ui:noPlayers')}</p>
				)}
			</div>

			{/* Play again button (host only) */}
			{isHost && (
				<button
					onClick={() => puzzleActions.resetToLobby()}
					className="km-btn-primary flex items-center gap-2"
				>
					<RotateCcw className="h-5 w-5" />
					{t('ui:playAgain')}
				</button>
			)}
		</div>
	);
}
