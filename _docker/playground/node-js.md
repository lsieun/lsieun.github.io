---
title: "NodeJS"
sequence: "101"
---

File: `app.js`

```javascript
const http = require('http');
const os = require('os');

const listenPort = 8080;

console.log("Kubia server starting...");
console.log("Local hostname is " + os.hostname());
console.log("Listening on port " + listenPort);

var handler = function(request, response) {
  let clientIP = request.connection.remoteAddress;
  console.log("Received request for "+request.url+" from "+clientIP);
  response.writeHead(200);
  response.write("Hey there, this is "+os.hostname()+". ");
  response.write("Your IP is "+clientIP+". ");
  response.end("\n");
};

var server = http.createServer(handler);
server.listen(listenPort);
```

File: `Dockerfile`

```text
FROM node:12
ADD app.js /app.js
ENTRYPOINT ["node", "app.js"]
```

```text
$ docker build -t kubia:latest .
```

```text
$ docker images
```

```text
$ docker history kubia:latest
```

```text
$ docker run --name kubia-container -p 1234:8080 -d kubia
```

```text
$ curl localhost:1234
```

```text
$ docker inspect kubia-container
```

```text
$ docker logs kubia-container
```
