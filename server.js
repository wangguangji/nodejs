var http = require('http');
var url = require('url');

function start(route,handle){
	function onRequest(request,response){
		var pathname = url.parse(request.url).pathname;
		if(pathname.indexOf('favicon.ico')>0)return;	
		 request.setEncoding("UTF-8");
  		var postData = "";
	    request.addListener("data", function(postDataChunk) {
	      postData += postDataChunk;
	      console.log("Received POST data chunk '"+
	      postDataChunk + "'.");
	    });
	    request.addListener("end", function() {
	      route(handle, pathname, response, request);
	    });
	}
	http.createServer(onRequest).listen(8888);
	console.log('server 启动 ');
}

exports.start = start;


