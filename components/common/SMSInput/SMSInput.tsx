import styles from './style.module.scss';
import React, {
	ChangeEvent,
	useRef,
	useEffect,
	KeyboardEvent,
	useState,
} from 'react';

interface SMSInputProps {
	codeLength: number;
	code: string;
	setCode: (code: string) => void;
	isError?: boolean;
}

const SMSInput: React.FC<SMSInputProps> = ({
	codeLength,
	code,
	setCode,
	isError = false,
}) => {
	const [clearError, setClearError] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, codeLength);
	}, [codeLength]);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		// Если код уже максимальной длины и пытаются ввести новый символ, блокируем это
		if (code.length >= codeLength && event.target.value) {
			return;
		}

		const newCode = Array.from(code);
		newCode[index] = event.target.value;
		setCode(newCode.join(''));

		// Перемещаем фокус на следующий элемент, если это возможно
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
				onInput={() => {
					setClearError(true);
				}}
				style={
					isError && !clearError
						? { backgroundColor: 'rgba(255, 190, 190, 1)' }
						: {}
				}
			/>
		);
	}

	return <div className={styles.container}>{inputs.map(input => input)}</div>;
};

export default SMSInput;
