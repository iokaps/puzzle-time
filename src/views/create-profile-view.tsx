import { localPlayerActions } from '@/state/actions/local-player-actions';
import { Puzzle, UserPlus } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

/**
 * Example view demonstrating how to create a player profile form.
 * Shows usage of local player actions for registration.
 * Modify or replace with your own implementation.
 */
export function CreateProfileView() {
	const { t } = useTranslation();
	const [name, setName] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const trimmedName = name.trim();
		if (!trimmedName) return;

		setIsLoading(true);
		try {
			await localPlayerActions.setPlayerName(trimmedName);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="mx-auto flex w-full max-w-96 flex-1 flex-col items-center justify-center space-y-10">
			{/* Animated icon */}
			<div className="animate-float flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 shadow-lg shadow-teal-500/25">
				<Puzzle className="h-10 w-10 text-white" />
			</div>

			<article className="prose prose-invert text-center">
				<Markdown>{t('ui:createProfileMd')}</Markdown>
			</article>

			<form onSubmit={handleSubmit} className="grid w-full gap-4">
				<input
					type="text"
					placeholder={t('ui:playerNamePlaceholder')}
					value={name}
					onChange={(e) => setName(e.target.value)}
					disabled={isLoading}
					autoFocus
					maxLength={50}
					className="km-input text-center text-lg"
				/>

				<button
					type="submit"
					className="km-btn-primary w-full text-lg"
					disabled={!name.trim() || isLoading}
				>
					{isLoading ? (
						<>
							<span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
							{t('ui:loading')}
						</>
					) : (
						<>
							<UserPlus className="h-5 w-5" />
							{t('ui:playerNameButton')}
						</>
					)}
				</button>
			</form>
		</div>
	);
}
