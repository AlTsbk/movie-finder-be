const express = require("express");
const app = express();
const config = require("config")
const mongoose = require("mongoose");
const auth = require("./middleware/auth.middleware")
const PORT = config.get("port") || 5000;

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/comments", require("./routes/comments.routes"));
app.use("/api/movies", require("./routes/movies.routes"));
app.use("/api/users", require("./routes/users.routes"));

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

