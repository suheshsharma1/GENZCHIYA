import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures an HTML element and downloads it as a high-quality PDF.
 * Uses dynamic height formatting to match thermal printer receipts.
 */
export const downloadReceiptPDF = async (elementId: string, filename: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    return false;
  }

  // Preserve styles and force visibility for capture
  const originalPosition = element.style.position;
  const originalLeft = element.style.left;
  const originalDisplay = element.style.display;
  
  element.style.position = 'relative';
  element.style.left = '0';
  element.style.display = 'block';

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High DPI rendering
      useCORS: true,
      backgroundColor: '#FFFFFF',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Width of standard 80mm receipt roll.
    // Calculate page height dynamically based on aspect ratio
    const imgWidthMm = 80;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [imgWidthMm, imgHeightMm + 4], // Add a 4mm margin at bottom
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidthMm, imgHeightMm);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    return false;
  } finally {
    // Restore styling
    element.style.position = originalPosition;
    element.style.left = originalLeft;
    element.style.display = originalDisplay;
  }
};
