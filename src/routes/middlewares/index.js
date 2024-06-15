const validateDataClient = require('./validateDataClient.middlewares');
const searchData = require('./searchData.middlewares');

module.exports = {
	...validateDataClient,
	...searchData
};
