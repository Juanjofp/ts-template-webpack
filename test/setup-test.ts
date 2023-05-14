// eslint-disable-next-line @typescript-eslint/no-var-requires
const XMLHttpRequest = require('xhr2');

global.XMLHttpRequest = XMLHttpRequest;

const port = 8080 + Number(process.env.JEST_WORKER_ID);

process.env.HTTP_PORT = port + '';

export {};
