# React-bKash

![Publish to NPM](https://github.com/shahriar-shojib/React-bKash/workflows/Publish%20to%20NPM%20and%20Github%20Packages/badge.svg)

React component for accepting bkash payments! [painlessly]

---

# How to use

- Run `npm install react-bkash`

- open your react component and add the following code

```jsx
import { useBkash } from 'react-bkash';

export const Checkout = () => {
	const { error, loading, triggerBkash } = useBkash({
		onSuccess: (data) => {
			console.log(data); // this contains data from api response from onExecutePayment
		},
		onClose: () => {
			console.log('Bkash iFrame closed');
		},
		bkashScriptURL: '<BKASH SCRIPT URL PROVIDED TO MERCHANT BY BKASH>', // https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
		amount: 1000,
		onCreatePayment: async (paymentRequest) => {
			// call your API with the payment request here
			return await fetch('<your backend api>/create/', {
				method: 'POST',
				body: JSON.stringify(paymentRequest),
			}).then((res) => res.json());

			// must return the following object:
			// {
			// 	paymentID: string;
			// 	createTime: string;
			// 	orgLogo: string;
			// 	orgName: string;
			// 	transactionStatus: string;
			// 	amount: string;
			// 	currency: string;
			// 	intent: string;
			// 	merchantInvoiceNumber: string;
			// }
		},
		onExecutePayment: async (paymentID) => {
			// call your executePayment API here
			return await fetch('<your backend api>/execute/${paymentID}', {
				method: 'POST',
			}).then((res) => res.json());

			// it doesn't matter what you return here, any errors thrown here will be available on error return value of the useBkash hook
		},
	});
	
	if (loading) {
	    return <h1>loading</h1>;
	}
	
	if (error) {
	    return <h1>{error.message}</h1>;
	}

	return (
		<div>
			<button onClick={triggerBkash}>Pay with bKash</button>
		</div>
	);
};
```

---

# Backend

If you don't have a backend, you can use the following library to create a backend using node.js

[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=shahriar-shojib&repo=bkash-payment-gateway&enable_icons=true)](https://github.com/shahriar-shojib/bkash-payment-gateway)

---

### Contributing

- Please Follow the code style and use the prettier config and eslint config provided in the repository
- Feel free to open `issues` or `pull request` for any issues and bugfixes
- If you want to implement new features or write documentation about existing features feel free to do it as well
- To see a list of missing features or to-do's, please visit the `project` section of the github repository

---

### License

> MIT

> DISCLAIMER: This software comes with absolutely no warranty and is not affiliated with the company **`Bkash`** in any way. Use at your own risk. Author and Contributors are not responsible for any financial damages, outages etc.

### Author

[Shahriar Shojib](https://github.com/shahriar-shojib)

### Contributors

[Sonjoy Datta](https://github.com/sonjoydatta)

[Enamul](https://github.com/Alpha-T30)
