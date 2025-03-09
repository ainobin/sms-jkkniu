import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = async (orders) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const logoWidth = 100;
  const logoHeight = 100;
  const logoURL = "https://upload.wikimedia.org/wikipedia/en/7/7d/Jatiya_Kabi_Kazi_Nazrul_Islam_University_Logo.png"; // Replace with actual image URL

  try {
    const response = await fetch(logoURL);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      const logoBase64 = reader.result;

      // Add Watermark (Centered & Semi-Transparent)
      doc.setGState(new doc.GState({ opacity: 0.2 }));
      doc.addImage(logoBase64, "PNG", (pageWidth - logoWidth) / 2, (pageHeight - logoHeight) / 2, logoWidth, logoHeight);
      doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity

      // University Name & Address
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Jatiya Kabi Kazi Nazrul Islam University", pageWidth / 2, 25, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Dept. of Computer Science and Engineering", pageWidth / 2, 33, { align: "center" });
      doc.text("Trishal, Mymensingh, Bangladesh", pageWidth / 2, 40, { align: "center" });

      // Order Receipt Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Order Receipt", pageWidth / 2, 50, { align: "center" });

      // Add Date & Time
      const now = new Date();
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${now.toLocaleDateString()}`, 14, 60);
      doc.text(`Time: ${now.toLocaleTimeString()}`, 14, 65);

      // Define Table
      const columns = ["Product", "Quantity", "Availability", "Comment"];
      const rows = orders.map((order) => [
        order.product || "N/A",
        order.quantity,
        order.available ? "Yes" : "No",
        order.comment || "-",
      ]);

      // Transparent Table
      autoTable(doc, {
        startY: 70,
        head: [columns],
        body: rows,
        theme: "plain", // Removes table background
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fontStyle: "bold", textColor: [0, 0, 0], fillColor: false, lineWidth: 0.2 }, // No background color
        bodyStyles: { textColor: [0, 0, 0], fillColor: false, lineWidth: 0.2 }, // No background color
      });

      // Signature Section
      doc.setFontSize(12);
      doc.text(".............................................................", 130, pageHeight - 30);
      doc.text("Prof. Dr. Sujan Ali", 145, pageHeight - 25);
      doc.text("Department Head,", 145, pageHeight - 20);
      doc.text("Dept. of Computer Science and Engineering", 120, pageHeight - 15);

      // Save PDF
      doc.save("Order_Receipt.pdf");
    };
  } catch (error) {
    console.error("Failed to load image:", error);
  }
};

export default generatePDF;
