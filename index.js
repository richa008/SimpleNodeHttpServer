const http =  require("http");
const path =  require("path");
const fs =  require("fs");

const hostname = "localhost";
const port = 3000;

const server = http.createServer((request, response) => {
    console.log(`Request url: ${request.url}`);
    if (request.method === "GET") {
        let fileUrl;
        if (request.url === "/") {
            fileUrl = "/index.html";
        } else {
            fileUrl = request.url;
        }
        const filePath = path.resolve(`./public${fileUrl}`);
        console.log(`File path: ${filePath}`);
        const fileExt = path.extname(filePath);
        if (fileExt === ".html") {
            fs.exists(filePath, (exists) => {
                if (!exists) {
                    showError(response, "File not found");
                    return;
                }
                response.statusCode = 200;
                response.setHeader("Content-Type", "text/html");
                fs.createReadStream(filePath).pipe(response);
            });
        } else {
            showError(response, "File not html");
        }
    } else {
        showError(response, "Only serves GET method");
    }
});

function showError(response, message) {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html");
    response.end(`<html>
        <body>
            <h1>Error: 404: ${message}</h1>
        <body/>
    </html>`)
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:3000`);
});