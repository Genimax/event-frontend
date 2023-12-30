import style from './style.module.scss';
import React from 'react';

export function FormLoader({ loading }: { loading: boolean }) {
	return (
		loading && (
			<div className={style.loaderContainer}>
				<span className={style.loader}></span>
			</div>
		)
	);
}
