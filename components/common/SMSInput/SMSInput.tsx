import styles from './style.module.scss';
import React, {
	useState,
	ChangeEvent,
	useRef,
	useEffect,
	KeyboardEvent,
} from 'react';

interface SMSInputProps {
	codeLength: number;
	code: string;
	setCode: (code: string) => void;
}

const SMSInput: React.FC<SMSInputProps> = ({ codeLength, code, setCode }) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, codeLength);
	}, [codeLength]);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const newCode = Array.from(code);
		newCode[index] = event.target.value;
		setCode(newCode.join(''));

		if (index < codeLength - 1 && event.target.value) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (
		event: KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		if (
			event.key === 'Backspace' &&
			index > 0 &&
			!event.currentTarget.value
		) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const inputs = [];

	for (let i = 0; i < codeLength; i++) {
		inputs.push(
			<input
				key={i}
				ref={el => (inputRefs.current[i] = el)}
				type="number"
				value={code[i] || ''}
				onChange={e => handleChange(e, i)}
				onKeyDown={e => handleKeyDown(e, i)}
				maxLength={1}
				className={styles.input}
			/>
		);
	}

	return <div className={styles.container}>{inputs}</div>;
};

export default SMSInput;
