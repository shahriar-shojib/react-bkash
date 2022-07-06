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
