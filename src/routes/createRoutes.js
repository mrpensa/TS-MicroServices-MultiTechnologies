class CreateRoute {
    constructor(basePath) {
        this.router = require('express').Router();
        this.basePath = basePath;
    }

    addRoutes(routes) {
        routes.forEach(route => {
            const { path, method, middlewares, controller } = route;
            this.router[method](path, middlewares, controller);
        });
        return this.router;
    }
}

module.exports = CreateRoute;
