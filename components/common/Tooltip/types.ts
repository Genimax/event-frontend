import { ReactNode } from 'react';

export interface TooltipProps {
	message: string;
	isVisible?: boolean;
	children: ReactNode;
	color?: string;
}
