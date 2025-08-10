import * as fuzz from './fuzz.ts';

export function serve() {
    Deno.serve(async (request: Request) => {
        const method = request.method;
        const url = new URL(request.url);
        const path = url.pathname;
        if (method == "GET" && path === "/") {
            return new Response("HELLO", { headers: { "content-type": "text/html; charset=UTF-8" } });
        }
        try {
            if (method === "GET" && path.startsWith("/fuzz")) {
                const s = await fuzz.fuzz();
                return createSuccess(s);
            }
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                console.log(e.message);
                return createError("Internal server exception occurred (please check logs).", 500);
            }
            return createError("Internal server exception occurred.", 500);
        }
        return new Response(null, { status: 404 });
    });
}

function createError(error: string, status: number): Response {
    const json = JSON.stringify({ success: false, error, status }, null, 4);
    return new Response(json, { headers: { "content-type": "application/json; charset=UTF-8" }, status });
}

function createSuccess(msg: string): Response {
    const json = JSON.stringify({ success: true, error: "", status: 200, msg }, null, 4);
    return new Response(json, { headers: { "content-type": "application/json; charset=UTF-8" } });
}