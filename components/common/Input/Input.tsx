import React from 'react';
import style from './style.module.scss';

export default function Input({
	title = '',
	setValue,
	value = '',
	placeholder = '',
	type = 'text',
	autoFocus = false,
}: {
	title?: string;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	value: string | undefined;
	type?: string;
	placeholder?: string | undefined;
	autoFocus?: boolean;
}) {
	return (
		<div className={style.inputContainer}>
			{title && <p className={style.title}>{title}</p>}
			<input
				className={style.input}
				placeholder={placeholder}
				type={type}
				value={value}
				autoFocus={autoFocus}
				onInput={event => {
					const input = event.target as HTMLInputElement;
					setValue(input.value);
				}}
			/>
		</div>
	);
}
