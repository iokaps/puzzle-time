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
					<div className="rank-gold flex h-10 w-10 items-center justify-center rounded-full">
						<Trophy className="animate-trophy-bounce h-5 w-5 text-white" />
					</div>
				);
			case 1:
				return (
					<div className="rank-silver flex h-10 w-10 items-center justify-center rounded-full">
						<Medal className="h-5 w-5 text-white" />
					</div>
				);
			case 2:
				return (
					<div className="rank-bronze flex h-10 w-10 items-center justify-center rounded-full">
						<Award className="h-5 w-5 text-white" />
					</div>
				);
			default:
				return (
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700">
						<span className="text-sm font-bold text-zinc-300">{rank + 1}</span>
					</div>
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
				return 'bg-gradient-to-r from-yellow-500/15 to-yellow-600/5 border-yellow-500/40';
			case 1:
				return 'bg-gradient-to-r from-zinc-400/15 to-zinc-500/5 border-zinc-400/40';
			case 2:
				return 'bg-gradient-to-r from-amber-500/15 to-amber-600/5 border-amber-500/40';
			default:
				return 'bg-zinc-800/40 border-zinc-700/40';
		}
	};

	return (
		<div className="relative flex flex-1 flex-col items-center gap-6 overflow-hidden p-4">
			{/* Confetti celebration */}
			<Confetti count={60} />

			{/* Header */}
			<div className="animate-score-pop text-center">
				<h1 className="text-4xl font-extrabold text-white">
					🎉 {t('ui:finalResults')}
				</h1>
				<p className="mt-2 text-lg text-zinc-400">{t('ui:gameComplete')}</p>
				{myRank >= 0 && (
					<p className="text-gradient mt-3 text-xl font-extrabold">
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
							'animate-slide-in-up flex items-center gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-all',
							getRankBgColor(rank),
							entry.playerId === kmClient.id && 'ring-2 ring-teal-500/60',
							rank === 0 && 'animate-winner-glow'
						)}
						style={{ animationDelay: `${rank * 0.15}s`, opacity: 0 }}
					>
						{/* Rank */}
						{getRankIcon(rank)}

						{/* Player info */}
						<div className="flex-1">
							<p className="font-bold text-white">
								{entry.name}
								{entry.playerId === kmClient.id && (
									<span className="ml-2 rounded-md bg-teal-500/20 px-2 py-0.5 text-xs font-semibold text-teal-400">
										you
									</span>
								)}
							</p>
							<p className="text-sm text-zinc-400">
								{entry.puzzlesSolved} {t('ui:puzzlesSolved')}
							</p>
						</div>

						{/* Animated Score */}
						<div className="text-right">
							<p className="text-2xl font-extrabold text-white">
								<AnimatedScore
									target={entry.totalScore}
									delay={rank * 150 + 300}
								/>
							</p>
							<p className="text-xs text-zinc-500">{t('ui:points')}</p>
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
					className="km-btn-primary flex items-center gap-2 text-lg"
				>
					<RotateCcw className="h-5 w-5" />
					{t('ui:playAgain')}
				</button>
			)}
		</div>
	);
}
