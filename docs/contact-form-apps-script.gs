/**
 * Paste this into Extensions > Apps Script for the contact-us sheet.
 * The sheet's header row must be exactly, in this order:
 *   Timestamp | Name | Email | Phone | Subject | Message | Source | Submitted At
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = (e && e.parameter) || {};

  sheet.appendRow([
    new Date(),
    params.name || "",
    params.email || "",
    params.phone || "",
    params.subject || "",
    params.message || "",
    params.source || "contact_page",
    params.submittedAt || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ success: true }),
  ).setMimeType(ContentService.MimeType.JSON);
}
