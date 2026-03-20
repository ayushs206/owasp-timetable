import { timetable } from "../db/timetable.js";
import { generateGoogleAuthURL } from "../services/google.apis.js";

export const getGoogleAuthURL = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ status: "error", message: "Request body is required" });
    }

    const { batch, operation } = req.body;
    if (!batch || !operation) {
        return res.status(400).json({ status: "error", message: "Batch and operation must be provided in the request body" });
    }

    if (!["addToCalendar", "resetCalendar"].includes(operation)) {
        return res.status(400).json({ status: "error", message: "Invalid operation. Please provide either 'addToCalendar' or 'resetCalendar'" });
    }

    if (!timetable[batch.toUpperCase()]) {
        return res.status(404).json({ status: "error", message: "Batch not found" });
    }

    try {
        const url = await generateGoogleAuthURL(batch.toUpperCase(), operation);
        if (url) {
            res.status(200).json({ status: "success", data: url });
        }
    } catch (error) {
        console.error("Error generating Google Auth URL:", error);
        res.status(500).json({ status: "error", message: "Failed to generate Google Auth URL" });
    }
}