require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fetch = require('node-fetch');
const { uuid } = require('uuidv4');
const CoinbasePro = require('coinbase-pro');
const crypto = require('crypto');

const Auth = require('./models/Auth');
const { create } = require('domain');
/* MIDDLEWARE */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	session({
		secret            : Buffer.from(uuid()).toString('base64'),
		resave            : true,
		saveUninitialized : false,
		cookie            : {
			maxAge : 86400000
		}
	})
);

const api = 'https://api-public.sandbox.pro.coinbase.com';
const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

/**
 * CB-ACCESS-KEY The api key as a string.
CB-ACCESS-SIGN The base64-encoded signature (see Signing a Message).
CB-ACCESS-TIMESTAMP A timestamp for your request.
CB-ACCESS-PASSPHRASE The passphrase you specified when creating the API key.
All request bodies should have content type application/json and be valid JSON.


 */
const createRequest = async (endpoint, method = 'GET', data = null) => {
	const body = data ? JSON.stringify(data) : null;
	const time = await getTime();
	const signature = generateSignature(endpoint, method, time, body);
	const options = {
		headers : {
			'CB-ACCESS-KEY'        : process.env.CLIENT_ID,
			'CB-ACCESS-SIGN'       : signature,
			'CB-ACCESS-TIMESTAMP'  : time,
			'CB-ACCESS-PASSPHRASE' : process.env.PASSPHRASE,
			'CONTENT-TYPE'         : 'application/json'
		},
		method  : method,
		body    : body
	};

	return await fetch(`${apiURI}/${endpoint}`, options).then((r) => r.json()).then((res) => {
		console.log(res);
		return res;
	});
};

const generateSignature = (endpoint, method, timestamp, body) => {
	const secret = process.env.CLIENT_SECRET;

	const requestPath = endpoint;

	// const body = JSON.stringify({
	// 	price      : '1.0',
	// 	size       : '1.0',
	// 	side       : 'buy',
	// 	product_id : 'BTC-USD'
	// });

	// create the prehash string by concatenating required parts
	let prehash = timestamp + method + requestPath;
	if (body) {
		prehash = prehash + body;
	}

	// decode the base64 secret
	const key = Buffer(secret, 'base64');

	// create a sha256 hmac with the secret
	const hmac = crypto.createHmac('sha256', key);

	// sign the require message with the hmac
	// and finally base64 encode the result
	return hmac.update(prehash).digest('base64');
};

getTime = async () => {
	return await fetch(`${sandboxURI}/time`, {
		method : 'GET'
	})
		.then((r) => r.json())
		.then((res) => {
			return res.epoch;
		});
};

const getCoinbaseAccounts = async () => {
	createRequest('/accounts', 'GET');
};

getCoinbaseAccounts();
