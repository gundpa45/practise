import express from "express"
import runGraph from "./ai/graph.ai.js";

const app=express();



app.get('/get',(req,res)=>{
    res.status(200).json({
        msg:"Hello, World!"
    })
})

    app.get("/test",async(req,res)=>{
        const result =await runGraph("write code for the pattern in c++ ")
        res.status(200).json({ result })
    })

export default app;