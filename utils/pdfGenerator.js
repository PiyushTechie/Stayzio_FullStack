import PDFDocument from "pdfkit";
import path from "path";

export const generateBookingPDF = (booking) => {
  return new Promise((resolve, reject) => {
    try {
      const nights =
        (new Date(booking.checkOut) - new Date(booking.checkIn)) /
          (1000 * 60 * 60 * 24) || 1;

      const subtotal = booking.subtotal || booking.listing?.price * nights || 0;
      const gst = booking.gst || subtotal * 0.18;
      const convenienceFee = booking.convenienceFee || subtotal * 0.05;
      const finalTotal = booking.finalTotal || subtotal + gst + convenienceFee;

      const guests = booking.guests || [];
      const contactNumber = booking.contactNumber || "N/A";

      // ====== PDF SETUP ======
      const doc = new PDFDocument({
        margin: 60,
        size: "A4",
      });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Register font
      const fontPath = path.join(process.cwd(), "public/fonts/NotoSans-Regular.ttf");
      
      try {
        doc.registerFont("NotoSans", fontPath);
        doc.font("NotoSans");
      } catch (e) {
        console.warn("Font file not found, falling back to Helvetica");
        doc.font("Helvetica");
      }

      doc.rect(0, 0, 595, 100).fill("#fe424d");

      // Logo with more spacing
      doc
        .fontSize(28)
        .fillColor("#ffffff")
        .text("🌏︎Stayzio", 60, 30, { continued: false });

      // Booking Confirmation with increased gap
      doc
        .fontSize(11)
        .fillColor("#ffffff")
        .text("Booking Confirmation", 60, 65);

      // Right side - Booking details
      doc
        .fontSize(8)
        .fillColor("#ffffff")
        .text(`Booking ID:`, 380, 28, { align: "left" })
        .fontSize(9)
        .fillColor("#ffffff")
        .text(`${booking._id}`, 380, 40, { width: 155 });
      
      // Issue Date
      doc
        .fontSize(8)
        .fillColor("#ffffff")
        .text(
          `Issue Date: ${new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`,
          380,
          58,
          { align: "left" }
        );
      
      // Issue Time (NEW)
      doc
        .fontSize(8)
        .fillColor("#ffffff")
        .text(
          `Issue Time: ${new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`,
          380,
          72,
          { align: "left" }
        );

      doc.moveDown(3);

      // ====== BOOKING INFORMATION SECTION ======
      const startY = 140;
      doc.y = startY;

      doc.fontSize(10).fillColor("#666666").text("GUEST INFORMATION", 60, startY);
      
      const guestName = booking.user?.profile?.name || 
                        booking.user?.name || 
                        booking.user?.username || 
                        "N/A";
      
      const guestPhone = contactNumber !== "N/A" ? contactNumber : 
                         (booking.user?.profile?.phone || 
                          booking.user?.phone || 
                          "N/A");
      
      doc
        .fontSize(11)
        .fillColor("#000000")
        .text(guestName, 60, startY + 20);
      doc
        .fontSize(9)
        .fillColor("#666666")
        .text(booking.user?.email || "N/A", 60, startY + 38)
        .text(`Mobile: ${guestPhone}`, 60, startY + 52);

      doc.fontSize(10).fillColor("#666666").text("HOST INFORMATION", 320, startY);
      
      const hostName = booking.listing?.owner?.profile?.name || 
                       booking.listing?.owner?.hostDetails?.name || 
                       booking.listing?.owner?.username || 
                       "Stayzio Host";
      
      const hostPhone = booking.listing?.owner?.profile?.phone || 
                        booking.listing?.owner?.hostDetails?.phone || 
                        "N/A";
      
      doc
        .fontSize(11)
        .fillColor("#000000")
        .text(hostName, 320, startY + 20);
      doc
        .fontSize(9)
        .fillColor("#666666")
        .text(booking.listing?.owner?.email || "host@stayzio.com", 320, startY + 38)
        .text(`Mobile: ${hostPhone}`, 320, startY + 52);

      doc.y = startY + 85;
      doc
        .moveTo(60, doc.y)
        .lineTo(535, doc.y)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      // ====== RESERVATION DETAILS ======
      doc.moveDown(1.5);
      doc.fontSize(14).fillColor("#000000").text("Reservation Details", 60);

      doc.moveDown(0.3);

      // Property name with background
      doc.rect(60, doc.y, 475, 35).fillAndStroke("#f9fafb", "#e5e7eb");

      doc
        .fontSize(12)
        .fillColor("#000000")
        .text(booking.listing?.title || "N/A", 70, doc.y + 10, { width: 455 });

      doc.moveDown(1.5);

      const locationY = doc.y + 15;
      const city = booking.listing?.location || "N/A";
      const country = booking.listing?.country || "N/A";
      
      doc
        .fontSize(10)
        .fillColor("#666666")
        .text(`Location: `, 60, locationY, { continued: true })
        .fillColor("#000000")
        .text(`${city}, ${country}`);

      doc.moveDown(1);

      const tableStartY = doc.y + 20;
      const colWidth = 237.5;

      // Table headers
      doc.rect(60, tableStartY, colWidth, 30).fillAndStroke("#f9fafb", "#e5e7eb");
      doc
        .rect(60 + colWidth, tableStartY, colWidth, 30)
        .fillAndStroke("#f9fafb", "#e5e7eb");

      doc.fontSize(9).fillColor("#666666").text("CHECK-IN", 70, tableStartY + 10);
      doc.fontSize(9).fillColor("#666666").text("CHECK-OUT", 70 + colWidth, tableStartY + 10);

      // Table values
      doc.rect(60, tableStartY + 30, colWidth, 35).stroke("#e5e7eb");
      doc
        .rect(60 + colWidth, tableStartY + 30, colWidth, 35)
        .stroke("#e5e7eb");

      doc
        .fontSize(11)
        .fillColor("#000000")
        .text(
          new Date(booking.checkIn).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          70,
          tableStartY + 42
        );
      doc
        .fontSize(11)
        .fillColor("#000000")
        .text(
          new Date(booking.checkOut).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          70 + colWidth,
          tableStartY + 42
        );

      doc.y = tableStartY + 70;

      // Duration
      doc
        .fontSize(9)
        .fillColor("#666666")
        .text(`Total Duration: ${nights} night${nights > 1 ? "s" : ""}`, 60);

      // ====== GUEST DETAILS ======
      doc.moveDown(2);
      doc.fontSize(14).fillColor("#000000").text("Guest Details", 60);

      doc.moveDown(0.5);

      if (guests.length > 0) {
        const guestTableY = doc.y;
        const guestRowHeight = 30;

        // Table header
        doc.rect(60, guestTableY, 475, 25).fillAndStroke("#f9fafb", "#e5e7eb");

        doc
          .fontSize(9)
          .fillColor("#666666")
          .text("NAME", 70, guestTableY + 8)
          .text("TYPE", 280, guestTableY + 8)
          .text("AGE", 380, guestTableY + 8)
          .text("GENDER", 450, guestTableY + 8);

        let currentY = guestTableY + 25;

        guests.forEach((g, i) => {
          if (currentY > 700) {
            doc.addPage();
            currentY = 60;
          }

          doc.rect(60, currentY, 475, guestRowHeight).stroke("#e5e7eb");

          doc
            .fontSize(10)
            .fillColor("#000000")
            .text(g.name || "N/A", 70, currentY + 10, { width: 200 })
            .text(g.type || "N/A", 280, currentY + 10)
            .text(g.age?.toString() || "N/A", 380, currentY + 10)
            .text(g.gender || "N/A", 450, currentY + 10);

          currentY += guestRowHeight;
        });

        doc.y = currentY + 15;
      } else {
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text("No guest details provided", 60);
        doc.moveDown(1);
      }

      if (doc.y > 650) {
        doc.addPage();
        doc.y = 60;
      }

      doc.moveDown(1);
      doc.fontSize(14).fillColor("#000000").text("Payment Summary", 60);

      doc.moveDown(0.5);

      const priceItems = [
        [`Accommodation (${nights} night${nights > 1 ? "s" : ""})`, subtotal],
        ["GST (18%)", gst],
        ["Service Fee", convenienceFee],
      ];

      let currentPriceY = doc.y;

      priceItems.forEach(([label, value]) => {
        doc.fontSize(10).fillColor("#666666").text(label, 60, currentPriceY);
        doc
          .fillColor("#000000")
          .text(`Rs. ${value.toFixed(2)}`, 450, currentPriceY, {
            width: 85,
            align: "right",
          });

        currentPriceY += 22;
      });

      // Divider line
      doc.moveDown(0.3);
      doc
        .moveTo(60, doc.y)
        .lineTo(535, doc.y)
        .strokeColor("#000000")
        .lineWidth(1)
        .stroke();

      // Total
      doc.moveDown(0.3);
      doc.fontSize(12).fillColor("#000000").text("Total Amount", 60, doc.y);
      doc
        .fontSize(14)
        .fillColor("#fe424d")
        .text(`Rs. ${finalTotal.toFixed(2)}`, 450, doc.y, {
          width: 85,
          align: "right",
        });

      // ====== FOOTER ======
      const footerY = 750;
      doc
        .moveTo(60, footerY)
        .lineTo(535, footerY)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      doc
        .fontSize(8)
        .fillColor("#999999")
        .text(
          "This is a computer-generated document and does not require a signature.",
          60,
          footerY + 15,
          {
            align: "center",
            width: 475,
          }
        )
        .text("© 2025 Stayzio. All Rights Reserved.", 60, footerY + 41, {
          align: "center",
          width: 475,
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};