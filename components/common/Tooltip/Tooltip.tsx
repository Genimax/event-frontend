import React, { useEffect, useRef, useState } from 'react';

import styles from './style.module.scss';
import { TooltipProps } from '@/components/common/Tooltip/types';

const Tooltip: React.FC<TooltipProps> = ({
	message,
	isVisible,
	children,
	color,
}) => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const shouldReactToHover = isVisible === undefined;

	useEffect(() => {
		setIsTooltipVisible(isVisible ?? false);
	}, [isVisible]);

	const handleMouseEnter = () => {
		if (shouldReactToHover) {
			setIsTooltipVisible(true);
		}
	};

	const handleMouseLeave = () => {
		if (shouldReactToHover) {
			setIsTooltipVisible(false);
		}
	};

	const handleClick = () => {
		if (isVisible === true) {
			setIsTooltipVisible(false);
		}
	};

	return (
		<div
			className={styles.tooltipContainer}
			onMouseEnter={shouldReactToHover ? handleMouseEnter : undefined}
			onMouseLeave={shouldReactToHover ? handleMouseLeave : undefined}
		>
			{children}
			<div
				style={color ? { color: color } : {}}
				ref={tooltipRef}
				className={`${styles.tooltip} ${
					isTooltipVisible ? styles.visible : ''
				}`}
				onClick={isVisible ? handleClick : undefined}
			>
				{message}
				<span className={styles.arrow}></span>
			</div>
		</div>
	);
};

export default Tooltip;
