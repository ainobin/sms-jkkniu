import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (order, regSign, manSign, deptSign) => {


  console.log("Order Data:", order);
  console.log("Register Signature:", regSign);
  console.log("Manager Signature:", manSign);
  console.log("Department Signature:", deptSign);

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

  // Add Logo
  const logoUrl = "/public/Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png";
  const logoWidth = 20;
  const logoHeight = 20;
  const logoX = (pageWidth - logoWidth) / 2;
  doc.addImage(logoUrl, "JPEG", logoX, margin, logoWidth, logoHeight);

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
  doc.text("Store Demand List", pageWidth / 2, currentY, { align: "center" });

  // Add a decorative line
  currentY += 5;
  doc.setDrawColor(0, 102, 204); // Blue line
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // ============ DETAILS SECTION ============

  currentY += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Office/Department Head:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(order.dept_admin_name, margin + 45, currentY);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No:", pageWidth - margin - 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${order.invoice_no}`, pageWidth - margin - 25, currentY);

  currentY += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Office/Department:", margin, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(order.dept_name, margin + 35, currentY);
  doc.setFont("helvetica", "bold");
  doc.text("Designation:", pageWidth - margin - 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text("Depertment Head", pageWidth - margin - 25, currentY);

  currentY += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Date:", margin, currentY);
  doc.setFont("helvetica", "normal");
  
  // Format the date as DD-Month-YYYY
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.getDate() + '-' + 
    orderDate.toLocaleString('default', { month: 'long' }) + '-' + 
    orderDate.getFullYear();
  
  doc.text(formattedDate, margin + 15, currentY);

  // ============ TABLE SECTION ============

  currentY += 10;

  // Add Table with Borders
  autoTable(doc, {
    startY: currentY,
    head: [["No", "Item Name", "Demand Quantity", "Comment", "Allocate Quantity", "Manager Comment"]],
    body: order.items_list.map((item, index) => [
      index + 1,
      item.product_name,
      item.demand_quantity,
      item.user_comment,
      item.register_alloted_quantity,
      item.manager_comment || "",
    ]),
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 10,
      cellPadding: 3,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [208,198,198],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    columnStyles: {
      0: { cellWidth: 15 }, // No column
      1: { cellWidth: 40 }, // Item Name
      5: { cellWidth: 40 }, // In Words
    }
  });

  // ============ SIGNATURES SECTION ============
  
  // Check if there's enough space for signatures section (needs at least 55mm)
  const requiredSignatureSpace = 55; // Total height needed for all signatures
  const remainingSpace = pageHeight - doc.lastAutoTable.finalY - margin;
  
  // Declare signaturesY before using it
  let signaturesY;

  // Add a new page if there isn't enough space
  if (remainingSpace < requiredSignatureSpace) {
    doc.addPage();
    // Reset position to top of page with margin
    signaturesY = margin + 10;
  } else {
    // Use existing position with spacing
    signaturesY = doc.lastAutoTable.finalY + 25;
  }
  
  // First row of signatures - spread evenly
  const signatureWidth = 50;
  const gap = (pageWidth - 2 * margin - 2 * signatureWidth) / 3;
  
  // Smaller signature image dimensions to prevent overlap
  const signatureImgHeight = 10;
  const signatureImgWidth = 25;
  const signatureYOffset = 2;
  
  // Add image with format detection and error handling
  const addSignatureImage = (imgData, x, y, width, height) => {
    if (!imgData) return;
    
    try {
      // Try using JPEG format first
      doc.addImage(imgData, 'JPEG', x, y, width, height);
    } catch (error) {
      console.error("Error adding signature image as JPEG:", error);
      try {
        doc.addImage(imgData, 'AUTO', x, y, width, height);
      } catch (err) {
        console.error("Failed to add signature image with AUTO format:", err);
        try {
          doc.addImage(imgData, 'PNG', x, y, width, height);
        } catch (finalErr) {
          console.error("All signature image format attempts failed:", finalErr);
        }
      }
    }
  };
  
  // Store Manager signature (left)
  if (manSign) {
    addSignatureImage(
      manSign,
      margin + (signatureWidth - signatureImgWidth) / 2,
      signaturesY - signatureImgHeight - signatureYOffset,
      signatureImgWidth,
      signatureImgHeight
    );
  }
  doc.setLineWidth(0.1);
  doc.line(margin, signaturesY, margin + signatureWidth, signaturesY);
  doc.setFontSize(10);
  doc.text("Store Manager", margin + signatureWidth / 2, signaturesY + 5, { align: "center" });
  
    // Register signature (right)
    if (regSign) {
      addSignatureImage(
        regSign,
        pageWidth - margin - signatureWidth + (signatureWidth - signatureImgWidth) / 2,
        signaturesY - signatureImgHeight - signatureYOffset,
        signatureImgWidth,
        signatureImgHeight
      );
    }
    doc.line(pageWidth - margin - signatureWidth, signaturesY, pageWidth - margin, signaturesY);
    doc.text("Register", pageWidth - margin - signatureWidth / 2, signaturesY + 5, { align: "center" });
    
    // Second row of signatures - increase spacing
    signaturesY += 30; // Increased from 20 to 30
    
    // Calculate positions for 3 signatures in the second row
    const sig2Width = 40;
    const totalWidth = 3 * sig2Width;
    // Rename this variable to avoid redeclaration
    const signatureSpacing = pageWidth - 2 * margin - totalWidth; 
    const gap2 = signatureSpacing / 4;
    
    // Office/Dept Head signature (left)
    const sig1X = margin + gap2;
    if (deptSign) {
      addSignatureImage(
        deptSign,
        sig1X + (sig2Width - signatureImgWidth) / 2,
        signaturesY - signatureImgHeight - signatureYOffset,
        signatureImgWidth,
        signatureImgHeight
      );
    }
    doc.line(sig1X, signaturesY, sig1X + sig2Width, signaturesY);
    doc.text("Office/Dept Head", sig1X + sig2Width / 2, signaturesY + 5, { align: "center" });
    






  // Issuer Sign (center)
  const sig2X = sig1X + sig2Width + gap2;
  doc.line(sig2X, signaturesY, sig2X + sig2Width, signaturesY);
  doc.text("Issuer Sign", sig2X + sig2Width / 2, signaturesY + 5, { align: "center" });

  // Recipient Sign (right)
  const sig3X = sig2X + sig2Width + gap2;
  doc.line(sig3X, signaturesY, sig3X + sig2Width, signaturesY);
  doc.text("Recipient Sign", sig3X + sig2Width / 2, signaturesY + 5, { align: "center" });

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
    doc.text(`This Receipt is automatically generated by "Store Management System" software`, margin, footerY+5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: "right" });
  }
  // Save PDF
  doc.save("store-demand-list.pdf");
};

export default generatePDF;