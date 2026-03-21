import { google } from "googleapis";

export const generateGoogleAuthURL = async (batch, operation) => {

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );

    const scopes = [
        "https://www.googleapis.com/auth/calendar"
    ];

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({ batch, operation })
    });
};

const dayMap = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 0 };

const pad2 = (num) => String(num).padStart(2, "0");

const parseDateOnlyToUTC = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

const formatAsLocalDateTime = (dateObj) => {
    const year = dateObj.getUTCFullYear();
    const month = pad2(dateObj.getUTCMonth() + 1);
    const day = pad2(dateObj.getUTCDate());
    const hours = pad2(dateObj.getUTCHours());
    const minutes = pad2(dateObj.getUTCMinutes());
    const seconds = pad2(dateObj.getUTCSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);
    return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
}

export const handleGoogleCallback = async (code, batch, operation) => {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
    );
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const calendarParams = { version: "v3", auth: oAuth2Client };
    const calendar = google.calendar(calendarParams);

    const calendarName = process.env.CALENDAR_NAME || "Timetable";
    let calendarId = null;

    const calendarList = await calendar.calendarList.list();
    const existing = calendarList.data.items.find(c => c.summary === calendarName);

    if (existing) {
        calendarId = existing.id;
    } else {
        const newCal = await calendar.calendars.insert({
            requestBody: { summary: calendarName }
        });
        calendarId = newCal.data.id;
    }

    if (operation === "resetCalendar") {
        await resetCalendar(calendar, calendarId);
        return;
    }

    if (operation === "addToCalendar" && batch) {
        await addScheduleToCalendar(calendar, calendarId, batch);
    }
}

const resetCalendar = async (calendar, calendarId) => {
    try {
        await calendar.calendars.delete({ calendarId });
    } catch (error) {
        console.error("Error resetting calendar:", error);
    }
}

import { timetable } from "../db/timetable.js";

const addScheduleToCalendar = async (calendar, calendarId, batch) => {
    const batchTimetable = timetable[batch.toUpperCase()];
    if (!batchTimetable) throw new Error("Batch not found : " + batch);

    const startDateStr = process.env.SEMESTER_START_DATE || "2025-07-21";
    const startDate = parseDateOnlyToUTC(startDateStr);
    const calendarTimeZone = process.env.CALENDAR_TIME_ZONE || "Asia/Kolkata";

    const eventsToCreate = [];

    const getGoogleColorId = (type) => {
        const t = (type || "").toLowerCase();
        if (t.includes("lecture")) return "9"; // Blueberry
        if (t.includes("practical") || t.includes("lab")) return "10"; // Basil
        if (t.includes("tutorial")) return "3"; // Grape
        return "8"; // Graphite
    };

    for (const [day, classes] of Object.entries(batchTimetable)) {
        const dayIndex = dayMap[day];

        const classDate = new Date(startDate);
        const startDayIndex = classDate.getUTCDay();
        const daysToAdd = (dayIndex - startDayIndex + 7) % 7;

        classDate.setUTCDate(classDate.getUTCDate() + daysToAdd);

        for (const [timeRange, classDetails] of Object.entries(classes)) {
            // classDetails -> [CourseCode, Location, SubjectName, Type]
            const { hours, minutes } = parseTime(timeRange);

            const eventStart = new Date(Date.UTC(
                classDate.getUTCFullYear(),
                classDate.getUTCMonth(),
                classDate.getUTCDate(),
                hours,
                minutes,
                0
            ));

            const eventEnd = new Date(eventStart.getTime() + 50 * 60000); // assume 50 min class

            eventsToCreate.push({
                summary: `${classDetails[2]} (${classDetails[3]})`,
                location: classDetails[1],
                description: `Course Code: ${classDetails[0]}\nType: ${classDetails[3]}\nBatch: ${batch}`,
                colorId: getGoogleColorId(classDetails[3]),
                start: { dateTime: formatAsLocalDateTime(eventStart), timeZone: calendarTimeZone },
                end: { dateTime: formatAsLocalDateTime(eventEnd), timeZone: calendarTimeZone },
                recurrence: [
                    'RRULE:FREQ=WEEKLY;COUNT=19'
                ],
                extendedProperties: { private: { batch } }
            });
        }
    }

    // Batch process 10 at a time with 1000ms delay to respect rate limit (approx ~10 req/sec)
    for (let i = 0; i < eventsToCreate.length; i += 10) {
        const batchEvents = eventsToCreate.slice(i, i + 10);
        await Promise.all(batchEvents.map(event =>
            calendar.events.insert({
                calendarId,
                requestBody: event
            }).catch(e => console.error("Event Insert Error:", e.message))
        ));
        await new Promise(r => setTimeout(r, 1000));
    }
}
