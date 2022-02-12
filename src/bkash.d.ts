import { ICreatePaymentResponse, IPaymentRequest } from './utils';

type BkashConfig = {
	paymentMode: string;
	paymentRequest: {
		amount: string;
		intent: string;
		currency: string;
	};
	createRequest: (request: IPaymentRequest) => Promise<void>;
	executeRequestOnAuthorization: () => Promise<void>;
	onClose: () => void;
};

interface BkashScript {
	init(config: BkashConfig): void;
	create(): BkashScript;
	execute(): BkashScript;
	onSuccess(data: ICreatePaymentResponse): void;
	onError(): void;
}
declare global {
	interface Window {
		bKash: BkashScript;
	}
}
