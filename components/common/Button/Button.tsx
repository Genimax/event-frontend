import React from 'react';
import style from './style.module.scss';

export default function Button({
	text,
	type,
	onClick = () => {},
	href,
	disabled = false,
	submit = false,
}: {
	text: string;
	type: 'primary-orange' | 'secondary-orange';
	onClick?: () => void;
	href?: string;
	disabled?: boolean;
	submit?: boolean;
}) {
	const buttonClass = `${style.button} ${style[type]}`;

	return (
		<a className={style.link} href={href}>
			<button
				onClick={onClick}
				className={buttonClass}
				disabled={disabled}
				type={submit ? 'submit' : 'button'}
			>
				{text}
			</button>
		</a>
	);
}
