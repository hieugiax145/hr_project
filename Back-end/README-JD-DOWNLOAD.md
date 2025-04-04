# Job Description Download Functionality

This document provides instructions for setting up the Job Description (JD) download functionality in the recruitment system.

## Prerequisites

To use the JD download functionality, you need to install the following tools:

1. **Pandoc** - For converting HTML to DOCX
   - Download and install from: https://pandoc.org/installing.html

2. **wkhtmltopdf** (optional) - Alternative for PDF generation if Puppeteer fails
   - Download and install from: https://wkhtmltopdf.org/downloads.html

## Setup Instructions

1. Install the required Node.js packages:
   ```
   npm install puppeteer
   ```

2. Create a proper reference DOCX template:
   - Replace the placeholder file at `templates/reference.docx` with a properly formatted DOCX file
   - This file will be used as a template for all generated DOCX files

3. Create the temp directory:
   ```
   mkdir -p temp
   ```

## Usage

The JD download functionality is available through the following API endpoint:

```
GET /api/positions/:id/download-jd?format=docx|pdf
```

### Parameters:
- `id`: The ID of the position
- `format`: The desired format (either `docx` or `pdf`)

### Example:
```
GET /api/positions/60f1a2b3c4d5e6f7g8h9i0j1/download-jd?format=pdf
```

## Troubleshooting

If you encounter issues with PDF generation:

1. Make sure Puppeteer is properly installed
2. If Puppeteer fails, the system will fall back to wkhtmltopdf if it's installed
3. Check the server logs for specific error messages

If you encounter issues with DOCX generation:

1. Make sure Pandoc is properly installed and accessible from the command line
2. Verify that the reference.docx template exists and is properly formatted
3. Check the server logs for specific error messages 