
import headers from '../headers/sse-headers.js';

const consumers = new Map();
setInterval(handleConsumersWithClosedSockets, 3000);

function registerEphemeralForEvent(eventId, expressHttpResponse) {
    prepareMapForEvent(eventId);
    sendRespHeaders(expressHttpResponse);
    consumers.get(eventId).push(createConsumer(expressHttpResponse, true));
}

function notify(event) {
    prepareMapForEvent(event.id);
    const listeners = consumers.get(event.id);
    if(listeners.length === 0) return;
    listeners.forEach(consumer => {
        if(!consumer.isActive) return;
        consumer.write(JSON.stringify(event));
        handleEphemeralConsumer(consumer);
    });
}

function prepareMapForEvent(eventId) {
    if(!consumers.has(eventId)) consumers.set(eventId, []);
}

function createConsumer(expressHttpResponse, isEphemeral) {
    expressHttpResponse.isEphemeral = isEphemeral;
    expressHttpResponse.isActive = true;
    return expressHttpResponse;
}

function sendRespHeaders(res) {
    if(res.headersSent) return;
    res.status(200);
    headers.forEach((value, key) => res.set(key, value));
    res.flushHeaders();
}

function handleEphemeralConsumer(consumer) {
    if(!consumer.isEphemeral) return;
    consumer.isActive = false;
    consumer.end();
}

function handleConsumersWithClosedSockets() {
    consumers.forEach( (subList) => subList
        .filter( consumer => consumer.socket === null || consumer.socket.readyState === 'closed')
        .forEach( inactiveConsumer => subList.pop(inactiveConsumer)));

    const eventIdsWithNoListeners = [];
    consumers.forEach( (value, key) => {
        if(value.length === 0) eventIdsWithNoListeners.push(key);
    });

    eventIdsWithNoListeners.forEach( e => consumers.delete(e));
}

function summary() {
    const summary = [];
    consumers.forEach( (value, key) => summary.push({event_id: key, consumers: value.length}));
    return summary;
}

export default { registerEphemeralForEvent, notify, summary }