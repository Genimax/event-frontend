import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import { formatPhoneNumber } from '@/utils/validation/isPhoneNumber';
import { useTranslation } from 'react-i18next';
import Button from '@/components/common/Button/Button';
import SMSInput from '@/components/common/SMSInput/SMSInput';
import React, { useCallback, useEffect, useState } from 'react';
import { config } from '@/config/smsCode/config';
import { formatTime } from '@/utils/time';
import { throttle } from '@/utils/throttle';
import { FormLoader } from '@/components/common/FormLoader/FormLoader';
import { apiPaths } from '@/config/api';
import { IForm } from '@/components/unique/SMSVerificationForm/types';
import ArrowButton from '@/components/common/ArrowButton/ArrowButton';

export default function SMSVerificationForm(props: IForm) {
	const {
		number,
		region,
		dataSubmit,
		initialTimestampAfterTimeout,
		submitRequestStatus,
		customTitle,
		type = 'registration',
		setStage,
		setCodeUp = () => {},
	} = props;

	const router = useRouter();
	const { t } = useTranslation();
	const formattedNumber =
		type === 'registration' ? formatPhoneNumber(number, region) : null;
	const [code, setCode] = useState('');
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [requestVerifyStatus, setRequestVerifyStatus] = useState<any>();
	const [loading, setLoading] = useState(false);
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const throttledHandle = useCallback(
		throttle(async () => {
			try {
				setLoading(true);
				if (type === 'registration') {
					const response = await apiPaths.registration.checkCode(
						code,
						formatPhoneNumber(number, region),
						region
					);
					setRequestVerifyStatus(response.data);
					if (!response.data?.error) {
						router.push('/profile');
					}
				} else if (type === 'resetPassword') {
					const response = await apiPaths.resetPassword.checkCode(
						code,
						submitRequestStatus.id
					);
					setRequestVerifyStatus(response.data);
					if (!response.data.error) {
						setCodeUp(code);
						setStage(2);
					}
				}
			} catch (e) {
				// @ts-ignore
				setRequestVerifyStatus(e?.response?.data);
			}
			setLoading(false);
		}, 1000),
		[region, number, code]
	);

	const errorRender = () => {
		if (
			!requestVerifyStatus?.error &&
			!submitRequestStatus?.error &&
			!requestVerifyStatus?.error
		) {
			return null;
		}
		let translationKey = 'codeMainError';
		const errorMessage = requestVerifyStatus?.code;
		const errorRequest = submitRequestStatus?.error?.code;

		if (errorMessage?.includes('03')) {
			translationKey = 'wrongCode';
		}

		if (errorRequest?.includes('02')) {
			translationKey = 'errorRequestingNewCode';
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
			<ArrowButton
				onClick={() =>
					setStage((prev: number) => {
						return Math.max(prev - 1, 0);
					})
				}
			/>
			<FormLoader loading={loading} />
			<h1 className={styles.title}>
				{customTitle ? customTitle : t('numberVerificationTitle')}
			</h1>

			<div className={styles.subTitleContainer}>
				<p>{t('codeSentTo')}:</p>
				<p className={styles.phone}>{formattedNumber || number}</p>
			</div>

			<div className={styles.smsContainer}>
				<SMSInput
					codeLength={config.codeLength}
					code={code}
					setCode={setCode}
					isError={requestVerifyStatus?.error}
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
