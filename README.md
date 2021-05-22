# React-bKash

![Publish to NPM](https://github.com/shahriar-shojib/React-bKash/workflows/Publish%20to%20NPM%20and%20Github%20Packages/badge.svg)

React component for accepting bkash payments! [painlessly]

---

# How to use

-   Run `npm install react-bkash`

-   open your react component and add the following code `TypeScript`

```jsx
import BkashButton, { IComponentConfig, SuccessFunction } from 'react-bkash';
import React, { CSSProperties, FC } from 'react';

const Example: FC = () => {
	const handleSuccess: SuccessFunction = (data) => {
		console.log(data, 'Payment successful');
	};

	const handleClose = () => {
		console.log('bKash popup closed');
	};

	const config: IComponentConfig = {
		amount: '100',
		bkashScriptURL: 'https://sandbox.bka.sh/script.js',
		createPaymentURL: 'https://YOUR-PAYMENT-BACKEND-URL/createPayment',
		executePaymentURL: 'http://YOUR-PAYMENT-BACKEND-URL/executePayment',
		additionalHeaders: {
			Authorization: 'Bearer YOUR_TOKEN',
		},
	};

	return (
		<BkashButton onSuccess={handleSuccess} onClose={handleClose} config={config}>
			<button style={buttonStyle}>Pay with bKash</button>
		</BkashButton>
	);
};

export default Example;

const buttonStyle: CSSProperties = {
	minWidth: '170px',
	height: '38px',
	fontSize: '0.875rem',
	fontWeight: 500,
	lineHeight: 1.5,
	color: '#fff',
	padding: '0.375rem 0.75rem',
	textTransform: 'uppercase',
	backgroundColor: '#e2136e',
	border: '1px solid #e2136e',
};
```

---

### Contributing

-   Please Follow the code style and use the prettier config and eslint config provided in the repository
-   Feel free to open `issues` or `pull request` for any issues and bugfixes
-   If you want to implement new features or write documentation about existing features feel free to do it as well
-   To see a list of missing features or to-do's, please visit the `project` section of the github repository

---

### License

> MIT

> DISCLAIMER: This software comes with absolutely no warranty and is not affiliated with the company **`Bkash`** in any way. Use at your own risk. Author and Contributors are not responsible for any financial damages, outages etc.

### Author

[Shahriar Shojib](https://github.com/shahriar-shojib)

### Contributors

[Sonjoy Datta](https://github.com/sonjoydatta)
