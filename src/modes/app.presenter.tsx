import { PuzzleBoard, PuzzleTimer } from '@/components/puzzle';
import {
	withModeGuard,
	type ModeGuardProps
} from '@/components/with-mode-guard';
import { PUZZLES_BY_ID } from '@/data/puzzles';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useMeta } from '@/hooks/useMeta';
import { usePlayersWithOnlineStatus } from '@/hooks/usePlayersWithOnlineStatus';
import { usePuzzleController } from '@/hooks/usePuzzleController';
import { useServerTimer } from '@/hooks/useServerTime';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { gameConfigStore } from '@/state/stores/game-config-store';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { cn } from '@/utils/cn';
import { ConnectionsView } from '@/views/connections-view';
import { useSnapshot } from '@kokimoki/app';
import { KmQrCode } from '@kokimoki/shared';
import { Check, Clock, Trophy, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function App({ clientContext }: ModeGuardProps<'presenter'>) {
	const { t } = useTranslation();
	useMeta();
	useGlobalController();
	usePuzzleController();

	const serverTime = useServerTimer();
	const puzzleState = useSnapshot(puzzleStore.proxy);
	const progressState = useSnapshot(playerProgressStore.proxy);
	const { showPresenterQr } = useSnapshot(gameConfigStore.proxy);
	const { players } = usePlayersWithOnlineStatus();

	const playerLink = kmClient.generateLink(clientContext.playerCode, {
		mode: 'player'
	});

	const currentPuzzle = puzzleState.puzzleIds[puzzleState.currentRoundIndex]
		? PUZZLES_BY_ID[puzzleState.puzzleIds[puzzleState.currentRoundIndex]]
		: null;

	// Calculate remaining time
	const elapsed = serverTime - puzzleState.roundStartTimestamp;
	const remainingMs = Math.max(0, puzzleState.roundDurationMs - elapsed);

	// Get sorted leaderboard
	const leaderboard = Object.entries(progressState.progress)
		.map(([playerId, progress]) => ({
			playerId,
			name: players.find((p) => p.id === playerId)?.name || 'Unknown',
			totalScore: progress.totalScore,
			puzzlesSolved: progress.puzzlesSolved,
			currentRoundCompleted: progress.currentRoundCompleted
		}))
		.sort((a, b) => b.totalScore - a.totalScore);

	const completedCount = leaderboard.filter(
		(p) => p.currentRoundCompleted
	).length;

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header />

			<HostPresenterLayout.Main>
				{puzzleState.phase === 'lobby' && (
					<ConnectionsView>
						<KmQrCode
							data={playerLink}
							size={200}
							className={cn({ invisible: !showPresenterQr })}
						/>
					</ConnectionsView>
				)}

				{(puzzleState.phase === 'playing' ||
					puzzleState.phase === 'between-rounds') && (
					<div className="flex h-full gap-8">
						{/* Left side - Puzzle and Timer */}
						<div className="flex flex-1 flex-col items-center justify-center gap-6">
							{/* Round and Timer */}
							<div className="flex items-center gap-8">
								<div className="glass-card px-6 py-3 text-2xl font-extrabold text-white">
									{t('ui:roundCounter', {
										current: puzzleState.currentRoundIndex + 1,
										total: puzzleState.totalRounds
									})}
								</div>
								{puzzleState.phase === 'playing' && (
									<div className="scale-125">
										<PuzzleTimer remainingMs={remainingMs} />
									</div>
								)}
								{puzzleState.phase === 'between-rounds' && (
									<div className="rounded-xl bg-teal-500 px-6 py-3 text-xl text-white">
										<Clock className="mr-2 inline h-6 w-6" />
										{t('ui:nextRoundSoon')}
									</div>
								)}
							</div>

							{/* Current puzzle preview */}
							{currentPuzzle && (
								<div className="glass-card p-6">
									<PuzzleBoard
										boardShape={currentPuzzle.boardShape}
										pieces={currentPuzzle.pieces}
										placedPieces={{}}
										cellSize={48}
									/>
								</div>
							)}

							{/* Completion status */}
							<div className="glass-card flex items-center gap-3 px-6 py-3 text-white">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
									<Users className="h-5 w-5 text-teal-400" />
								</div>
								<span className="text-xl">
									{completedCount}/{players.length} {t('ui:completed')}
								</span>
							</div>
						</div>

						{/* Right side - Leaderboard */}
						<div className="glass-card w-80 p-5">
							<h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold text-white">
								<Trophy className="h-6 w-6 text-yellow-400" />
								{t('ui:leaderboard')}
							</h2>

							<div className="space-y-2">
								{leaderboard.slice(0, 10).map((entry, rank) => (
									<div
										key={entry.playerId}
										className={cn(
											'flex items-center justify-between rounded-xl px-3 py-2.5 transition-all',
											entry.currentRoundCompleted
												? 'border border-emerald-500/40 bg-emerald-500/10'
												: 'border border-zinc-700/30 bg-zinc-700/30'
										)}
									>
										<div className="flex items-center gap-3">
											<span
												className={cn(
													'flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold',
													rank === 0 && 'rank-gold text-white',
													rank === 1 && 'rank-silver text-white',
													rank === 2 && 'rank-bronze text-white',
													rank > 2 && 'bg-zinc-600 text-zinc-300'
												)}
											>
												{rank + 1}
											</span>
											<span className="text-white">{entry.name}</span>
											{entry.currentRoundCompleted && (
												<Check className="h-4 w-4 text-emerald-400" />
											)}
										</div>
										<span className="font-extrabold text-white">
											{entry.totalScore}
										</span>
									</div>
								))}

								{leaderboard.length === 0 && (
									<p className="text-center text-zinc-400">
										{t('ui:noPlayers')}
									</p>
								)}
							</div>
						</div>
					</div>
				)}

				{puzzleState.phase === 'ended' && (
					<div className="flex flex-col items-center justify-center gap-8">
						<h1 className="text-5xl font-extrabold text-white">
							🎉 {t('ui:finalResults')}
						</h1>

						{/* Final Leaderboard */}
						<div className="w-full max-w-2xl space-y-3">
							{leaderboard.slice(0, 5).map((entry, rank) => (
								<div
									key={entry.playerId}
									className={cn(
										'flex items-center gap-4 rounded-2xl border p-6 backdrop-blur-sm',
										rank === 0 &&
											'border-yellow-500/40 bg-gradient-to-r from-yellow-500/15 to-yellow-600/5',
										rank === 1 &&
											'border-zinc-400/40 bg-gradient-to-r from-zinc-400/15 to-zinc-500/5',
										rank === 2 &&
											'border-amber-600/40 bg-gradient-to-r from-amber-600/15 to-amber-700/5',
										rank > 2 && 'border-zinc-700/40 bg-zinc-800/40'
									)}
								>
									<div
										className={cn(
											'flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold',
											rank === 0 && 'rank-gold text-white',
											rank === 1 && 'rank-silver text-white',
											rank === 2 && 'rank-bronze text-white',
											rank > 2 && 'bg-zinc-700 text-zinc-300'
										)}
									>
										{rank + 1}
									</div>
									<div className="flex-1">
										<p className="text-2xl font-bold text-white">
											{entry.name}
										</p>
										<p className="text-zinc-400">
											{entry.puzzlesSolved} {t('ui:puzzlesSolved')}
										</p>
									</div>
									<div className="text-right">
										<p className="text-4xl font-extrabold text-white">
											{entry.totalScore}
										</p>
										<p className="text-zinc-400">{t('ui:points')}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</HostPresenterLayout.Main>
		</HostPresenterLayout.Root>
	);
}

export default withModeGuard(App, 'presenter');
