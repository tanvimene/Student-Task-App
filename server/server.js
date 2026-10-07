const express = require("express");
const cors = require("cors");
const mongoose = 
require("mongoose");
require("dotenv").config();
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/test", (req, res) => {
    res.send("TEST OK");
});


mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log("MongoDB Connected"))
 .catch((error) => console.log("MongoDB Connection Error:", error));

app.get("/", (req, res) => {
    res.send("Student Task App Server is Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
