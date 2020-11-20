const fetch = require('node-fetch');

const Auth = () => {
	const api = 'https://api-public.sandbox.pro.coinbase.com';
	const apiURI = 'https://api.pro.coinbase.com';
	const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

	const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

	const getCoinbaseAccounts = () => {
		authedClient.getCoinbaseAccounts(callback);
	};
};

module.exports = Auth;
