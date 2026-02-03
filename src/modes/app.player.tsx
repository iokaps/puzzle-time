import { PlayerMenu } from '@/components/menu';
import { NameLabel } from '@/components/name-label';
import { withKmProviders } from '@/components/with-km-providers';
import { withModeGuard } from '@/components/with-mode-guard';
import { useGlobalController } from '@/hooks/useGlobalController';
import { useMeta } from '@/hooks/useMeta';
import { usePuzzleController } from '@/hooks/usePuzzleController';
import { PlayerLayout } from '@/layouts/player';
import { kmClient } from '@/services/km-client';
import { playerProgressActions } from '@/state/actions/player-progress-actions';
import { localPlayerStore } from '@/state/stores/local-player-store';
import { puzzleStore } from '@/state/stores/puzzle-store';
import { BetweenRoundsView } from '@/views/between-rounds-view';
import { CreateProfileView } from '@/views/create-profile-view';
import { GameLobbyView } from '@/views/game-lobby-view';
import { PuzzleGameView } from '@/views/puzzle-game-view';
import { PuzzleResultsView } from '@/views/puzzle-results-view';
import { useSnapshot } from '@kokimoki/app';
import * as React from 'react';

const App: React.FC = () => {
	useMeta();
	useGlobalController();
	usePuzzleController();

	const { name } = useSnapshot(localPlayerStore.proxy);
	const { phase } = useSnapshot(puzzleStore.proxy);

	// Initialize player progress when joining
	React.useEffect(() => {
		if (name && phase === 'playing') {
			playerProgressActions.initializePlayer(kmClient.id);
		}
	}, [name, phase]);

	if (!name) {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />
				<PlayerLayout.Main>
					<CreateProfileView />
				</PlayerLayout.Main>
			</PlayerLayout.Root>
		);
	}

	if (phase === 'lobby') {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header>
					<PlayerMenu />
				</PlayerLayout.Header>

				<PlayerLayout.Main>
					<GameLobbyView />
				</PlayerLayout.Main>

				<PlayerLayout.Footer>
					<NameLabel name={name} />
				</PlayerLayout.Footer>
			</PlayerLayout.Root>
		);
	}

	if (phase === 'ended') {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />

				<PlayerLayout.Main>
					<PuzzleResultsView />
				</PlayerLayout.Main>

				<PlayerLayout.Footer>
					<NameLabel name={name} />
				</PlayerLayout.Footer>
			</PlayerLayout.Root>
		);
	}

	if (phase === 'between-rounds') {
		return (
			<PlayerLayout.Root>
				<PlayerLayout.Header />

				<PlayerLayout.Main>
					<BetweenRoundsView />
				</PlayerLayout.Main>

				<PlayerLayout.Footer>
					<NameLabel name={name} />
				</PlayerLayout.Footer>
			</PlayerLayout.Root>
		);
	}

	// Playing
	return (
		<PlayerLayout.Root>
			<PlayerLayout.Header />

			<PlayerLayout.Main>
				<PuzzleGameView />
			</PlayerLayout.Main>

			<PlayerLayout.Footer>
				<NameLabel name={name} />
			</PlayerLayout.Footer>
		</PlayerLayout.Root>
	);
};

export default withKmProviders(withModeGuard(App, 'player'));
