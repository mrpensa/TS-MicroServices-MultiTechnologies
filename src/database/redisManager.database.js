const { Redis } = require('ioredis');

class RedisManager {

	constructor(traceId) {

		if (!RedisManager.instance) { RedisManager.instance = this; }

		RedisManager.instance.traceId = traceId ?? crypto.randomUUID();;

		return RedisManager.instance;
	}
	async setConnection(connectionParams){

		this.connectionParams = {

			host: connectionParams.host,
			port: connectionParams.port,
			password: connectionParams.password,
			connectionName: connectionParams.connectionName?.replace(/\s+/g, ''),
			commandTimeout: 1200, //[ms].
			lazyConnect: true,
		};
	
		if( connectionParams.useTls ){
			this.connectionParams.tls = { checkServerIdentity: () => undefined };
		}
	}
	start() {

		this.client = new Redis(this.connectionParams);
		this.setEmitter();
	}
	async connect(){

		return await this.set('start', 'true', 1);
	}
	setEmitter(){

		this.client.on('error', (err) => {
			console.log(`Redis ${err}.`, this.traceId);
		});
		this.client.on('connect', () => {
			console.log('Se estableció la conexión con Redis.', this.traceId);
		});
		this.client.on('ready', () => {
			console.log('Cliente Redis conectado y listo para usar comandos.', this.traceId);
		});
		this.client.on('close', () => {
			console.log('Se perdió la conexión con Redis.', this.traceId);
			this.client.disconnect(false);
		});
		this.client.on('reconnecting', () => {
			console.log('Reconnecting Redis Client', this.traceId);
			this.start();
		});
	}
	async ping() {

		// Deberías obtener 'PONG' si la conexión es exitosa.
		return await this.client.ping();
	}
	handlerResponseError(action, error){

		console.log(`Error Redis ${action}: ${error.message}.`, this.traceId);
		return false;
	}
	async set(key, value, expires = 0) {

		try {

			if( !this.client ) return undefined;

			const result = await this.client.set(key, value);

			if( expires > 0 ){
				await this.client.expire(key, expires);
			}

			return result;
		} catch (error) {

			return this.handlerResponseError('SET', error);
		}
	}
	async get(key) {

		try {

			if( !this.client ) return null;

			return await this.client.get(key);
		} catch (error) {

			return this.handlerResponseError('GET', error);
		}
	}
	async delete(key) {

		try {

			if( !this.client ) return 0;

			return await this.client.del(key);
		} catch (error) {

			return this.handlerResponseError('DELETE', error);
		}
	}
}

module.exports = RedisManager;