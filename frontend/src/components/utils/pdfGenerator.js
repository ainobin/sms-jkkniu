import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download a PDF for stock items
 * @param {Array} items - Array of stock items to include in the PDF
 * @param {String} filterType - Current filter type ("all", "outOfStock", "lowStock")
 */
export const generateStockPDF = (items, filterType) => {
  // Create PDF with better formatting
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    margins: { top: 10, right: 10, bottom: 10, left: 10 }
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;

  // ============ HEADER SECTION ============

  // Define logo dimensions consistently for use throughout the document
  const logoWidth = 20;
  const logoHeight = 20;

  try {
    // Use a relative URL path that works in browser context
    const logoUrl = "/Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png"; // From public directory
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logoUrl, "PNG", logoX, margin, logoWidth, logoHeight);
  } catch (error) {
    console.error("Error adding university logo:", error);
  }

  // University Name and Address
  let currentY = margin + logoHeight + 10;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Jatiya Kabi Kazi Nazrul Islam University", pageWidth / 2, currentY, { align: "center" });

  currentY += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Trisal, Mymensingh", pageWidth / 2, currentY, { align: "center" });

  currentY += 8;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Inventory Stock Status Report", pageWidth / 2, currentY, { align: "center" });

  // Add a decorative line
  currentY += 5;
  doc.setDrawColor(0, 102, 204); // Blue line
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ============ DETAILS SECTION ============

  currentY += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Report Type:", margin, currentY);
  
  let reportTypeText;
  if (filterType === 'outOfStock') {
    reportTypeText = 'Out of Stock Items';
  } else if (filterType === 'lowStock') {
    reportTypeText = 'Low Stock Items';
  } else {
    reportTypeText = 'All Items in Inventory';
  }
  
  doc.setFont("helvetica", "normal");
  doc.text(reportTypeText, margin + 25, currentY);
  
  // Format the date as DD-Month-YYYY
  const currentDate = new Date();
  const formattedDate = currentDate.getDate() + '-' + 
    currentDate.toLocaleString('default', { month: 'long' }) + '-' + 
    currentDate.getFullYear();
  
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - margin - 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(formattedDate, pageWidth - margin - 35, currentY);

  // ============ TABLE SECTION ============

  currentY += 10;

  // Add Table with Borders
  doc.autoTable({
    startY: currentY,
    head: [["No.", "Product Name", "Current Stock", "Threshold", "Status"]],
    body: items.map((item, index) => {
      let status = 'Normal';
      if (item.current_stock === 0) {
        status = 'Out of Stock';
      } else if (item.current_stock <= item.threshold_point) {
        status = 'Low Stock';
      }
      
      return [
        index + 1,
        item.name,
        item.current_stock.toString(),
        item.threshold_point.toString(),
        status
      ];
    }),
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
      lineWidth: 0.5,
      lineColor: [0, 0, 0]
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      minCellHeight: 14,
    },
    // Remove alternateRowStyles to have white background for all rows
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    // Calculate dynamic margins to center the table
    margin: { left: (pageWidth - 170) / 2 },
    tableWidth: 170, // Fixed table width
    columnStyles: {
      0: { cellWidth: 15 },  // No column
      1: { cellWidth: 60 },  // Product Name
      2: { cellWidth: 30 },  // Current Stock
      3: { cellWidth: 25 },  // Threshold
      4: { cellWidth: 40 },  // Status
    },
    didDrawCell: (data) => {
      // Add border to each cell
      if (data.cell.section === 'body' || data.cell.section === 'head') {
        const doc = data.doc;
        const cell = data.cell;
        
        doc.setDrawColor(0, 0, 0); // Black border
        doc.setLineWidth(0.1);
        doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
      }
    },
    // Custom style for rows based on stock status
    willDrawCell: (data) => {
      if (data.section === 'body') {
        const item = items[data.row.index];
        
        if (item.current_stock === 0) {
          data.cell.styles.textColor = [192, 57, 43]; // Red for out of stock
          if (data.column.index === 4) { // Status column
            data.cell.styles.fontStyle = 'bold';
          }
        } else if (item.current_stock <= item.threshold_point) {
          data.cell.styles.textColor = [211, 84, 0]; // Orange for low stock
          if (data.column.index === 4) { // Status column
            data.cell.styles.fontStyle = 'bold';
          }
        }
      }
    }
  });

  // ============ FOOTER SECTION ============

  // Add page number at the bottom of each page
  const totalPages = doc.internal.getNumberOfPages();

  // For each page, print the page number and the total pages
  for(let i = 1; i <= totalPages; i++) {
    // Go to page i
    doc.setPage(i);
    const footerY = pageHeight - 10;
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, footerY);
    doc.text(`This Report is automatically generated by "Store Management System" software`, margin, footerY+5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: "right" });
  }
  
  // Save the PDF with a meaningful filename
  const reportType = filterType === 'outOfStock' ? 'out-of-stock' : 
                    filterType === 'lowStock' ? 'low-stock' : 'all-items';
  
  doc.save(`inventory-stock-report-${reportType}-${Date.now()}.pdf`);
};
