import { ICreatePaymentResponse, IPaymentRequest } from './utils';

export type BkashConfig = {
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

export interface BkashScript {
	init(config: BkashConfig): void;
	create(): BkashScript;
	execute(): BkashScript;
	onSuccess(data: ICreatePaymentResponse): void;
	onError(): void;
}
