import * as server from './server.ts';

if (import.meta.main) {
    server.serve();
    console.log("Started Deno API server.");
}