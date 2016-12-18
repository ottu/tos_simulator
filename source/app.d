import vibe.d;
import vibe.core.log;

shared static this()
{

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
    res.render!("index.dt");
}
