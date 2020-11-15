const express = require("express");
const app = express();
const config = require("config")
const mongoose = require("mongoose");
const PORT = config.get("port") || 5000;

app.use(express.json({ extended: true }));
app.use('/api/auth', require("./routes/auth.routes"));

async function start(){
    try {
        await mongoose.connect(config.get("dbConnectionString"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, ()=>{
            app.listen(PORT, ()=>{console.log(`server has been started on port ${PORT}`);});
        });
    } catch (error) {
        console.error("Data base error: " + error.message);
        process.exit(1);
    }
   
}

start();
