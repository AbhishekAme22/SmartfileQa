const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

function wrapText(text, maxWidth, font, fontSize) {
  // Simple word wrap for pdf-lib
  // Split on explicit newlines first, then wrap each line
  const rawLines = text.split(/\r?\n/);
  let lines = [];
  for (let rawLine of rawLines) {
    const words = rawLine.split(' ');
    let currentLine = '';
    for (let word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }
  return lines;
}

exports.generatePDF = async (conversation) => {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 40;
  const maxWidth = page.getWidth() - 2 * margin;
  let y = page.getHeight() - margin;

  // Title
  page.drawText(`Conversation: ${conversation.title || conversation.id}`.slice(0, 80), {
    x: margin,
    y,
    size: fontSize + 2,
    font,
    color: rgb(0, 0, 0.7)
  });
  y -= fontSize + 10;

  // Files section
  if (conversation.files && conversation.files.length > 0) {
    page.drawText('Files in this conversation:', {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= fontSize + 2;
    for (const file of conversation.files) {
      // Show file name, type, and URL
      const fileLine = `- ${file.file_name} (${file.file_type})`;
      const fileLines = wrapText(fileLine, maxWidth, font, fontSize);
      for (const line of fileLines) {
        if (y < margin + fontSize * 2) {
          page = pdfDoc.addPage([595, 842]);
          y = page.getHeight() - margin;
        }
        page.drawText(line, { x: margin + 10, y, size: fontSize, font, color: rgb(0.2,0.2,0.2) });
        y -= fontSize + 2;
      }
      if (file.file_url) {
        const urlLines = wrapText(file.file_url, maxWidth - 20, font, fontSize - 1);
        for (const urlLine of urlLines) {
          if (y < margin + fontSize * 2) {
            page = pdfDoc.addPage([595, 842]);
            y = page.getHeight() - margin;
          }
          page.drawText(urlLine, { x: margin + 30, y, size: fontSize - 1, font, color: rgb(0,0,0.7) });
          y -= fontSize;
        }
      }
    }
    y -= fontSize;
  }

  for (const msg of conversation.messages) {
    // Q
    const qLines = wrapText('Q: ' + msg.prompt, maxWidth, font, fontSize);
    for (const line of qLines) {
      if (y < margin + fontSize * 2) {
        page = pdfDoc.addPage([595, 842]);
        y = page.getHeight() - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1,0.1,0.1) });
      y -= fontSize + 2;
    }
    // A
    const aLines = wrapText('A: ' + msg.answer, maxWidth, font, fontSize);
    for (const line of aLines) {
      if (y < margin + fontSize * 2) {
        page = pdfDoc.addPage([595, 842]);
        y = page.getHeight() - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0,0,0.3) });
      y -= fontSize + 2;
    }
    y -= fontSize; // extra space between Q&A
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = `exports/conversation_${conversation.id}.pdf`;
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
};
