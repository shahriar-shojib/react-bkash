# React-bKash

![Publish to NPM](https://github.com/shahriar-shojib/React-bKash/workflows/Publish%20to%20NPM%20and%20Github%20Packages/badge.svg)

React component for accepting bkash payments! [painlessly]

---

# How to use

- Run `npm install react-bkash`

- open your react component and add the following code `TypeScript`

```tsx
import React, { useCallback, CSSProperties, FC } from 'react';
import { BkashButton, BkashComponentConfig, BkashSuccessFunction } from 'react-bkash';

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

export const Example: FC = () => {
 const config: BkashComponentConfig = {
  amount: 100, //can be string as well, max 2 digit decimal point
  bkashScriptURL: '<bkash script url provided to merchant by bkash>', //https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
  createPaymentURL: '<your backend api url for creating payment>',
  executePaymentURL: '<your backend api url for executing payment>',
  additionalHeaders: {}, // if you need to send any authorization headers to backend
 };

 const onSuccess: BkashSuccessFunction = useCallback((data) => {
  console.log(data.amount);
  console.log(data.createTime);
  console.log(data.merchantInvoiceNumber);
  console.log(data.transactionStatus);
  console.log(data.trxID);
 }, []);

 const onClose = useCallback(() => {
  console.log('Bkash iFrame closed');
 }, []);

 return (
  <BkashButton
   config={config}
   onClose={onClose}
   onSuccess={onSuccess}
   loader={<p>loading...</p>} //optional
   renderError={(error) => <p>{error.message}</p>} //optional
   debug={true}>
   {/* This is the button that will be rendered on your component */}
   <button style={buttonStyle}>Pay with Bkash</button>
  </BkashButton>
 );
};
```

# Advance usage

If you have a custom API implementation, you can use the following code to create a payment

```tsx
import React, { useCallback, CSSProperties, FC } from 'react';
import { BkashButton, BkashComponentConfig, BkashSuccessFunction } from 'react-bkash';

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

export const Example: FC = () => {
 const config: BkashComponentConfig = {
  amount: 100, //can be string as well, max 2 digit decimal point
  bkashScriptURL: '<bkash script url provided to merchant by bkash>', // https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
  onCreatePayment: async (request) => {
   // do something with request
   // you have to throw error here if your backend request was not successful
   // must return the following response
   // {
   //  paymentID: string;
   //  createTime: string;
   //  orgLogo: string;
   //  orgName: string;
   //  transactionStatus: string;
   //  amount: string;
   //  currency: string;
   //  intent: string;
   //  merchantInvoiceNumber: string;
   // }
  },
  //paymentID is string and will be needed by your backend API
  onExecutePayment: async (paymentID) => {
   //call the backend api with the paymentID
   //must return the following response
   // you have to throw error here if your backend request was not successful
   // must return the following object
   // {
   //  paymentID: string;
   //  createTime: string;
   //  updateTime: string;
   //  trxID: string;
   //  transactionStatus: string;
   //  amount: string;
   //  currency: string;
   //  intent: string;
   //  merchantInvoiceNumber: string;
   // }
  },
 };

 const onSuccess: BkashSuccessFunction = useCallback((data) => {
  console.log(data.amount);
  console.log(data.createTime);
  console.log(data.merchantInvoiceNumber);
  console.log(data.transactionStatus);
  console.log(data.trxID);
 }, []);

 const onClose = useCallback(() => {
  console.log('Bkash iFrame closed');
 }, []);

 return (
  <BkashButton
   config={config}
   onClose={onClose}
   onSuccess={onSuccess}
   loader={<p>loading...</p>} //optional
   renderError={(error) => <p>{error.message}</p>} //optional
   debug={true}>
   {/* This is the button that will be rendered on your component */}
   <button style={buttonStyle}>Pay with Bkash</button>
  </BkashButton>
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
