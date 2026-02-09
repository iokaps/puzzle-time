import { useTranslation } from 'react-i18next';

interface NameLabelProps {
	name: string;
}

/**
 * Example component demonstrating how to display the player's name.
 * Modify or replace with your own implementation.
 */
export function NameLabel({ name }: NameLabelProps) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-2.5">
			<span className="text-zinc-500">{t('ui:playerNameLabel')}</span>
			<span className="rounded-lg bg-zinc-800/60 px-3 py-1 font-bold text-white">
				{name}
			</span>
		</div>
	);
}
