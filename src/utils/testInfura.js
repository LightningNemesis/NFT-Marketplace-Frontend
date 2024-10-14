const https = require("https");

const projectId = "146b7b3923a246e9bc38f960b069aeee";
const projectSecret = "xeDjszEOo1UDvEVgEtt4biyrXb0tbTRUREckzQOdRFYF8Bm/c+O1Lg";

const options = {
  host: "ipfs.infura.io",
  port: 5001,
  path: "/api/v0/pin/add?arg=QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn",
  method: "POST",
  auth: projectId + ":" + projectSecret,
};

let req = https.request(options, (res) => {
  let body = "";
  res.on("data", function (chunk) {
    body += chunk;
  });
  res.on("end", function () {
    console.log(body);
  });
});
req.end();
