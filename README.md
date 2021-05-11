# React-bKash

![Publish to NPM](https://github.com/shahriar-shojib/React-bKash/workflows/Publish%20to%20NPM%20and%20Github%20Packages/badge.svg)

React component for accepting bkash payments! [painlessly]

---

# How to use

-   Run `npm install react-bkash`

-   open your react component and add the following code

```jsx
import BkashButton from 'react-bkash';

function myCallBack(success, paymentData) { //success true or false
	if(success){
		/*
		* do something with `paymentData`
		*/
	} else {
		alert('payment failed');
	}
	window.location.reload();
}
<BkashButton
	btnText="Pay With Bkash"
	amount ="100.20"
	createPaymentURL: "https://your-payment-backend-url/createPayment"
	executePaymentURL: "http://your-payment-backend-url/createPayment"
	callBack={myCallBack}
	additionalHeaders={{Authorization: 'Bearer yourServerTokenMaybe?'}}
 />
```

-   Profit

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
