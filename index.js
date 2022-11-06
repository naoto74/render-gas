const https = require("https");
const express = require("express");
const app = express();

const GAS = "https://script.google.com/macros/s/{ID}/exec?";

app.set("port", (process.env.PORT || 3000));
app.get("/", async function(request, response){
	let queryCopy = getQuery(request);

    response.setHeader("Content-Type", queryCopy.mime || "text/html;charset=utf-8");
	let url = GAS.replace("{ID}", queryCopy.id);
	delete queryCopy.mime;
	delete queryCopy.id;

	let queryEntries = Object.entries(queryCopy);
	if(queryEntries.length != 0){
		url += "&"+queryEntries.map(e=>e[0]+"="+e[1]).join("&");
	}
	response.send(await sendGAS(url));
});
function getQuery(request){
	let query = {...request.query};
	let referrer = request.get("Referrer");
	if(referrer){
		new URL(referrer).searchParams.forEach((val, id)=>query[id] = val);
	}
	return query;
}
function sendGAS(startURL){
	return new Promise(loaded=>{
		(function redirectLoop(url){
			https.get(url, resp => {
				resp.setEncoding('utf8');
				if(resp.statusCode == 302){
					redirectLoop(resp.headers["location"]);
				}else{
					let data = "";
					resp.on("data", chunk => data += chunk);
					resp.on("end", () => loaded(data));
				}
			}).on("error", err => {
				console.log("Error: " + err.message);
			});
		})(startURL);
	});
}
app.listen(app.get("port"), function() {
	console.log("起動中");
});


