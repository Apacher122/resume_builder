import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import { FILE_PATHS } from '../constants/file-paths.js';

export const makeSinglePage = async() => {
    // Read the input PDF file into a buffer
    const existingPdfBytes = fs.readFileSync(FILE_PATHS.COMPILED_RESUME);
  
    // Load the existing PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
    // Remove specified pages (pagesToRemove is an array of page indexes)
    const pages = pdfDoc.getPages();

    // Remove pages starting from the second page (index 1 onwards)
    for (let i = pages.length - 1; i >= 1; i--) {
        pdfDoc.removePage(i);
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
  
    // Write the modified PDF back to the same file
    fs.writeFileSync(FILE_PATHS.COMPILED_RESUME, pdfBytes);
    console.log(`PDF updated and saved to ${FILE_PATHS.COMPILED_RESUME}`);
};