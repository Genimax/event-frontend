import React from 'react';
import style from './style.module.scss';

export default function Input({
	title = '',
	setValue,
	value = '',
	placeholder = '',
	type = 'text',
	autoFocus = false,
	required = false,
	onFocus = () => {},
	onBlur = () => {},
	onInput = () => {},
	isError = false,
}: {
	title?: string;
	setValue: React.Dispatch<React.SetStateAction<any>>;
	value: string;
	type?: string;
	placeholder?: string;
	autoFocus?: boolean;
	required?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	onInput?: () => void;
	isError?: boolean;
}) {
	return (
		<div
			className={`${style.inputContainer} ${isError ? style.error : ''}`}
		>
			{title && <p className={style.title}>{title}</p>}
			<input
				onFocus={onFocus}
				onBlur={onBlur}
				className={style.input}
				placeholder={placeholder}
				type={type}
				value={value}
				autoFocus={autoFocus}
				onInput={event => {
					const input = event.target as HTMLInputElement;
					setValue(input.value);
					onInput();
				}}
				required={required}
			/>
		</div>
	);
}
