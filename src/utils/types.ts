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

type BkashComponentWithCustomAPI = {
	amount: string | number;
	bkashScriptURL: string;
	onCreatePayment: (paymentRequest: IPaymentRequest) => Promise<ICreatePaymentResponse>;
	onExecutePayment: (paymentID: string) => Promise<ExecutePaymentResponse>;
	additionalHeaders?: never;
	createPaymentURL?: never;
	executePaymentURL?: never;
};

type BkashComponentWithDefaultAPI = {
	amount: string | number;
	bkashScriptURL: string;
	additionalHeaders?: Record<string, string>;
	createPaymentURL: string;
	executePaymentURL: string;
	onCreatePayment?: never;
	onExecutePayment?: never;
};

export type BkashComponentConfig = BkashComponentWithDefaultAPI | BkashComponentWithCustomAPI;

export const isDefaultConfig = (config: BkashComponentConfig): config is BkashComponentWithDefaultAPI => {
	return (config as BkashComponentWithDefaultAPI).createPaymentURL !== undefined;
};

export type BkashSuccessFunction = (data: ExecutePaymentResponse) => void;
