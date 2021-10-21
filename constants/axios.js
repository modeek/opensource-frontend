import axios from 'axios';

const http = axios.create({
	baseURL: 'https://access.myflow.app',

	timeout: 180000,
	headers: {
		workflowToken: '',
	},
});

export default http;
