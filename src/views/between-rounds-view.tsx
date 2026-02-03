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
					<span className="w-6 text-center font-bold text-zinc-400">
						{index + 1}
					</span>
				);
		}
	};

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6 p-4">
			{/* Header */}
			<div className="text-center">
				<h2 className="text-2xl font-bold text-white">
					{t('ui:roundComplete')}
				</h2>
				<p className="mt-1 text-zinc-400">
					{t('ui:roundCounter', {
						current: puzzleState.currentRoundIndex + 1,
						total: puzzleState.totalRounds
					})}
				</p>
			</div>

			{/* Current standings */}
			<div className="w-full max-w-md">
				<h3 className="mb-3 text-center text-sm font-medium text-zinc-400">
					{t('ui:currentStandings')}
				</h3>
				<div className="space-y-2">
					{playerScores.map((player, index) => (
						<div
							key={player.id}
							className={cn(
								'flex items-center gap-3 rounded-xl px-4 py-3',
								index === 0
									? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 ring-1 ring-yellow-500/30'
									: 'bg-zinc-800/50'
							)}
						>
							<div className="flex w-8 justify-center">
								{getRankIcon(index)}
							</div>
							<div className="flex-1">
								<p className="font-semibold text-white">{player.name}</p>
							</div>
							<div className="text-right">
								<p className="text-xl font-bold text-white">{player.score}</p>
								<p className="text-xs text-zinc-400">{t('ui:points')}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Next round countdown */}
			<div className="flex flex-col items-center gap-3">
				{/* Circular countdown */}
				<div className="relative flex h-20 w-20 items-center justify-center">
					{/* Background circle */}
					<svg className="absolute h-full w-full -rotate-90">
						<circle
							cx="40"
							cy="40"
							r="36"
							fill="none"
							stroke="currentColor"
							strokeWidth="6"
							className="text-zinc-700"
						/>
						{/* Progress circle */}
						<circle
							cx="40"
							cy="40"
							r="36"
							fill="none"
							stroke="currentColor"
							strokeWidth="6"
							strokeLinecap="round"
							className="text-teal-500"
							strokeDasharray={`${2 * Math.PI * 36}`}
							strokeDashoffset={`${2 * Math.PI * 36 * (1 - remainingMs / puzzleState.betweenRoundsDurationMs)}`}
							style={{ transition: 'stroke-dashoffset 0.1s linear' }}
						/>
					</svg>
					{/* Countdown number */}
					<span className="text-3xl font-bold text-white tabular-nums">
						{remainingSeconds}
					</span>
				</div>
				<p className="text-sm text-zinc-400">
					{t('ui:nextRoundIn', { seconds: remainingSeconds })}
				</p>
			</div>
		</div>
	);
}
