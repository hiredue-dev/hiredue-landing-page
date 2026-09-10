/**
 * Paste this into Extensions > Apps Script for the onboarding-call sheet.
 * The sheet's header row must be exactly, in this order:
 *   Timestamp | Email address | Full Name | Contact Number | Preferred Meeting Date | Source
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = (e && e.parameter) || {};

  sheet.appendRow([
    new Date(),
    params.email || "",
    params.name || "",
    params.phone || "",
    params.preferredDate || "",
    params.source || "website",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}
