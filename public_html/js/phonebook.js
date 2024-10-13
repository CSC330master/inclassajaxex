let URLprefix="http://34.30.19.99"

// a function that will convert an object into a URL query string format
// not used in this script
function queryObjectToString(query) {
    // get the properties in the query object
    // for {message:"Hi I am sending an AJAX request", name: "Sahar"};
    // properties will be ["message", "name" ]
    let properties = Object.keys(query);
    // create a string int the format "propert=value" for each property in query
    // arrOfQuesryStrings will be ["message=Hi I am sending an AJAX request", "name=Sahar"]
    let arrOfQuesryStrings = properties.map(prop => prop+"="+query[prop]);
    //combine the strings in arrOfQuesryStrings wuth &
    // return value will be "message=Hi I am sending an AJAX request&name=Sahar"
    return(arrOfQuesryStrings.join('&'));
 }


 // attach click event handler to sendAJAX push button
document.getElementById("search").addEventListener("click",sendAJAX);

// get the interface elements that will be used
let textBox = document.getElementById("sname");
let resultsPar = document.getElementById("resultsP");

// fucntion that checks if the textbox is empty or not and decides which AJAX request to send accordingly
function sendAJAX() {
	if (!textBox.value)
		sendDisplayAllAJAX();
	else
		sendSearchAJAX(textBox.value);

}

// function that displays an error message received as a parameter as an alert pop-up
function errorHandler(message) {
	alert("Error: "+message);
}

function sendDisplayAllAJAX() {
	console.log("in sendDisplayAllAJAX");
	let AJAXObj = new XMLHttpRequest(); // create AJAX object
	// error event handler calls errorHandler() with the error event object as a JSON string
	AJAXObj.onerror = (event) => {	console.log("in on error");
				      	alert("Communication error\n"); 
					errorHandler("Communication error\n"+JSON.stringigy(event));
				      };
	// AJAX load event handler
	AJAXObj.onload = function () {
		console.log("in onload");
		if (this.status == 200) { // server sends success status
			let phonebook = JSON.parse(this.responseText); // get the receives JSON string and parse it into an object
			let htmlStr = "";
			for (entry of phonebook)  // iterate through the array that is received from the server
				htmlStr += "<p>"+entry.name+"\t"+entry.phone+"</p>";
			resultsPar.innerHTML = htmlStr;
		}
		else
			errorHandler(this.status);
	}
	AJAXObj.open("GET",URLprefix+"/displayall"); //setup AJAX request parameters
	AJAXObj.send();

}

function sendSearchAJAX(name) {
        let AJAXObj = new XMLHttpRequest();
        // error event handler calls errorHandler() with the error event object as a JSON string
        AJAXObj.onerror = (event) => {  console.log("in on error");
                                        alert("Communication error\n"); 
                                        errorHandler("Communication error\n"+JSON.stringigy(event));
                                      };

        AJAXObj.onload = function () {
                if (this.status == 200) { // server sends success status
                        resultsPar.innerHTML = this.responseText; // Server response is simple text. Display it.
                }
                else
                        errorHandler(this.status);
        };


       AJAXObj.open("GET",URLprefix+"/search?name="+name); //setup AJAX request, including query sting with name
       AJAXObj.send();
}
