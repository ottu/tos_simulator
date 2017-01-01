import vibe.d;
import vibe.core.log;
import vibe.data.json;

import tos.config;
import tos.consts;

import std.stdio;
import std.algorithm;
import std.array;

Config config;

shared static this()
{
    config = load_config;
    writeln(config);

    auto router = new URLRouter;
    router.get("/", &_index);
    router.get("*", serveStaticFiles("public/"));

    router.get("/api/jobs", &_jobs);

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
    Option[] opts = config.options.filter!(a=>!a.hair.isNull).array;
    Protect[] shirts = config.shirts;
    Protect[] pants  = config.pants;
    Protect[] boots  = config.boots;
    Protect[] gloves = config.gloves;
    res.render!("index.dt", Jobs, gems, opts, shirts, pants, boots, gloves);
}

void _jobs(HTTPServerRequest req, HTTPServerResponse res)
{
    Json json = Jobs.serializeToJson();
    res.writeJsonBody(json);
}
