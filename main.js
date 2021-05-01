var request = new XMLHttpRequest();
request.open("GET", 'https://github.com/Xbotics7/MSINotes/releases.atom', true);

request.setRequestHeader("Access-Control-Allow-Origin", "*")
request.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
request.setRequestHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Request-With")
request.setRequestHeader("Access-Control-Allow-Credentials", "true")
request.responseType = 'document';
request.overrideMimeType('text/xml');
request.onload = function () {
  if (request.readyState === request.DONE) {
    if (request.status === 200) {
      console.log(request.responseXML);
    }
  }
};
request.send(null);

