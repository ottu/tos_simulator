import vibe.d;
import vibe.core.log;

import tos.config;
import std.stdio;

Config config;

shared static this()
{
    config = load_config;

    auto router = new URLRouter;
    router.get("/", &_index);
    router.get("*", serveStaticFiles("public/"));

	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = ["::1", "0.0.0.0"];

    auto logger = cast(shared)(new FileLogger("access.log"));
    registerLogger(logger);

	listenHTTP(settings, router);

	logInfo("Please open http://127.0.0.1:8080/ in your browser.");
}

void _index(HTTPServerRequest req, HTTPServerResponse res)
{
    Gem[] gems = config.gems;
    res.render!("index.dt", gems);
}
