import { usePlayersWithOnlineStatus } from '@/hooks/usePlayersWithOnlineStatus';
import { useServerTimer } from '@/hooks/useServerTime';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { cn } from '@/utils/cn';
import { Award, Medal, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSnapshot } from 'valtio';

/**
 * View shown between rounds displaying current rankings
 */
export function BetweenRoundsView() {
	const { t } = useTranslation();
	const serverTime = useServerTimer(100); // Update every 100ms for smooth countdown
	const puzzleState = useSnapshot(puzzleStore.proxy);
	const progressState = useSnapshot(playerProgressStore.proxy);
	const { players } = usePlayersWithOnlineStatus();

	// Calculate countdown
	const elapsed = serverTime - puzzleState.betweenRoundsStartTimestamp;
	const remainingMs = Math.max(
		0,
		puzzleState.betweenRoundsDurationMs - elapsed
	);
	const remainingSeconds = Math.ceil(remainingMs / 1000);

	// Calculate scores for each player
	const playerScores = players
		.map((player) => {
			const progress = progressState.progress[player.id];
			return {
				...player,
				score: progress?.totalScore || 0
			};
		})
		.sort((a, b) => b.score - a.score);

	const getRankIcon = (index: number) => {
		switch (index) {
			case 0:
				return <Trophy className="h-6 w-6 text-yellow-400" />;
			case 1:
				return <Medal className="h-6 w-6 text-zinc-300" />;
			case 2:
				return <Award className="h-6 w-6 text-amber-500" />;
			default:
				return (
					<span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-600 text-sm font-bold text-zinc-300">
						{index + 1}
					</span>
				);
		}
	};

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-gradient text-3xl font-extrabold">
					{t('ui:roundComplete')}
				</h2>
				<p className="mt-2 text-zinc-400">
					{t('ui:roundCounter', {
						current: puzzleState.currentRoundIndex + 1,
						total: puzzleState.totalRounds
					})}
				</p>
			</div>

			{/* Current standings */}
			<div className="w-full max-w-md">
				<h3 className="mb-3 text-center text-sm font-semibold tracking-wider text-zinc-500 uppercase">
					{t('ui:currentStandings')}
				</h3>
				<div className="space-y-2">
					{playerScores.map((player, index) => (
						<div
							key={player.id}
							className={cn(
								'animate-slide-in-up flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all',
								index === 0
									? 'bg-gradient-to-r from-yellow-500/15 to-amber-500/10 ring-1 ring-yellow-500/30'
									: index === 1
										? 'bg-gradient-to-r from-zinc-400/10 to-zinc-500/5 ring-1 ring-zinc-500/20'
										: index === 2
											? 'bg-gradient-to-r from-amber-600/10 to-amber-700/5 ring-1 ring-amber-600/20'
											: 'bg-zinc-800/50 ring-1 ring-zinc-700/30'
							)}
							style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
						>
							<div className="flex w-8 justify-center">
								{getRankIcon(index)}
							</div>
							<div className="flex-1">
								<p className="font-bold text-white">{player.name}</p>
							</div>
							<div className="text-right">
								<p className="text-xl font-extrabold text-white">
									{player.score}
								</p>
								<p className="text-xs text-zinc-500">{t('ui:points')}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Next round countdown */}
			<div className="flex flex-col items-center gap-3">
				{/* Circular countdown */}
				<div className="relative flex h-24 w-24 items-center justify-center">
					{/* Background circle */}
					<svg className="absolute h-full w-full -rotate-90">
						<circle
							cx="48"
							cy="48"
							r="42"
							fill="none"
							stroke="currentColor"
							strokeWidth="5"
							className="text-zinc-700/50"
						/>
						{/* Progress circle */}
						<circle
							cx="48"
							cy="48"
							r="42"
							fill="none"
							stroke="url(#countdown-gradient)"
							strokeWidth="5"
							strokeLinecap="round"
							strokeDasharray={`${2 * Math.PI * 42}`}
							strokeDashoffset={`${2 * Math.PI * 42 * (1 - remainingMs / puzzleState.betweenRoundsDurationMs)}`}
							style={{ transition: 'stroke-dashoffset 0.1s linear' }}
						/>
						<defs>
							<linearGradient
								id="countdown-gradient"
								x1="0%"
								y1="0%"
								x2="100%"
								y2="0%"
							>
								<stop offset="0%" stopColor="#14b8a6" />
								<stop offset="100%" stopColor="#22c55e" />
							</linearGradient>
						</defs>
					</svg>
					{/* Countdown number */}
					<span className="text-4xl font-extrabold text-white tabular-nums">
						{remainingSeconds}
					</span>
				</div>
				<p className="text-sm font-medium text-zinc-400">
					{t('ui:nextRoundIn', { seconds: remainingSeconds })}
				</p>
			</div>
		</div>
	);
}
