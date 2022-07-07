import { renderHook } from '@testing-library/react-hooks/dom';
import { useBkash } from '../hooks';
import { ICreatePaymentResponse } from '../utils';
//(paymentRequest: IPaymentRequest) => Promise<ICreatePaymentResponse>

const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

jest.setTimeout(30000);
test('useBkash', async () => {
	const onCloseFn = jest.fn();
	const onCreatePayment: () => ICreatePaymentResponse = jest.fn(() => {
		return {
			amount: '',
			createTime: '',
			currency: '',
			intent: '',
			merchantInvoiceNumber: '',
			orgLogo: '',
			orgName: '',
			paymentID: '100',
			transactionStatus: '',
		};
	});
	const onExecutePayment = jest.fn();
	const onSuccess = jest.fn();

	const { result } = renderHook(() =>
		useBkash({
			amount: '100',
			bkashScriptURL: 'https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js',
			onClose: onCloseFn,
			onCreatePayment,
			onExecutePayment,
			onSuccess,
		})
	);

	expect(result.current.loading).toBe(true);
	expect(result.current.error).toBe(null);
});
