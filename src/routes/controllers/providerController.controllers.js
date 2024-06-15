const providerController = async function(req, res){
	
	res.status(200).send(`${JSON.stringify(req.responseProvider)}`);
};

module.exports = {
	providerController
};
