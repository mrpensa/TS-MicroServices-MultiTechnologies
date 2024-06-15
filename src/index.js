const express = require("express");
const Routes = require("./routes/paths/index.paths");
const CreateRoute = require("./routes/createRoutes");
require('dotenv').config();
const RedisManager = require('./database/redisManager.database');

const app = express();
const PORT = process.env.PORT || 3000;
const paths = new CreateRoute('').addRoutes(Routes);

app.use(express.json());
app.use(paths);

async function startRedisMemCached() {
    this.redisMemCached = new RedisManager();
    this.redisMemCached.setConnection({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        useTls: JSON.parse(process.env.REDIS_TLS.toLowerCase()),
        connectionName: process.env.APPLICATION_NAME,
    });

    if (JSON.parse(process.env.REDIS_USE.toLowerCase())) {
        this.redisMemCached.start();
        await this.redisMemCached.connect();
    }
}

startRedisMemCached()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Escuchando en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error inicializando Redis:', err);
        process.exit(1); 
    });
