import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-hot-toast";

/**
 * Generates a PDF report for audit transactions across multiple products
 * @param {Object} transactionsData - An object with product IDs as keys and array of transactions as values
 * @param {Array} selectedProducts - Array of selected product objects
 * @param {Object} filterParams - Filter parameters used for the report
 */
const generateAuditReportPDF = (transactionsData, selectedProducts, filterParams) => {
    try {
        // Initialize PDF document with A4 size (portrait)
        const doc = new jsPDF();
        
        // Set up document properties
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        doc.setFontSize(12); // Standard 12pt text size
        
        // Add report title and header
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("Full Audit Report", pageWidth / 2, 15, { align: "center" });
        
        // Add filter information
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        let yPos = 22;
        
        // Add date range if present
        if (filterParams.startDate || filterParams.endDate) {
            const dateRange = `Date Range: ${filterParams.startDate || 'Any'} to ${filterParams.endDate || 'Any'}`;
            doc.text(dateRange, pageWidth / 2, yPos, { align: "center" });
            yPos += 6;
        }
        
        // Add transaction type filter if present
        if (filterParams.typeSearch) {
            const typeFilter = `Transaction Type: ${filterParams.typeSearch.toUpperCase()}`;
            doc.text(typeFilter, pageWidth / 2, yPos, { align: "center" });
            yPos += 6;
        }
        
        // Add department filter if present
        if (filterParams.search) {
            const deptFilter = `Department Filter: ${filterParams.search}`;
            doc.text(deptFilter, pageWidth / 2, yPos, { align: "center" });
            yPos += 6;
        }
        
        // Add report generation date
        const generateDate = `Report Generated: ${new Date().toLocaleString()}`;
        doc.text(generateDate, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
        
        // Format date function
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-GB", { 
                day: "numeric", 
                month: "short", 
                year: "numeric"
            });
        };
        
        // Process each product
        let totalTransactionsCount = 0;
        let currentY = yPos;
        
        selectedProducts.forEach((product, index) => {
            const transactions = transactionsData[product._id] || [];
            totalTransactionsCount += transactions.length;
            
            if (transactions.length === 0) {
                return; // Skip products with no transactions
            }
            
            // Check if we need a new page
            if (currentY > 230 || index > 0) {
                doc.addPage();
                currentY = 15;
            }
            
            // Add product header
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`${product.name} (${transactions.length} transactions)`, 14, currentY);
            currentY += 7;
            
            // Add table for this product with updated column order: Quantity, Before, After
            const tableColumn = [
                "Date", 
                "Department", 
                "Type", 
                "Quantity",  // Changed order
                "Before",    // Changed order
                "After"      // Changed order
            ];
            
            // Map transaction data to table rows with updated column order
            const tableRows = transactions.map(item => [
                formatDate(item.createdAt),
                item.department || "N/A",
                item.transaction_type.toUpperCase(),
                item.change_stock,   // Changed order
                item.previous_stock, // Changed order
                item.new_stock       // Changed order
            ]);
            
            // Generate the table
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: currentY,
                theme: 'grid',
                styles: { 
                    fontSize: 12,
                    cellPadding: 2,
                    overflow: 'linebreak',
                    halign: 'center',
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0]
                },
                headStyles: {
                    fillColor: [255, 255, 255],
                    textColor: [0, 0, 0],
                    fontStyle: 'bold',
                    lineWidth: 0.5,
                    lineColor: [0, 0, 0]
                },
                didDrawCell: (data) => {
                    // Add border to each cell
                    if (data.cell.section === 'head' || data.cell.section === 'body') {
                        const doc = data.doc;
                        const cell = data.cell;
                        
                        doc.setDrawColor(0, 0, 0); // Black border
                        doc.setLineWidth(0.1);
                        doc.rect(cell.x, cell.y, cell.width, cell.height, 'S');
                    }
                }
            });
            
            currentY = doc.lastAutoTable.finalY + 15;
        });
        
        // ============ FOOTER SECTION ============
        // Add page number at the bottom of each page
        const totalPages = doc.internal.getNumberOfPages();

        // For each page, print the page number and the total pages
        for (let i = 1; i <= totalPages; i++) {
            // Go to page i
            doc.setPage(i);
            const footerY = pageHeight - 10;
            doc.setFontSize(8);
            doc.setTextColor(100); 
            doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, footerY);
            doc.text(`This Report is automatically generated by "Store Management System" software`, margin, footerY + 5);
            doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, { align: "right" });
        }
        
        // Generate filename with date
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        let filename = `audit-report-${dateStr}`;
        
        if (filterParams.typeSearch) {
            filename += `-${filterParams.typeSearch}`;
        }
        
        if (selectedProducts.length === 1) {
            filename += `-${selectedProducts[0].name.replace(/\s+/g, '-')}`;
        }
        
        filename += '.pdf';
        
        // Save the PDF
        doc.save(filename);
        return true;
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF report");
        return false;
    }
};

export default generateAuditReportPDF;