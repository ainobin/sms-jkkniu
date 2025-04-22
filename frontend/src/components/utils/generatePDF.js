import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (order, regSign, manSign, deptSign) => {
  // console.log("Order Data:", order);
  // console.log("Registrar Signature:", regSign);
  // console.log("Manager Signature:", manSign);
  // console.log("Department Signature:", deptSign);

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

  try {
    // Add Logo - Using a base64 encoded image for reliability
    const universityLogoBase64 = "data:image/png;base64,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";
    
    const logoWidth = 20;
    const logoHeight = 20;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(universityLogoBase64, "PNG", logoX, margin, logoWidth, logoHeight);
  } catch (error) {
    console.error("Error adding university logo:", error);
    // Continue without the logo if there's an error
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
  
    // Registrar signature (right)
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
    doc.text("Registrar", pageWidth - margin - signatureWidth / 2, signaturesY + 5, { align: "center" });
    
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