const sseHeaders = new Map();
sseHeaders.set('Cache-Control', 'no-cache');
sseHeaders.set('Connection', 'keep-alive');
sseHeaders.set('Content-Type', 'text/event-stream');

export default sseHeaders;