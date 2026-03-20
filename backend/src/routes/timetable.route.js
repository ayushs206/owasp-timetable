import { Router } from "express";
const router = Router();
import { timetable } from "../db/timetable.js";
import { getGoogleAuthURL } from "../controllers/timetable.google.controller.js";

/* Google Calendar API routes */
router.get("/google/url", getGoogleAuthURL);

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

    const slots = {
        "Monday": ["08:00 AM", "08:50 AM", "09:40 AM", "10:30 AM", "11:20 AM", "12:10 PM", "01:00 PM", "01:50 PM", "02:40 PM", "03:30 PM", "04:20 PM"],
        "Tuesday": ["08:00 AM", "08:50 AM", "09:40 AM", "10:30 AM", "11:20 AM", "12:10 PM", "01:00 PM", "01:50 PM", "02:40 PM", "03:30 PM", "04:20 PM"],
        "Wednesday": ["08:00 AM", "08:50 AM", "09:40 AM", "10:30 AM", "11:20 AM", "12:10 PM", "01:00 PM", "01:50 PM", "02:40 PM", "03:30 PM", "04:20 PM"],
        "Thursday": ["08:00 AM", "08:50 AM", "09:40 AM", "10:30 AM", "11:20 AM", "12:10 PM", "01:00 PM", "01:50 PM", "02:40 PM", "03:30 PM", "04:20 PM"],
        "Friday": ["08:00 AM", "08:50 AM", "09:40 AM", "10:30 AM", "11:20 AM", "12:10 PM", "01:00 PM", "01:50 PM", "02:40 PM", "03:30 PM", "04:20 PM"]
    }

    let validBatches = [];

    batches.forEach(batch => {
        const batchTimetable = timetable[batch.toUpperCase()];
        if (batchTimetable) {
            validBatches.push(batch);
            for (const day in batchTimetable) {
                const classes = batchTimetable[day];
                for (const [time, subject] of Object.entries(classes)) {
                    const slotIndex = slots[day].indexOf(time);
                    if (slotIndex !== -1) {
                        slots[day].splice(slotIndex, 1);
                    }
                }
            }
        }
    });

    if (validBatches.length === 0) {
        return res.status(404).json({ status: "error", message: "No valid batches found" });
    }

    res.status(200).json({ status: "success", data: slots });
});

/* Get list of all batches */
router.get("/batches", async (req, res) => {
    const batches = Object.keys(timetable).map(batch => batch.toUpperCase());
    res.status(200).json({ status: "success", data: batches });
});


export default router;