import { Puzzle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

/**
 * Example view demonstrating how to display lobby content before game starts.
 * Modify or replace with your own implementation.
 */
export function GameLobbyView() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-6">
			{/* Animated puzzle icon */}
			<div className="animate-float flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/25">
				<Puzzle className="h-10 w-10 text-white" />
			</div>

			<article className="prose prose-invert text-center">
				<Markdown>{t('ui:gameLobbyMd')}</Markdown>
			</article>

			{/* Pulsing dot indicator */}
			<div className="flex items-center gap-2 text-sm text-zinc-400">
				<span className="relative flex h-2.5 w-2.5">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
					<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal-500"></span>
				</span>
				{t('ui:loading')}
			</div>
		</div>
	);
}
