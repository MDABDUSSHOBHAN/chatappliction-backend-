const express = require('express')
const app = express()
// const port = 3000
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRouter');

const Product = require('./model/userModel');
const { Server } = require('socket.io');
const http = require('http');
// const server = http.createServer(app);
require("dotenv").config();


//middelware
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes);
app.use("/api/message",messageRoutes);






const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://shobhanrahman21:kEwhqhVCS2U4bPBt@cluster0.pyspwam.mongodb.net/?appName=Cluster0";



mongoose
    .connect(process.env.MONGO_URL,{
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          }

    })
    .then( ()=>{
        console.log("DB Connection Successfully");
    })
    .catch((err) =>{
        console.log(err.message);
    })



















app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/api/auth/setAvatar', (req, res) => {
  console.log(req.body);
  res.send(req.body);
  res.send("this is avater");


    
      
})
// app.post('/api/message/addmsg', (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
//   res.send("you are gain");
  
     
// })

// /api/messages



// app.post('/api/products', async(req, res,next) => {
//   console.log(req.body);
//   res.send(req.body);
//   // try{
//   //    const product = await Product.create(req.body);
//   //    res.status(200).json(product);
//   // }
//   // catch(error){

//   //   res.status(500).json({message:error.message});
//   // }
// })

// app.post('/api/data', (req, res) => {
//   const formData = req.body;
//   console.log('Received data:', formData);
//   res.json({ message: 'Data received successfully' });
// });

 const server = app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})


//socket io emplement:

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    
    methods:['GET', 'POST'],
    credentials: true,
  },
});

 // Assuming you have initialized your server

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} added with socket ID ${socket.id}`);
    console.log("Current online users:", onlineUsers);
  });
  socket.on("send-msg", (data) =>{
    console.log("Current online users:", onlineUsers);

    // Retrieve the recipient's socket ID from the onlineUsers map
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("Recipient socket ID:", sendUserSocket); // Log the recipient's socket ID
  
    // If the recipient is online, send them the message
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    } else {
      console.log(`User with ID ${data.to} is not online.`);

    }
  })
})