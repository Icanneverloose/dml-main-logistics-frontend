import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Shipment } from '../hooks/useShipments';

export const generatePDFReceipt = (shipment: Shipment): Blob => {
  try {
    // Ensure all required fields have defaults
    const safeShipment = {
      tracking_number: shipment.tracking_number || shipment.id || 'N/A',
      sender_name: shipment.sender_name || 'N/A',
      sender_address: shipment.sender_address || 'N/A',
      sender_phone: shipment.sender_phone || 'N/A',
      sender_email: shipment.sender_email || 'N/A',
      receiver_name: shipment.receiver_name || 'N/A',
      receiver_address: shipment.receiver_address || 'N/A',
      receiver_phone: shipment.receiver_phone || 'N/A',
      receiver_email: shipment.receiver_email || '',
      package_type: shipment.package_type || 'Standard',
      weight: shipment.weight || 0,
      weight_unit: shipment.weight_unit || 'kg',
      shipment_cost: shipment.shipment_cost || 0,
      status: shipment.status || 'Registered',
      date_registered: shipment.date_registered || new Date().toISOString(),
      estimated_delivery_date: shipment.estimated_delivery_date,
      origin_country: shipment.origin_country,
      destination_country: shipment.destination_country
    };
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });
    
    // Company Header
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102); // DML blue color (#003366)
    doc.setFont(undefined, 'bold');
    doc.text('DML LOGISTICS', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text('SHIPMENT RECEIPT', 105, 30, { align: 'center' });
    
    // Receipt Number and Date
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Receipt No: ${safeShipment.tracking_number}`, 20, 45);
    const receiptDate = safeShipment.date_registered 
      ? new Date(safeShipment.date_registered).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      : new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
    doc.text(`Date: ${receiptDate}`, 20, 52);
    
    // Helper function to wrap text to multiple lines
    const wrapText = (text: string, maxWidth: number, fontSize: number = 10): string[] => {
      const maxChars = 43; // User specified: wrap at 43 characters
      if (text.length <= maxChars) {
        return [text];
      }
      
      const lines: string[] = [];
      let currentLine = '';
      
      // Split by words to avoid breaking words
      const words = text.split(' ');
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (testLine.length <= maxChars) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          // If word itself is longer than maxChars, break it
          if (word.length > maxChars) {
            let remainingWord = word;
            while (remainingWord.length > maxChars) {
              lines.push(remainingWord.substring(0, maxChars));
              remainingWord = remainingWord.substring(maxChars);
            }
            currentLine = remainingWord;
          } else {
            currentLine = word;
          }
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines.length > 0 ? lines : [text];
    };

    // Sender Information
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 51, 102);
    doc.text('FROM:', 20, 65);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let senderY = 72;
    doc.text(safeShipment.sender_name, 20, senderY);
    senderY += 7;
    
    // Wrap sender address
    const senderAddressLines = wrapText(safeShipment.sender_address, 85, 10);
    for (const line of senderAddressLines) {
      doc.text(line, 20, senderY);
      senderY += 7;
    }
    
    doc.text(`Phone: ${safeShipment.sender_phone}`, 20, senderY);
    senderY += 7;
    doc.text(`Email: ${safeShipment.sender_email}`, 20, senderY);
    
    // Receiver Information
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 51, 102);
    doc.text('TO:', 110, 65);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    let receiverY = 72;
    doc.text(safeShipment.receiver_name, 110, receiverY);
    receiverY += 7;
    
    // Wrap receiver address
    const receiverAddressLines = wrapText(safeShipment.receiver_address, 85, 10);
    for (const line of receiverAddressLines) {
      doc.text(line, 110, receiverY);
      receiverY += 7;
    }
    
    doc.text(`Phone: ${safeShipment.receiver_phone}`, 110, receiverY);
    receiverY += 7;
    if (safeShipment.receiver_email) {
      doc.text(`Email: ${safeShipment.receiver_email}`, 110, receiverY);
    }
    
    // Adjust table position based on longest address
    const maxAddressLines = Math.max(senderAddressLines.length, receiverAddressLines.length);
    const addressHeight = Math.max(0, (maxAddressLines - 1) * 7); // Extra height for wrapped lines
    const tableStartY = Math.max(105, 72 + (maxAddressLines * 7) + 20); // Ensure minimum spacing after addresses
    
    // Shipment Details Table
    autoTable(doc, {
      startY: tableStartY,
      head: [['Package Type', 'Weight', 'Status', 'Cost']],
      body: [[
        safeShipment.package_type,
        `${safeShipment.weight} ${safeShipment.weight_unit}`,
        safeShipment.status,
        `$${parseFloat(safeShipment.shipment_cost.toString()).toFixed(2)}`
      ]],
      theme: 'striped',
      headStyles: { 
        fillColor: [0, 159, 227], // DML blue (#009FE3)
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      margin: { left: 20, right: 20 }
    });
    
    // Additional Information
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    if (safeShipment.estimated_delivery_date) {
      const deliveryDate = new Date(safeShipment.estimated_delivery_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Estimated Delivery: ${deliveryDate}`, 20, finalY);
    }
    
    if (safeShipment.origin_country || safeShipment.destination_country) {
      doc.text(
        `Route: ${safeShipment.origin_country || 'N/A'} → ${safeShipment.destination_country || 'N/A'}`,
        20,
        safeShipment.estimated_delivery_date ? finalY + 7 : finalY
      );
    }
    
    // Footer
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for choosing DML Logistics', 105, footerY, { align: 'center' });
    doc.text('This is an official receipt. Please keep it safe.', 105, footerY + 7, { align: 'center' });
    doc.text('For any inquiries, please contact our customer service.', 105, footerY + 14, { align: 'center' });
    
    // Generate PDF - use datauristring (most reliable method)
    let pdfBlob: Blob;
    
    try {
      // Use datauristring which is the most reliable output format
      const dataUri = doc.output('datauristring');
      
      if (!dataUri) {
        throw new Error('PDF output returned null or undefined');
      }
      
      if (!dataUri.includes('data:application/pdf')) {
        console.error('Invalid data URI format:', dataUri.substring(0, 100));
        throw new Error('Invalid PDF data URI format');
      }
      
      // Extract base64 data (everything after the comma)
      const commaIndex = dataUri.indexOf(',');
      if (commaIndex === -1) {
        throw new Error('No base64 data separator found in data URI');
      }
      
      const base64Data = dataUri.substring(commaIndex + 1);
      if (!base64Data || base64Data.length === 0) {
        throw new Error('Base64 data is empty');
      }
      
      // Convert base64 to binary using a more efficient method
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create blob from bytes
      pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      
      if (!pdfBlob || pdfBlob.size === 0) {
        throw new Error(`PDF blob is empty (size: ${pdfBlob?.size || 0})`);
      }
      
      // Verify it's a valid PDF by checking the header
      const headerCheck = bytes.slice(0, 4);
      const pdfHeader = String.fromCharCode(...headerCheck);
      if (pdfHeader !== '%PDF') {
        console.warn('PDF header check failed:', pdfHeader);
        // Still proceed as it might be valid
      }
      
    } catch (error: any) {
      console.error('PDF generation error details:', error);
      console.error('Attempting fallback method...');
      
      // Fallback: Try arraybuffer
      try {
        const arrayBuffer = doc.output('arraybuffer');
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          throw new Error('Array buffer is empty');
        }
        pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });
      } catch (arrayBufferError: any) {
        console.error('ArrayBuffer method also failed:', arrayBufferError);
        throw new Error(`PDF generation failed: ${error.message || 'Unknown error'}`);
      }
    }
    
    if (!pdfBlob || pdfBlob.size === 0) {
      throw new Error('PDF generation produced an empty blob');
    }
    
    return pdfBlob;
  } catch (error: any) {
    console.error('Error in generatePDFReceipt:', error);
    console.error('Shipment data:', shipment);
    throw new Error(`Failed to generate PDF: ${error.message || 'Unknown error'}`);
  }
};

