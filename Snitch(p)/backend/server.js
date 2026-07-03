import app from './src/app.js'
import config from "./src/config/config.js"
import connectToDb from './src/config/db.js';
  await connectToDb();



app.listen(3200,()=>{
    console.log("server started at port no 3200");
})