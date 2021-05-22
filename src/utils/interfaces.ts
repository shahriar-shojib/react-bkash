import { ReactNode } from 'react';

export interface IPaymentRequest extends Record<string, string> {
	amount: string;
	intent: 'sale';
}

export interface ICreatePaymentResponse {
	paymentID: string;
	createTime: string;
	orgLogo: string;
	orgName: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
	//need to implement error cases here
}

export interface IExecutePaymentResponse {
	paymentID: string;
	createTime: string;
	updateTime: string;
	trxID: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
}

export interface IComponentConfig {
	amount: string | number;
	createPaymentURL: string;
	executePaymentURL: string;
	additionalHeaders?: Record<string, string>;
	bkashScriptURL: string;
}

export type SuccessFunction = (data: IExecutePaymentResponse) => void;

export interface IProps {
	children: ReactNode;
	onSuccess: SuccessFunction;
	onClose: () => void;
	config: IComponentConfig;
}
