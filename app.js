
// setting up requireds
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('node:path');

let phoneBook = new Array();
phoneBook[0] = {name: "Alia", phone: "860-345-7878"};
phoneBook[1] = {name: "Allie", phone: "203-908-3409"};
phoneBook[2] = {name: "Aly", phone: "413-486-5667"};
phoneBook[3] = {name: "Brittany", phone: "413-509-6666"};
phoneBook[4] = {name: "Elizabeth", phone: "860-997-7878"};
phoneBook[5] = {name: "Ellen", phone: "860-340-8000"};
phoneBook[6] = {name: "Eve", phone: "407-340-0087"};
phoneBook[7] = {name: "Evita", phone: "203-340-7001"};
phoneBook[8] = {name: "Linda", phone: "413-300-7878"};
phoneBook[9] = {name: "Liza", phone: "860-400-8781"};





// function that takes a file type and creates a useable response that reads different files
typeFunc = function(ext) {
        // switch case to create proper response head information
        switch (ext) {
                case '.html':
                cType = 'text/html';
                break;
                case '.js':
                cType = 'application/javascript';
                break;
                case '.css':
                cType = 'text/css';
                break;
                case '.txt':
                cType = 'text/plain';
                break;
                case '.jpg':
                cType = 'image/jpeg';
                break;
                case '.png':
                cType = 'image/png';
                break;
                case '.pdf':
                cType = 'application/pdf';
                break;
                case '.wav':
                cType = '.wav'
                break;
                case 'mp3':
                cType = 'audio/mpeg';
                break;

        }
	return(cType);
        // server response structure to read different files
};


// function that creates a file name by parseing the url then reads file
sendFile = function(filepath,res) {
        fs.readFile(filepath,function (err, content){ 
                // checking for file read error
                if (err) {
			console.log(err);
			res.writeHead(404);
        		res.end();
                } else {
                        // calling reponse and file type functions for to create server response
                        cType = typeFunc(path.extname(filepath)); 
        		res.writeHead(200, {'Content-Type': cType });
        		res.write(content);
        		res.end();

                }
        });
};

//function responsible for processing /displayall route
function displayall(resObj) {
	console.log("in displayall");
	resObj.writeHead(200,{"Content-Type":"application/json"});
	resObj.write(JSON.stringify(phoneBook));
	resObj.end();

}

// function responsible for processing /search route
function search(resObj,queryObj) {
	if (!queryObj || !queryObj.name) { //checking that there is a query object (query string in the URL) 
					   //and it has the required field 
		resObj.writeHead(400,{"Content-Type":"text/plain"});
		resObj.write("Invalid query string");
		resObj.end();
	}
	else { // search for the name in query object. 
		let found = false;
		for (entry of phoneBook)
			if (entry.name == queryObj.name) {
				resObj.writeHead(200,{"Content-Type":"text/plain"});
				resObj.write(entry.phone);
				resObj.end();
				found = true;
				// if there is more than one match, send back the first one and break
				// otherwise, a write after end will happen
				break; 
			}
		if (!found) {
			resObj.writeHead(200,{"Content-Type":"text/plain"});
                        resObj.write("No match found");
                        resObj.end();
		}
				
	}
}


// server call back function
const myserver = http.createServer(function(req,res){
	let urlObj = url.parse(req.url,"true");
	let pathname = urlObj.pathname;
	console.log(pathname);
	//routing depending on pathname
	switch (pathname) {
		case "/displayall":
			displayall(res);
			break;
		case "/search" :
			search(res,urlObj.query);
			break;
		// if none of the expected request pathnames, it must be a  path to a file
		default :
			sendFile("./public_html"+pathname,res);
			break;
	
	}
});

// start the server
myserver.listen(80);













