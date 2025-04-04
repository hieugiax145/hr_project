const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, Packer } = require('docx');

/**
 * Generate a job description document in DOCX format
 * @param {Object} position - The position object containing job details
 * @returns {Promise<string>} - Path to the generated DOCX file
 */
exports.generateDocx = async (position) => {
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create a new document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: position.title,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({}), // Empty paragraph for spacing

          // General Information Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Thông tin chung",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({}), // Empty paragraph for spacing

          // Department
          new Paragraph({
            children: [
              new TextRun({
                text: "Phòng ban: ",
                bold: true,
              }),
              new TextRun({
                text: position.department,
              }),
            ],
          }),

          // Level
          new Paragraph({
            children: [
              new TextRun({
                text: "Cấp bậc: ",
                bold: true,
              }),
              new TextRun({
                text: position.level,
              }),
            ],
          }),

          // Experience
          new Paragraph({
            children: [
              new TextRun({
                text: "Kinh nghiệm: ",
                bold: true,
              }),
              new TextRun({
                text: position.experience,
              }),
            ],
          }),

          // Type
          new Paragraph({
            children: [
              new TextRun({
                text: "Hình thức làm việc: ",
                bold: true,
              }),
              new TextRun({
                text: position.type,
              }),
            ],
          }),

          // Mode
          new Paragraph({
            children: [
              new TextRun({
                text: "Mô hình làm việc: ",
                bold: true,
              }),
              new TextRun({
                text: position.mode,
              }),
            ],
          }),

          // Salary
          new Paragraph({
            children: [
              new TextRun({
                text: "Mức lương: ",
                bold: true,
              }),
              new TextRun({
                text: position.salary,
              }),
            ],
          }),

          new Paragraph({}), // Empty paragraph for spacing

          // Job Description Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Mô tả công việc",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({}), // Empty paragraph for spacing

          // Description paragraphs
          ...position.description.split('\n').map(line => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                }),
              ],
            })
          ),

          new Paragraph({}), // Empty paragraph for spacing

          // Requirements Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Yêu cầu",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({}), // Empty paragraph for spacing

          // Requirements paragraphs
          ...position.requirements.split('\n').map(line => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                }),
              ],
            })
          ),

          new Paragraph({}), // Empty paragraph for spacing

          // Benefits Section
          new Paragraph({
            children: [
              new TextRun({
                text: "Quyền lợi",
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({}), // Empty paragraph for spacing

          // Benefits paragraphs
          ...position.benefits.split('\n').map(line => 
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                }),
              ],
            })
          ),
        ],
      }],
    });

    // Generate the DOCX file
    const docxPath = path.join(tempDir, `${position._id}_jd.docx`);
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxPath, buffer);

    return docxPath;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX file');
  }
};

/**
 * Generate a job description document in PDF format
 * @param {Object} position - The position object containing job details
 * @returns {Promise<string>} - Path to the generated PDF file
 */
exports.generatePdf = async (position) => {
  try {
    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create a temporary HTML file with the job description
    const htmlContent = generateHtmlContent(position);
    const htmlPath = path.join(tempDir, `${position._id}_jd.html`);
    fs.writeFileSync(htmlPath, htmlContent);

    // Convert HTML to PDF using puppeteer
    const pdfPath = path.join(tempDir, `${position._id}_jd.pdf`);
    
    // Check if puppeteer is installed
    try {
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
      await page.pdf({ path: pdfPath, format: 'A4' });
      await browser.close();
    } catch (error) {
      console.error('Puppeteer error:', error);
      throw new Error('Failed to generate PDF file');
    }

    // Clean up the HTML file
    fs.unlinkSync(htmlPath);

    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF file');
  }
};

/**
 * Generate HTML content for the job description
 * @param {Object} position - The position object containing job details
 * @returns {string} - HTML content
 */
function generateHtmlContent(position) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${position.title} - Job Description</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #7B61FF;
          border-bottom: 2px solid #7B61FF;
          padding-bottom: 10px;
        }
        h2 {
          color: #7B61FF;
          margin-top: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        .info-item {
          margin-bottom: 10px;
        }
        .info-label {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>${position.title}</h1>
      
      <div class="section">
        <h2>Thông tin chung</h2>
        <div class="info-item">
          <span class="info-label">Phòng ban:</span> ${position.department}
        </div>
        <div class="info-item">
          <span class="info-label">Cấp bậc:</span> ${position.level}
        </div>
        <div class="info-item">
          <span class="info-label">Kinh nghiệm:</span> ${position.experience}
        </div>
        <div class="info-item">
          <span class="info-label">Hình thức làm việc:</span> ${position.type}
        </div>
        <div class="info-item">
          <span class="info-label">Mô hình làm việc:</span> ${position.mode}
        </div>
        <div class="info-item">
          <span class="info-label">Mức lương:</span> ${position.salary}
        </div>
      </div>
      
      <div class="section">
        <h2>Mô tả công việc</h2>
        <div>${position.description.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div class="section">
        <h2>Yêu cầu</h2>
        <div>${position.requirements.replace(/\n/g, '<br>')}</div>
      </div>
      
      <div class="section">
        <h2>Quyền lợi</h2>
        <div>${position.benefits.replace(/\n/g, '<br>')}</div>
      </div>
    </body>
    </html>
  `;
} 