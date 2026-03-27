const { google } = require('googleapis');
const { Readable } = require('stream');

let drive;

async function initializeDrive() {
  const auth = new google.auth.GoogleAuth({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: 'b5fe0aebcbe8cad84a67a19d95143e067993ff9b',
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      client_id: '100239284717266097510',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/audit-uploader%40store-audit-app-491509.iam.gserviceaccount.com',
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  drive = google.drive({ version: 'v3', auth });
  return drive;
}

async function uploadImage(fileBuffer, fileName) {
  if (!drive) {
    await initializeDrive();
  }

  try {
    const fileStream = Readable.from(fileBuffer);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: 'image/jpeg',
        body: fileStream,
      },
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;
    const webViewLink = response.data.webViewLink;

    // Make file publicly viewable
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return webViewLink;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
}

module.exports = {
  initializeDrive,
  uploadImage,
};
