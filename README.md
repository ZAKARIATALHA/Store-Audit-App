# Store Audit Data Collection Tool

A full-stack mobile-optimized web application for collecting store audit data with image uploads to Google Drive and CSV export functionality.

## Features

- ✅ Mobile-first responsive design
- ✅ Easy-to-use button groups for categorical selections
- ✅ Camera capture integration for mobile devices
- ✅ Image upload to Google Drive
- ✅ SQLite database for local storage
- ✅ CSV export functionality
- ✅ Records viewing and management

## Tech Stack

- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite3 (better-sqlite3)
- **Storage**: Google Drive API
- **Hosting**: Vercel

## Prerequisites

- Node.js 16+ and npm
- Google Cloud Service Account (with Drive API enabled)
- Environment variables configured

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Store-Audit-App.git
cd Store-Audit-App
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_private_key
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_DRIVE_FOLDER_ID=your_drive_folder_id
DATABASE_PATH=./audit.db
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating a New Audit
1. Fill in the form fields:
   - Select Store and SKU from dropdowns
   - Choose Brand, Category, Audit Type, and Status using button groups
   - Add optional comments
   - Upload a photo using camera or gallery

2. Click "Submit Audit" to save the data

### Viewing Records
- Navigate to the "Records" tab to see all submitted audits
- Click "View Image" to access the uploaded photo on Google Drive

### Exporting Data
- Click "Export CSV" to download all audit records as a CSV file

## Project Structure

```
Store-Audit-App/
├── pages/
│   ├── api/
│   │   ├── submit-audit.js      # Form submission endpoint
│   │   ├── export-csv.js        # CSV export endpoint
│   │   ├── get-records.js       # Fetch all records
│   │   └── get-options.js       # Fetch dropdown options
│   ├── _app.jsx                 # Next.js app wrapper
│   ├── _document.jsx            # HTML document setup
│   ├── index.jsx                # Main form page
│   └── records.jsx              # Records view page
├── components/
│   ├── ButtonGroup.jsx          # Button group component
│   ├── SelectDropdown.jsx       # Dropdown component
│   └── ImageUpload.jsx          # Image upload component
├── lib/
│   ├── db.js                    # SQLite setup
│   └── googleDrive.js           # Google Drive integration
├── styles/
│   └── globals.css              # Global styles
└── public/                       # Static files
```

## API Endpoints

### POST /api/submit-audit
Submit a new audit record with optional image upload.

**Request**: FormData with:
- store, sku, brand, category, auditType, status, comments
- image (file)

**Response**: `{ success: true, id, imageUrl }`

### GET /api/export-csv
Download all audit records as CSV.

**Response**: CSV file download

### GET /api/get-records
Fetch all audit records.

**Response**: `{ records: [...] }`

### GET /api/get-options
Fetch dropdown options.

**Response**: `{ stores: [...], skus: [...] }`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect your repository to Vercel:
   - Visit https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. Your app will be live at your Vercel URL

## Notes

- Images are uploaded to Google Drive and made publicly viewable
- SQLite database is persisted on the server
- For production use on Vercel, consider using a more robust database solution
- The app is fully optimized for mobile devices with large touch targets

## License

MIT

## Support

For issues or questions, please create a GitHub issue.
