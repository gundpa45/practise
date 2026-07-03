import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser";

import authrouter from "./routes/user.route.js"

const app = express();
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())



app.get("/", (req,res)=>{
    res.status(201).json({
        msg:"hello this is vishnu with snitch app "
    })
})

app.use("/auth", authrouter)

export default app;