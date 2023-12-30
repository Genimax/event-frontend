import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import { formatPhoneNumber } from '@/utils/validation/isPhoneNumber';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import SMSInput from '@/components/common/SMSInput/SMSInput';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { REGISTRATION_VERIFY_CODE_MUTATION } from '@/graphql/mutations/registration';
import { config } from '@/config/smsCode/config';
import { formatTime } from '@/utils/time';
import { saveNewTokens } from '@/utils/saveNewTokens';
import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';

export default function SMSVerificationForm({
	number,
	region,
	dataSubmit,
	initialTimestampAfterTimeout,
}: {
	number: string;
	region: string;
	dataSubmit: () => void;
	initialTimestampAfterTimeout: number;
}) {
	const router = useRouter();
	const { t } = useTranslation();
	const formattedNumber = formatPhoneNumber(number, region);
	const [code, setCode] = useState('');
	const [verifyPhone, requestVerifyPhoneStatus] = useMutation(
		REGISTRATION_VERIFY_CODE_MUTATION
	);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [sendsData, setSendsData] = useState({
		lastSend: Date.now(),
		nextResendTimestamp: initialTimestampAfterTimeout,
		timeRemaining: initialTimestampAfterTimeout - new Date().getTime(),
		wrongEnters: 0,
	});

	useEffect(() => {
		setSendsData(prev => {
			return {
				...prev,
				nextResendTimestamp: initialTimestampAfterTimeout,
			};
		});
	}, [initialTimestampAfterTimeout]);

	useEffect(() => {
		const updateRemainingTime = () => {
			setSendsData(prev => {
				const now = Date.now();
				const newTimeRemaining = Math.max(
					0,
					prev.nextResendTimestamp - now
				);
				return {
					...prev,
					timeRemaining: newTimeRemaining,
				};
			});
		};

		const timer = setInterval(updateRemainingTime, 1000);
		updateRemainingTime();

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		setButtonDisabled(code.length < config.codeLength);
	}, [code]);

	const throttledHandle = useCallback(
		throttle(async () => {
			try {
				const response = await verifyPhone({
					variables: {
						region: region,
						phoneNumber: formatPhoneNumber(number, region),
						code: code,
					},
				});
				const tokens = response?.data?.verifyPhoneNumber;
				saveNewTokens(tokens);
				router.push('/dashboard');
			} catch (e) {
				console.error(e);
			}
		}, 1000),
		[region, number, code]
	);

	const errorRender = () => {
		if (!requestVerifyPhoneStatus.error) {
			return null;
		}
		let translationKey: string;
		const errorMessage = requestVerifyPhoneStatus?.error?.message;

		if (errorMessage?.includes('-07-')) {
			translationKey = 'expiredCode';
		} else if (errorMessage?.includes('-09-')) {
			translationKey = 'wrongCode';
		} else {
			translationKey = 'codeMainError';
		}

		return <p className={styles.error}>{t(translationKey)}</p>;
	};

	return (
		<form
			className={styles.mainContainer}
			autoComplete="false"
			autoFocus={true}
			onSubmit={e => {
				e.preventDefault();
				throttledHandle();
			}}
		>
			<FormLoader loading={requestVerifyPhoneStatus.loading} />
			<h1 className={styles.title}>{t('numberVerificationTitle')}</h1>
			<div className={styles.subTitleContainer}>
				<p>{t('codeSentToNumber')}:</p>
				<p className={styles.phone}>{formattedNumber}</p>
			</div>
			<div className={styles.smsContainer}>
				<SMSInput
					codeLength={config.codeLength}
					code={code}
					setCode={setCode}
				/>
			</div>
			{errorRender()}
			<a
				className={`${styles.action} ${
					sendsData.timeRemaining > 0 ? styles.nonClick : ''
				}`}
				onClick={() => {
					if (sendsData.timeRemaining === 0) {
						dataSubmit();
					}
				}}
			>
				{t('resendCode')}
				{sendsData.timeRemaining > 0 && (
					<>
						<br />
						<span>
							{t('mayBeAfter')}:{' '}
							{formatTime(sendsData.timeRemaining)}
						</span>
					</>
				)}
			</a>
			<Button
				className={styles.button}
				text={t('typeIn')}
				type={'primary-orange'}
				disabled={buttonDisabled}
				submit={true}
			/>
		</form>
	);
}
