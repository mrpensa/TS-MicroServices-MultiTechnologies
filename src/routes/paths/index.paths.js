const { providerController }  = require('../controllers/index');
const Middlewares = require('../middlewares');

module.exports = [
	{
		path:'/test',
		method:'get',
		middlewares:[
			Middlewares.validateDataClient,
			Middlewares.searchData,
		],
		controller: providerController
        
	}
];