const RedisManager = require('../../database/redisManager.database');
const { makeRequest } = require('../../helpers/makeRequest.herlpers');
require('dotenv').config();

const validateDataClient = async (req, res, next) => {

	try {
        const email  = req.query.emailDestination;

        if(email == null || email.length === 0) return res.status(400).json({ error: 'Es necesario un Email de destino' });

        const redisMemCachedManager = new RedisManager();
        let tokenClient = await redisMemCachedManager.get(`${process.env.CLIENT}`);
       
        if(!tokenClient) {
       
            const headers = { 'Content-Type': 'application/json' };
            const body = {
                "email": `${process.env.EMAIL}`,
                "password": `${process.env.PASSWORD}`
            };
            const setExpiryTime = Math.trunc(Math.random() * 10000);  
            
            const tokenLogin = await makeRequest('POST', `${process.env.URL_LOGIN}`, body, headers);
            
            tokenClient = tokenLogin.token;

            await redisMemCachedManager.set(`${process.env.CLIENT}`, tokenClient, setExpiryTime);
        }

        req.tokenProvider = tokenClient;

        next();

    } catch (error) {
        next(error);
    }
};

module.exports = {
	validateDataClient 
};