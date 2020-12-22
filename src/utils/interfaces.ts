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

export interface IProps {
	btnText: string;
	amount: string | number;
	createPaymentURL: string;
	executePaymentURL: string;
	callBack(): unknown;
	additionalHeaders: Record<string, string>;
}
