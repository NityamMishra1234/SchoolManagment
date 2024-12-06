import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import SchoolRouter from "./routes/schools.js";


dotenv.config();



const app = express();


const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors({
    origin: '*',
}));
app.use(bodyParser.json());

// Routes
app.use("/schools", SchoolRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
