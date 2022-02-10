export type IPaymentRequest = {
	amount: string;
	intent: 'sale';
};

export type ICreatePaymentResponse = {
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
};

export type ExecutePaymentResponse = {
	paymentID: string;
	createTime: string;
	updateTime: string;
	trxID: string;
	transactionStatus: string;
	amount: string;
	currency: string;
	intent: string;
	merchantInvoiceNumber: string;
};

export type BkashComponentConfig = {
	amount: string | number;
	createPaymentURL: string;
	executePaymentURL: string;
	additionalHeaders?: Record<string, string>;
	bkashScriptURL: string;
};

export type BkashSuccessFunction = (data: ExecutePaymentResponse) => void;
