import { Router } from "express";
const router = Router();
import { timetable } from "../db/timetable.js";
import { getGoogleAuthURL, googleAuthCallback } from "../controllers/timetable.google.controller.js";

/* Google Calendar API routes */
router.post("/google/url", getGoogleAuthURL);
router.get("/google/callback", googleAuthCallback);

/* Get timetable for a specific batch */
router.get("/schedule/:batch", async (req, res) => {
    const { batch } = req.params;
    const batchTimetable = timetable[batch];
    if (batchTimetable) {
        res.status(200).json({ status: "success", data: batchTimetable });
    } else {
        res.status(404).json({ status: "error", message: "Batch not found" });
    }
});

/* Get free slots for a list of batches */
router.post("/freeslots", async (req, res) => {
    const batches = req.body?.batches;
    if (!batches || !Array.isArray(batches)) {
        return res.status(400).json({ status: "error", message: "Batches must be provided as an array in the request body" });
    }

    if (batches.length < 2 || batches.length > 9) {
        return res.status(400).json({ status: "error", message: "Invalid number of batches. Please provide between 2 and 9 batches." });
    }

    if (batches.some(batch => !timetable[batch.toUpperCase()])) {
        return res.status(400).json({ status: "error", message: "One or more batches not found. Please check the batch names and try again." });
    }

    res.status(200).json({ status: "success", data: batches.map(batch => timetable[batch.toUpperCase()]) });
});

/* Get list of all batches */
router.get("/batches", async (req, res) => {
    const batches = Object.keys(timetable).map(batch => batch.toUpperCase());
    res.status(200).json({ status: "success", data: batches });
});


export default router;