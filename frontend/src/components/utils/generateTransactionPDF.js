import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generateTransactionPDF = (transactions, departmentName) => {
  // Create PDF with slightly larger margins
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

    // Position text content after logo
    let currentY = margin + logoHeight + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Jatiya Kabi Kazi Nazrul Islam University", pageWidth / 2, currentY, { align: "center" });
  } catch (error) {
    console.error("Error adding university logo:", error);
    // If logo fails to load, continue with text only
    let currentY = margin + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Jatiya Kabi Kazi Nazrul Islam University", pageWidth / 2, currentY, { align: "center" });
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
  doc.text("Department Allocation Transactions Report", pageWidth / 2, currentY, { align: "center" });

  // Add a decorative line
  currentY += 5;
  doc.setDrawColor(0, 102, 204); // Blue line
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ============ DETAILS SECTION ============

  currentY += 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Department:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(departmentName, margin + 25, currentY);
  
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
  autoTable(doc, {
    startY: currentY,
    head: [["No", "Date", "Product Name", "Transaction Type", "Quantity", "Before", "After"]],
    body: transactions.map((transaction, index) => [
      index + 1,
      new Date(transaction.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      transaction.product_name,
      transaction.transaction_type.toUpperCase(),
      transaction.change_stock,
      transaction.previous_stock,
      transaction.new_stock,
    ]),
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
      minCellHeight: 14, // Ensure enough height for header text
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    // Calculate dynamic margins to center the table
    margin: { left: (pageWidth - 175) / 2 },
    tableWidth: 175, // Fixed table width
    columnStyles: {
      0: { cellWidth: 15 },  // No column
      1: { cellWidth: 25 }, // Date
      2: { cellWidth: 50 }, // Product Name
      3: { cellWidth: 30 }, // Transaction Type
      4: { cellWidth: 20 }, // Quantity
      5: { cellWidth: 20 }, // Before
      6: { cellWidth: 15 }, // After
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
  
  // Save PDF
  doc.save(`${departmentName.replace(/\s+/g, '-')}-transactions.pdf`);
};

export default generateTransactionPDF;