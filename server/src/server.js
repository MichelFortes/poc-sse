import cors from 'cors';
import express from 'express';
import consumerHandler from './handlers/consumer-handler.js'

const port = 8080;
const keepConenctioAliveTimeoutInMls = 60000;
const app = express();

function configApp() {
    app.use(express.json());
    app.use(cors());
    app.post('/events', registerEvent);
    app.get('/events/:eventId', registerConsumer);
    app.get('/consumers', getSummary);
    return app.listen(port, onServerInit)
}

function configServer(server) {
    server.keepAliveTimeout = keepConenctioAliveTimeoutInMls;
    server.headersTimeout = keepConenctioAliveTimeoutInMls;
}

function onServerInit() {
    console.log(`Application started on port ${port}`);
}

function registerConsumer(req, res) {
    consumerHandler.registerEphemeralForEvent(req.params.eventId, res);
}

function registerEvent(req, res) {
    consumerHandler.notify(req.body);
    res.status(201).end();
}

function getSummary(_, res) {
    const summary = consumerHandler.summary();
    res.status(summary.length === 0 ? 204 : 200).json(summary);
    res.end();
}

const server = configApp();
configServer(server);