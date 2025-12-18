
import { ProcedureEntry } from "../types";

export const syncToGoogleSheets = async (webhookUrl: string, entries: ProcedureEntry[]) => {
  if (!webhookUrl) throw new Error("Webhook URL is required");
  if (entries.length === 0) return { success: true, message: "No entries to sync." };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script requires no-cors or specialized CORS handling
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'Avera NICU Tracker',
        timestamp: new Date().toISOString(),
        data: entries
      }),
    });

    // With no-cors, we can't see the response body, but we can assume success if no error thrown
    return { success: true, message: "Sync signal sent successfully!" };
  } catch (error) {
    console.error("Google Sheets Sync Error:", error);
    throw new Error("Failed to reach the Google Sheets Webhook.");
  }
};

export const APPS_SCRIPT_TEMPLATE = `
/**
 * Google Apps Script to receive NICU IV Tracker data
 * 1. Open a Google Sheet
 * 2. Extensions > Apps Script
 * 3. Paste this code and click Save
 * 4. Deploy > New Deployment > Web App
 * 5. Execute as: Me, Who has access: Anyone
 * 6. Copy the Web App URL into the Tracker Settings
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var data = payload.data;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("NICU_Data") || ss.insertSheet("NICU_Data");
    
    // Set headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID", "Date", "Provider", "Patient ID", "Age", "Sex", 
        "Weight", "GA", "Type", "POCUS", "Attempts", "Outcome", "Comments"
      ]);
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#e2efda");
    }
    
    // Clear existing data (optional, or append new only)
    // For this implementation, we overwrite to keep simple sync:
    sheet.getRange(2, 1, sheet.getLastRow() + 1, 13).clearContent();
    
    data.forEach(function(entry) {
      sheet.appendRow([
        entry.id,
        entry.procedureDateTime,
        entry.providerName,
        entry.patientStudyId,
        entry.patientAgeDays,
        entry.patientSex,
        entry.currentWeightGrams,
        entry.correctedGestationalAgeWeeks,
        entry.vascularAccessType,
        entry.pocusUsed ? "Yes" : "No",
        entry.totalAttempts,
        entry.finalOutcome,
        entry.comments
      ]);
    });
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.message).setMimeType(ContentService.MimeType.TEXT);
  }
}
`;
