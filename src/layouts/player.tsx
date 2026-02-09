import { Logo } from '@/components/logo';
import { cn } from '@/utils/cn';
import * as React from 'react';

interface LayoutProps {
	children?: React.ReactNode;
	className?: string;
}

const PlayerRoot = ({ children, className }: LayoutProps) => (
	<div
		className={cn(
			'bg-dots grid min-h-dvh grid-rows-[auto_1fr_auto] bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950',
			className
		)}
	>
		{children}
	</div>
);

const PlayerHeader = ({ children, className }: LayoutProps) => (
	<header
		className={cn(
			'sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-900/90 shadow-lg shadow-black/20 backdrop-blur-md',
			className
		)}
	>
		<div className="container mx-auto flex items-center justify-between p-4">
			<Logo />
			{children}
		</div>
	</header>
);

const PlayerMain = ({ children, className }: LayoutProps) => (
	<main className={cn('container mx-auto flex flex-col px-4 py-4', className)}>
		{children}
	</main>
);

const PlayerFooter = ({ children, className }: LayoutProps) => (
	<footer
		className={cn(
			'sticky bottom-0 z-10 border-t border-zinc-800/50 bg-zinc-900/90 shadow-[0_-4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md',
			className
		)}
	>
		<div className="container mx-auto flex justify-center p-4">{children}</div>
	</footer>
);

/**
 * Layout components for the `player` mode
 *
 * These compound components can be used to structure the player view
 * and provide a consistent layout across different screens.
 */
export const PlayerLayout = {
	Root: PlayerRoot,
	Header: PlayerHeader,
	Main: PlayerMain,
	Footer: PlayerFooter
};
