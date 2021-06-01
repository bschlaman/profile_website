const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

// global constants
const httpPort = 3001;
const httpsPort = 3002;
const name = "SERVER";
const logPath = "logs/output.log";
const staticAssetsPath = "/usr/src/assets/static";
const configPath = "config.json";
let options;
let logostring;

// helper functions
const logStream = fs.createWriteStream(path.join(__dirname, logPath), {flags : 'a'});
const logfile = async function(...d) {
	let time = new Date().toLocaleString();
	for (let i = 0 ; i < d.length ; i++){
		logStream.write(util.format(`[${time}] `));
		logStream.write(util.format(d[i]) + '\n');
		process.stdout.write(util.format(`[${time}] `));
		process.stdout.write(util.format(d[i]) + '\n');
	}
};


function initConfig() {
	let config = path.join(__dirname, configPath);
	let parsed = JSON.parse(fs.readFileSync(config, 'UTF-8'));
	// certs
	let keyfile = parsed.key;
	let certfile = parsed.cert;
	options = {
		key: fs.readFileSync(keyfile),
		cert: fs.readFileSync(certfile),
	};
	// logostring
	logostring = new Buffer(parsed.logostring64, "base64").toString();
	logfile("Successfully loaded config");
}

function initDB(){
	mongoose.connect("mongodb://mongodb_running/test");
	const db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error:"));
	db.once("open", function() {
	  logfile("Successfully connected to mongodb");
	});
}

const BlogPost = mongoose.model("BlogPost", new mongoose.Schema({
	title:   { type: String, required: true, unique: true },
	date:    { type: String, required: true },
	content: { type: String, required: true },
}));

const app = express();
const httpApp = express();

app.on("error", (err) => {
	app.close();
	logfile("ERROR: called from app.on(error)");
	logfile(err.stacktrace);
});

// express settings
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", staticAssetsPath);
// init middleware
app.use(express.urlencoded({extended: false}));
app.use((req, res, next) => {
	const { method, url } = req;
	const { headers } = req;
	let reqDetails = {
		"method": method,
		"url": url,
		"address": req.connection.remoteAddress,
	};
	logfile(JSON.stringify(reqDetails));
	next();
});
app.get("/favicon.png", (req, res) => {
	res.sendFile(path.join(staticAssetsPath, "favicon.png"));
});
app.get("/favicon-32.png", (req, res) => {
	res.sendFile(path.join(staticAssetsPath, "favicon-32.png"));
});
app.get("/resume", (req, res) => {
	res.sendFile("/usr/src/assets/Brendan_Schlaman_Resume_2021.pdf");
});
app.use(express.static(path.join(staticAssetsPath, "main")));
app.use("/web_templates", express.static(path.join(staticAssetsPath, "web_templates")));
app.use("/blog", express.static(path.join(staticAssetsPath, "blog")));
app.get("/zkp", (req, res) => {
	res.sendFile(path.join(staticAssetsPath, "blog", "zkp.html"));
});
app.get("/chess_programming", (req, res) => {
	res.sendFile(path.join(staticAssetsPath, "blog", "chess_programming.html"));
});
app.use("/coming_soon", express.static(path.join(staticAssetsPath, "coming_soon")));
app.use("/chess", express.static(path.join(staticAssetsPath, "chess")));
app.use("/bc", express.static(path.join(staticAssetsPath, "bc")));

app.post("/contact", (req, res) => {
	logfile(JSON.stringify(req.body));
	res.send("Thank you for your message.  I will respond shortly.");
});


const startTime = new Date().toLocaleString();
logfile(`#####   Starting ${name} at ${startTime}`);

logfile(`Loading config from ${path.join(__dirname, configPath)}...`);
initConfig();
logfile('\n' + logostring);

logfile("Starting https server...");
const server = https.createServer(options, app).listen(httpsPort, () => {
	logfile(`Successfully started server on ${server.address().address}:${server.address().port}`);
});
// simple http redirect server
logfile("Starting http redirect server...");
const httpServer = httpApp.all("*", (req, res) => {
	res.redirect("https://" + req.headers.host + req.url);
}).listen(httpPort, () => {
	logfile("Successfully started HTTP redirect server");
});

// logfile("Connecting to mongodb...");
// initDB();
