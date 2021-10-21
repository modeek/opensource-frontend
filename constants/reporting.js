import axios from 'axios';

const http = axios.create({
	baseURL: 'https://reports.myflow.app',

	timeout: 180000,
	headers: {
		workflowToken: '',
	},
});

const getReport = (endpoint, body) => {
	return http.post(endpoint, body).then((res) => {
		if (res.data.success && res.data.URL) {
			return axios.get(res.data.URL).then((dataRes) => {
				if (dataRes.data.success) {
					return dataRes.data;
				}
			});
		}
	});
};

export default getReport;
