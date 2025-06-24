function doGet() {
  return HtmlService.createHtmlOutputFromFile('form');
}

function uploadData(campus, message, codename, fileDataArray) {
  try {
    const sheet = SpreadsheetApp.openById('1miovni_vVs7SqBZ3ODmXUXeUGzRGstcWvNsmvr2v_hM'); // <-- Replace with your actual sheet ID
    const sheetTab = sheet.getSheetByName("PisayChat Submissions");
    let folder, fileLinks = [];

    if (fileDataArray.length > 0) {
      folder = DriveApp.createFolder('Uploaded Files');

      fileDataArray.forEach(function (fileData) {
        const bytes = Utilities.base64Decode(fileData.data);
        const blob = Utilities.newBlob(bytes, fileData.mimeType, fileData.filename);
        const file = folder.createFile(blob);
        fileLinks.push(file.getUrl());
      });
    }

    // Combine file links into a single cell
    const fileLinksString = fileLinks.join(', '); // You can change separator if preferred

    // Save one row with text + combined links
    sheetTab.appendRow([new Date(), campus, message, codename, fileLinksString, "Post on FB page"]);

    return 'Your message has successfully been sent' + (fileLinks.length ? ' with files' : '!');
  } catch (e) {
    return 'Error: ' + e.toString();
  }
}
