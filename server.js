
const http = require("http")

const server = http.createServer((req, res) => {
    res.write("This is the response from the server")
    res.end();
})

server.listen(5500, () => {
    console.log("Server is Running");
})