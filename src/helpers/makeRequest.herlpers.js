const axios = require('axios');
const https = require('https');
require('dotenv').config();

const makeRequest = async (method, url, body, headers) => {
    try {
        // Ignorar errores de certificado SSL (NO USAR EN PRODUCCIÓN)
        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        let response;

        switch (method.toUpperCase()) {
            case 'GET':
                response = await axios.get(url, {
                    headers: headers,
                    httpsAgent: agent
                });
                break;
            case 'POST':
                response = await axios.post(url, body, {
                    headers: headers,
                    httpsAgent: agent
                });
                break;
            case 'PUT':
                response = await axios.put(url, body, {
                    headers: headers,
                    httpsAgent: agent
                });
                break;
            case 'DELETE':
                response = await axios.delete(url, {
                    headers: headers,
                    httpsAgent: agent
                });
                break;
            default:
                throw new Error('Método HTTP no válido');
        }

        return response.data;
    } catch (error) {
        return error;
    }
};

module.exports = {
	makeRequest
};
