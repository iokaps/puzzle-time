import { PuzzleBoard, PuzzleTimer } from '@/components/puzzle';
import { withKmProviders } from '@/components/with-km-providers';
import {
	type ModeGuardProps,
	withModeGuard
} from '@/components/with-mode-guard';
import { PUZZLES_BY_ID } from '@/data/puzzles';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useMeta } from '@/hooks/useMeta';
import { usePlayersWithOnlineStatus } from '@/hooks/usePlayersWithOnlineStatus';
import { usePuzzleController } from '@/hooks/usePuzzleController';
import { useServerTimer } from '@/hooks/useServerTime';
import { HostPresenterLayout } from '@/layouts/host-presenter';
import { kmClient } from '@/services/km-client';
import { puzzleActions } from '@/state/actions/puzzle-actions';
import type { Difficulty } from '@/state/schemas/puzzle-schema';
import { playerProgressStore } from '@/state/stores/player-progress-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { cn } from '@/utils/cn';
import { PuzzleResultsView } from '@/views/puzzle-results-view';
import { useSnapshot } from '@kokimoki/app';
import { useKmModal } from '@kokimoki/shared';
import {
	Check,
	CirclePlay,
	CircleStop,
	Clock,
	HelpCircle,
	SkipForward,
	SquareArrowOutUpRight,
	Trophy,
	Users
} from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

function App({ clientContext }: ModeGuardProps<'host'>) {
	const { t } = useTranslation();
	useMeta();
	useGlobalController();
	usePuzzleController();

	const { openDrawer } = useKmModal();
	const serverTime = useServerTimer();
	const puzzleState = useSnapshot(puzzleStore.proxy);
	const progressState = useSnapshot(playerProgressStore.proxy);
	const { players, onlinePlayersCount } = usePlayersWithOnlineStatus();
	const [buttonCooldown, setButtonCooldown] = React.useState(true);

	// Button cooldown to prevent accidentally spamming
	React.useEffect(() => {
		setButtonCooldown(true);
		const timeout = setTimeout(() => {
			setButtonCooldown(false);
		}, 1000);

		return () => clearTimeout(timeout);
	}, [puzzleState.phase]);

	const playerLink = kmClient.generateLink(clientContext.playerCode, {
		mode: 'player'
	});

	const presenterLink = kmClient.generateLink(clientContext.presenterCode, {
		mode: 'presenter',
		playerCode: clientContext.playerCode
	});

	const currentPuzzle = puzzleState.puzzleIds[puzzleState.currentRoundIndex]
		? PUZZLES_BY_ID[puzzleState.puzzleIds[puzzleState.currentRoundIndex]]
		: null;

	// Calculate remaining time
	const elapsed = serverTime - puzzleState.roundStartTimestamp;
	const remainingMs = Math.max(0, puzzleState.roundDurationMs - elapsed);

	// Get player progress
	const playerProgressList = players.map((player) => ({
		...player,
		progress: progressState.progress[player.id]
	}));

	const completedCount = playerProgressList.filter(
		(p) => p.progress?.currentRoundCompleted
	).length;

	const difficultyOptions: { value: Difficulty; descKey: string }[] = [
		{ value: 'easy', descKey: 'ui:difficultyEasyDesc' },
		{ value: 'medium', descKey: 'ui:difficultyMediumDesc' },
		{ value: 'hard', descKey: 'ui:difficultyHardDesc' }
	];

	const handleRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value) || 1;
		puzzleActions.setTotalRounds(Math.max(1, Math.min(15, value)));
	};

	const handleOpenHowToPlay = () => {
		openDrawer({
			title: t('ui:howToPlay'),
			showHandle: true,
			content: (
				<div className="prose prose-invert max-w-none">
					<Markdown>{t('ui:howToPlayMd')}</Markdown>
				</div>
			)
		});
	};

	const isSelected = (diff: Difficulty) =>
		puzzleState.selectedDifficulties.includes(diff);

	return (
		<HostPresenterLayout.Root>
			<HostPresenterLayout.Header />
			<HostPresenterLayout.Main>
				{puzzleState.phase === 'lobby' && (
					<div className="space-y-6">
						{/* Game Configuration */}
						<div className="rounded-xl bg-zinc-800 p-6">
							<div className="mb-4 flex items-center justify-between">
								<h2 className="text-xl font-bold text-white">
									{t('ui:gameSettings')}
								</h2>
								<button
									type="button"
									onClick={handleOpenHowToPlay}
									className="flex items-center gap-2 rounded-lg bg-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-600"
								>
									<HelpCircle className="h-4 w-4" />
									{t('ui:howToPlay')}
								</button>
							</div>

							<div className="grid gap-6 md:grid-cols-2">
								{/* Difficulty selector - multi-select */}
								<div>
									<label className="mb-2 block text-sm text-zinc-400">
										{t('ui:selectDifficulty')}
									</label>
									<div className="flex flex-col gap-2">
										{difficultyOptions.map(({ value: diff, descKey }) => (
											<button
												key={diff}
												onClick={() => puzzleActions.toggleDifficulty(diff)}
												className={cn(
													'flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors',
													isSelected(diff)
														? 'bg-teal-500 text-white'
														: 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
												)}
											>
												<div
													className={cn(
														'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
														isSelected(diff)
															? 'border-white bg-white'
															: 'border-zinc-500'
													)}
												>
													{isSelected(diff) && (
														<Check className="h-3 w-3 text-teal-500" />
													)}
												</div>
												<div className="flex-1">
													<div className="font-medium">
														{t(
															`ui:difficulty${diff.charAt(0).toUpperCase() + diff.slice(1)}`
														)}
													</div>
													<div
														className={cn(
															'text-sm',
															isSelected(diff)
																? 'text-teal-100'
																: 'text-zinc-500'
														)}
													>
														{t(descKey)}
													</div>
												</div>
											</button>
										))}
									</div>
								</div>

								{/* Rounds input */}
								<div>
									<label className="mb-2 block text-sm text-zinc-400">
										{t('ui:selectRounds')}
									</label>
									<input
										type="number"
										min={1}
										max={15}
										value={puzzleState.totalRounds}
										onChange={handleRoundsChange}
										className="w-24 rounded-lg bg-zinc-700 px-4 py-3 text-lg font-medium text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
									/>
								</div>
							</div>
						</div>

						{/* Players waiting */}
						<div className="rounded-xl bg-zinc-800 p-6">
							<div className="flex items-center gap-2 text-white">
								<Users className="h-5 w-5" />
								<span className="text-lg font-semibold">
									{onlinePlayersCount} {t('ui:players')}
								</span>
							</div>

							{players.length > 0 && (
								<ul className="mt-4 space-y-2">
									{players.map((player) => (
										<li
											key={player.id}
											className="flex items-center justify-between rounded-lg bg-zinc-700 px-4 py-2"
										>
											<span className="text-white">{player.name}</span>
											<span
												className={cn(
													'text-xs',
													player.isOnline ? 'text-emerald-400' : 'text-zinc-500'
												)}
											>
												{player.isOnline ? t('ui:online') : t('ui:offline')}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				)}

				{(puzzleState.phase === 'playing' ||
					puzzleState.phase === 'between-rounds') && (
					<div className="space-y-6">
						{/* Current round info */}
						<div className="flex items-center justify-between">
							<div className="text-lg font-semibold text-white">
								{t('ui:roundCounter', {
									current: puzzleState.currentRoundIndex + 1,
									total: puzzleState.totalRounds
								})}
							</div>
							{puzzleState.phase === 'playing' && (
								<PuzzleTimer remainingMs={remainingMs} />
							)}
							{puzzleState.phase === 'between-rounds' && (
								<div className="rounded-xl bg-teal-500 px-6 py-3 text-white">
									<Clock className="mr-2 inline h-5 w-5" />
									{t('ui:nextRoundSoon')}
								</div>
							)}
						</div>

						{/* Current puzzle preview */}
						{currentPuzzle && (
							<div className="flex justify-center">
								<PuzzleBoard
									boardShape={currentPuzzle.boardShape}
									pieces={currentPuzzle.pieces}
									placedPieces={{}}
									cellSize={32}
								/>
							</div>
						)}

						{/* Player progress */}
						<div className="rounded-xl bg-zinc-800 p-4">
							<h3 className="mb-3 flex items-center gap-2 text-white">
								<Trophy className="h-5 w-5 text-yellow-400" />
								{t('ui:playerProgress')} ({completedCount}/{players.length})
							</h3>

							<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
								{playerProgressList.map((player) => (
									<div
										key={player.id}
										className={cn(
											'flex items-center justify-between rounded-lg px-3 py-2',
											player.progress?.currentRoundCompleted
												? 'border border-emerald-500/50 bg-emerald-500/20'
												: 'bg-zinc-700'
										)}
									>
										<span className="text-white">{player.name}</span>
										<div className="flex items-center gap-2">
											{player.progress?.currentRoundCompleted && (
												<Check className="h-4 w-4 text-emerald-400" />
											)}
											<span className="text-sm text-zinc-400">
												{player.progress?.totalScore || 0} pts
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{puzzleState.phase === 'ended' && <PuzzleResultsView />}
			</HostPresenterLayout.Main>

			<HostPresenterLayout.Footer>
				<div className="inline-flex flex-wrap gap-4">
					{puzzleState.phase === 'lobby' && (
						<button
							type="button"
							className="km-btn-primary"
							onClick={puzzleActions.startGame}
							disabled={buttonCooldown || onlinePlayersCount === 0}
						>
							<CirclePlay className="size-5" />
							{t('ui:startButton')}
						</button>
					)}

					{(puzzleState.phase === 'playing' ||
						puzzleState.phase === 'between-rounds') && (
						<>
							<button
								type="button"
								className="km-btn-secondary"
								onClick={puzzleActions.skipRound}
								disabled={buttonCooldown}
							>
								<SkipForward className="size-5" />
								{t('ui:skipRound')}
							</button>
							<button
								type="button"
								className="km-btn-error"
								onClick={puzzleActions.endGame}
								disabled={buttonCooldown}
							>
								<CircleStop className="size-5" />
								{t('ui:stopButton')}
							</button>
						</>
					)}

					{puzzleState.phase === 'ended' && (
						<button
							type="button"
							className="km-btn-primary"
							onClick={puzzleActions.resetToLobby}
						>
							{t('ui:playAgain')}
						</button>
					)}

					<a
						href={playerLink}
						target="_blank"
						rel="noreferrer"
						className="km-btn-secondary"
					>
						{t('ui:playerLinkLabel')}
						<SquareArrowOutUpRight className="size-5" />
					</a>

					<a
						href={presenterLink}
						target="_blank"
						rel="noreferrer"
						className="km-btn-secondary"
					>
						{t('ui:presenterLinkLabel')}
						<SquareArrowOutUpRight className="size-5" />
					</a>
				</div>
			</HostPresenterLayout.Footer>
		</HostPresenterLayout.Root>
	);
}

export default withKmProviders(withModeGuard(App, 'host'));
