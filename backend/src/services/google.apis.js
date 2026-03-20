import { google } from "googleapis";
import axios from "axios";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const scopes = [
    "https://www.googleapis.com/auth/calendar"
];

export const generateGoogleAuthURL = async (batch, operation) => {
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        state: JSON.stringify({ batch, operation })
    });
};
