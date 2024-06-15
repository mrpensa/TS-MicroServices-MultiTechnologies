const { makeRequest } = require('../../helpers/makeRequest.herlpers');
require('dotenv').config();

const searchData = async (req, res, next) => {

	try {

        const token = req.tokenProvider;
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Token ${token}`};

        const info = await makeRequest('GET', `${process.env.URL_DATA}`, body = null, headers)
    
        if(!info) return res.status(400).json({ error: 'No se pudo obtener informacion' });

        req.responseProvider = info;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = {
	searchData 
};
