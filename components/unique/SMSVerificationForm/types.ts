import React from 'react';

export interface IForm {
	number: string;
	region: string;
	dataSubmit: () => void;
	submitRequestStatus: any;
	initialTimestampAfterTimeout: number;
	customTitle?: string;
	type?: 'registration' | 'resetPassword';
	setStage: React.Dispatch<any>;
	setCodeUp?: React.Dispatch<any>;
}
