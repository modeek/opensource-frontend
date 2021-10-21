const withPWA = require('next-pwa');

module.exports = withPWA({
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: {
				test: /\.(js|ts)x?$/,
			},
			use: ['@svgr/webpack'],
		});

		return config;
	},
	pwa: {
		disable: process.env.NODE_ENV === 'development',
		register: true,
		scope: '/app',
		sw: 'service-worker.js',
		dest: 'public',
	},
});
