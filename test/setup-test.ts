// eslint-disable-next-line @typescript-eslint/no-var-requires
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const port = 8080 + Number(process.env.JEST_WORKER_ID);

process.env.HTTP_PORT = port + '';

export {};
