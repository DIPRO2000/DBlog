import express from "express";
import dotenv from "dotenv";
import cors from "cors";


const app=express()

//dotenv
dotenv.config()

//cors
app.use(cors());

//Middlewares
app.use(express.json());

//Routes
import postcreationroute from "./routes/postcreationroute.js";
import getpostroute from "./routes/getpostroute.js";
import commentroute from "./routes/commentroute.js";


app.use("/api",postcreationroute);
app.use("/api",getpostroute);
app.use("/api",commentroute);

//Test Route
app.get("/",(req,res)=>{
    res.status(200).send("Welcome From Server");
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Running on PORT:${PORT}`);
});


