const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const discover = require("./routes/discover");
const morgan = require("morgan");
// const http = require("http");
// const {Server} = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.disable('x-powered-by'); 

// const server = http.createServer(app);

// const io = new Server(server,{
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET","POST","PUT"]
//     }
// })

// io.on("connection", (socket) => {
//     console.log(`connected : ${socket.id}`);

//     socket.on("join_room", (data) => {
//         socket.join(data);
//     })

//     socket.on("send_message", (data) => {
//         socket.to(data.room).emit("recieve_message", data);
//     })

//     // socket.on("send_message", (data) => {
//     //     socket.broadcast.emit("recieve_message", data);
//     // })
// })


connection();

app.get("/health",(req,res) => {
    res.send(`Up and running at ${new Date()}`);
});

app.use("/discover",discover);

app.use((req,res,next) => {
    res.status(404).send("Page not found!!");
});

app.use((err,req,res,next) =>{
    res.status(500).send("Something went wrong");
});


const host = process.env.HOST || "localhost";
const port = process.env.PORT || "3001";

app.listen(port,(req,res) => {
    console.log(`Server started at http://${host}:${port}`);
});