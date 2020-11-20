require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fetch = require('node-fetch');
const { uuid } = require('uuidv4');
const CoinbasePro = require('coinbase-pro');

const Auth = require('./models/Auth');
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

const authedClient = new CoinbasePro.AuthenticatedClient(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.PASSPHRASE,
	sandboxURI
);

const getCoinbaseAccounts = () => {};

app.get('/get-accounts', (req, res) => {
	console.log(process.env);
	authedClient.getCoinbaseAccounts((res) => {
		console.log(res);
	});
});

app.listen(3000, () => {
	console.log('Listening on 3000...');
});
