import express from "express";
import mysql from "mysql";
import geolib from "geolib";

const router = express.Router();

// Database Connection
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Nityam123!@#",
    database:"school_management",
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected...");
});

// Add School API
router.post("/addSchool", (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(201).json({ message: "School added successfully." });
    });
});

// List Schools API
router.get("/listSchools", (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and longitude are required." });
    }

    const sql = "SELECT * FROM schools";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });

        const sortedSchools = results.map((school) => {
            const distance = geolib.getDistance(
                { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
                { latitude: school.latitude, longitude: school.longitude }
            );
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
});

export default router;
