const {onCall} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const nodemailer = require("nodemailer");

// Secrets configuration
const gmailEmail = defineSecret("GMAIL_EMAIL");
const gmailPassword = defineSecret("GMAIL_PASSWORD");

const senderName = "AutoLux Motors";

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailEmail.value(),
      pass: gmailPassword.value(),
    },
  });
};

// Buyer email template with AutoLux dark luxury theme
const generateBuyerEmailTemplate = (order, type) => {
  const isReservation = type === 'reservation';
  const orderNumber = order.id.slice(-6).toUpperCase();
  
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #333; vertical-align: top;">
        <img src="${item.car.images?.[0] || 'https://via.placeholder.com/100x75?text=AutoLux'}" 
             style="width: 100px; height: 75px; object-fit: cover; margin-bottom: 8px;" 
             alt="${item.car.brand} ${item.car.model}">
        <div style="font-weight: 500; font-size: 14px; color: #ffffff;">
          ${item.car.brand} ${item.car.model}
        </div>
        <div style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${item.car.year} • ${item.car.color} • ${item.car.mileage?.toLocaleString()} mi
        </div>
        ${item.notes ? `<div style="color: #aaa; font-size: 11px; margin-top: 4px; font-style: italic;">"${item.notes}"</div>` : ''}
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #333; text-align: right; vertical-align: top; font-size: 16px; color: #ffffff;">
        $${item.car.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isReservation ? 'Reservation Confirmed' : 'Order Confirmation'} - AutoLux</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #ffffff; line-height: 1.6;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #0a0a0a; border: 1px solid #222;">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px; text-align: center; border-bottom: 1px solid #222;">
                  <div style="font-size: 28px; font-weight: 300; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 8px;">AUTOLUX</div>
                  <div style="font-size: 10px; letter-spacing: 4px; text-transform: uppercase; color: #666;">Premium Automotive</div>
                </td>
              </tr>

              <!-- Status Badge -->
              <tr>
                <td style="padding: 30px 40px 0; text-align: center;">
                  <div style="display: inline-block; background-color: #ffffff; color: #000000; padding: 10px 24px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                    ${isReservation ? 'Reservation Confirmed' : 'Order Received'}
                  </div>
                </td>
              </tr>

              <!-- Greeting -->
              <tr>
                <td style="padding: 30px 40px 20px;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: -0.5px;">
                    Thank you, <span style="color: #fff; font-weight: 500;">${order.customerInfo.name}</span>
                  </h1>
                  <p style="color: #888; font-size: 14px; line-height: 1.8; margin-top: 12px;">
                    Your ${isReservation ? 'vehicle reservation' : 'purchase order'} has been successfully received. 
                    ${isReservation 
                      ? 'Your selected vehicle(s) will be held for <strong style="color: #fff;">7 days</strong> pending deposit and final purchase completion.' 
                      : 'Our sales team will contact you within <strong style="color: #fff;">24 hours</strong> to finalize your purchase.'}
                  </p>
                </td>
              </tr>

              <!-- Order Info -->
              <tr>
                <td style="padding: 0 40px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #111; border: 1px solid #222;">
                    <tr>
                      <td style="padding: 20px; width: 50%;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px;">Order Number</div>
                        <div style="font-size: 16px; font-weight: 500; color: #fff; font-family: monospace;">#${orderNumber}</div>
                      </td>
                      <td style="padding: 20px; width: 50%; border-left: 1px solid #222;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px;">Date</div>
                        <div style="font-size: 14px; color: #fff;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 0 20px 20px;">
                        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px;">Type</div>
                        <div style="font-size: 14px; color: #fff;">${isReservation ? '7-Day Reservation Hold' : 'Direct Purchase'}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Info -->
              <tr>
                <td style="padding: 30px 40px 0;">
                  <div style="border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888;">Contact Information</span>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="padding-bottom: 12px; width: 30%; color: #666; font-size: 12px;">Email</td>
                      <td style="padding-bottom: 12px; color: #fff; font-size: 13px;">${order.customerInfo.email}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 12px; color: #666; font-size: 12px;">Phone</td>
                      <td style="padding-bottom: 12px; color: #fff; font-size: 13px;">${order.customerInfo.phone}</td>
                    </tr>
                    <tr>
                      <td style="color: #666; font-size: 12px; vertical-align: top;">Address</td>
                      <td style="color: #fff; font-size: 13px; line-height: 1.5;">${order.customerInfo.address}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items -->
              <tr>
                <td style="padding: 40px;">
                  <div style="border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px;">
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888;">Selected Vehicles</span>
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                    ${itemsList}
                    <tr style="background-color: #ffffff;">
                      <td style="padding: 20px 16px; color: #000000; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                        Total Amount
                      </td>
                      <td style="padding: 20px 16px; color: #000000; font-weight: 600; text-align: right; font-size: 20px;">
                        $${order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              ${isReservation ? `
              <!-- Deposit Notice -->
              <tr>
                <td style="padding: 0 40px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #1a1a1a; border-left: 3px solid #ffffff;">
                    <tr>
                      <td style="padding: 20px;">
                        <div style="font-size: 12px; color: #ccc; line-height: 1.6;">
                          <strong style="color: #ffffff; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Reservation Deposit Required</strong>
                          A <span style="color: #ffffff; font-weight: 500;">$500 deposit per vehicle</span> is required to secure your reservation. This deposit will be fully applied to your final purchase price and is refundable within the 7-day hold period.
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              ` : ''}

              <!-- Next Steps -->
              <tr>
                <td style="padding: 0 40px 40px;">
                  <div style="border-top: 1px solid #222; padding-top: 30px;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 16px;">What happens next?</div>
                    <ol style="margin: 0; padding-left: 20px; color: #aaa; font-size: 13px; line-height: 2;">
                      <li>Our team will review your ${isReservation ? 'reservation' : 'order'} within 2 hours</li>
                      <li>You will receive a confirmation call at ${order.customerInfo.phone}</li>
                      ${isReservation 
                        ? '<li>Deposit payment link will be sent via secure payment portal</li><li>Vehicle will be prepared and held at our facility</li>'
                        : '<li>Financing options and trade-in evaluation can be discussed</li><li>Delivery or pickup will be scheduled</li>'}
                    </ol>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; background-color: #000000; border-top: 1px solid #222; text-align: center;">
                  <div style="font-size: 11px; color: #444; margin-bottom: 8px;">
                    Questions? Contact our concierge team
                  </div>
                  <a href="mailto:concierge@autolux.com" style="color: #888; text-decoration: none; font-size: 12px; border-bottom: 1px solid #444; padding-bottom: 2px;">
                    concierge@autolux.com
                  </a>
                  <div style="margin-top: 20px; font-size: 10px; color: #333;">
                    © ${new Date().getFullYear()} AutoLux Motors. All rights reserved.<br>
                    This is an automated confirmation. Please do not reply to this email.
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Admin notification email template
const generateAdminEmailTemplate = (order, type, buyerEmail, buyerName) => {
  const isReservation = type === 'reservation';
  const orderNumber = order.id.slice(-6).toUpperCase();
  const urgencyColor = isReservation ? '#ff9500' : '#ff4444';
  
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #333; font-size: 13px;">
        <strong style="color: #fff;">${item.car.brand} ${item.car.model}</strong><br>
        <span style="color: #888; font-size: 11px;">ID: ${item.car.id} | ${item.car.year} | ${item.car.color} | ${item.car.mileage?.toLocaleString()} mi</span><br>
        <span style="color: #888; font-size: 11px;">${item.car.fuelType} • ${item.car.transmission}</span>
        ${item.notes ? `<br><span style="color: #aaa; font-size: 11px;">Note: "${item.notes}"</span>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #333; text-align: right; font-size: 14px; color: #fff; font-weight: 500;">
        $${item.car.price.toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Inter', sans-serif; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #000000;">
        <tr>
          <td align="center" style="padding: 20px;">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #111; border: 1px solid #333;">
              
              <!-- Alert Header -->
              <tr>
                <td style="background-color: ${urgencyColor}; padding: 20px; text-align: center;">
                  <div style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #000;">
                    🔔 New ${isReservation ? 'Reservation' : 'Purchase Order'}
                  </div>
                </td>
              </tr>

              <!-- Quick Stats -->
              <tr>
                <td style="padding: 20px; background-color: #1a1a1a;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="width: 33.33%; text-align: center;">
                        <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Order #</div>
                        <div style="font-size: 18px; font-weight: 600; color: #fff; font-family: monospace; margin-top: 4px;">${orderNumber}</div>
                      </td>
                      <td style="width: 33.33%; text-align: center; border-left: 1px solid #333; border-right: 1px solid #333;">
                        <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Total Value</div>
                        <div style="font-size: 18px; font-weight: 600; color: ${urgencyColor}; margin-top: 4px;">$${order.totalAmount.toLocaleString()}</div>
                      </td>
                      <td style="width: 33.33%; text-align: center;">
                        <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Items</div>
                        <div style="font-size: 18px; font-weight: 600; color: #fff; margin-top: 4px;">${order.items.length}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Customer Info -->
              <tr>
                <td style="padding: 30px;">
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${urgencyColor}; margin-bottom: 16px; font-weight: 600;">
                    Customer Details
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0a0a0a; border: 1px solid #222;">
                    <tr>
                      <td style="padding: 16px; border-bottom: 1px solid #222;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase;">Name</span>
                        <div style="color: #fff; font-size: 14px; margin-top: 4px; font-weight: 500;">${buyerName}</div>
                      </td>
                      <td style="padding: 16px; border-bottom: 1px solid #222; border-left: 1px solid #222;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase;">Email</span>
                        <div style="margin-top: 4px;">
                          <a href="mailto:${buyerEmail}" style="color: ${urgencyColor}; text-decoration: none; font-size: 13px;">${buyerEmail}</a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 16px; border-bottom: 1px solid #222;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase;">Phone</span>
                        <div style="color: #fff; font-size: 14px; margin-top: 4px;">
                          <a href="tel:${order.customerInfo.phone}" style="color: #fff; text-decoration: none;">${order.customerInfo.phone}</a>
                        </div>
                      </td>
                      <td style="padding: 16px; border-bottom: 1px solid #222; border-left: 1px solid #222;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase;">Type</span>
                        <div style="color: #fff; font-size: 14px; margin-top: 4px; font-weight: 500;">
                          ${isReservation ? '7-Day Hold' : 'Immediate Purchase'}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 16px;">
                        <span style="color: #666; font-size: 11px; text-transform: uppercase;">Address</span>
                        <div style="color: #fff; font-size: 13px; margin-top: 4px; line-height: 1.5;">${order.customerInfo.address}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Items -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: ${urgencyColor}; margin-bottom: 16px; font-weight: 600;">
                    Vehicle Details
                  </div>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
                    <thead>
                      <tr style="background-color: #1a1a1a;">
                        <th style="padding: 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 500;">Vehicle</th>
                        <th style="padding: 12px; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 500;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsList}
                      <tr style="background-color: ${urgencyColor};">
                        <td style="padding: 16px 12px; color: #000; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">
                          Total
                        </td>
                        <td style="padding: 16px 12px; color: #000; font-weight: 700; text-align: right; font-size: 18px;">
                          $${order.totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Action Required -->
              <tr>
                <td style="padding: 0 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #222; border: 2px solid ${urgencyColor};">
                    <tr>
                      <td style="padding: 20px; text-align: center;">
                        <div style="font-size: 12px; color: #fff; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          ⚡ Action Required
                        </div>
                        <div style="font-size: 13px; color: #aaa; line-height: 1.6;">
                          ${isReservation 
                            ? 'Contact customer within <strong style="color: #fff;">2 hours</strong> to confirm reservation and arrange $500 deposit.' 
                            : 'Initiate immediate contact to finalize purchase. High priority sales lead.'}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Metadata -->
              <tr>
                <td style="padding: 20px 30px; background-color: #0a0a0a; border-top: 1px solid #333;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-size: 11px; color: #555;">
                        Order ID: <span style="color: #888; font-family: monospace;">${order.id}</span>
                      </td>
                      <td style="font-size: 11px; color: #555; text-align: right;">
                        Received: ${new Date().toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="font-size: 10px; color: #444; padding-top: 8px;">
                        AutoLux Internal Notification • Do Not Forward
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Main Cloud Function
exports.sendOrderEmails = onCall(
  {
    secrets: [gmailEmail, gmailPassword],
    cors: true,
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (request) => {
    const {orderId, orderData, buyerEmail, buyerName, userEmail, userDisplayName, type} = request.data;
    
    // Validation
    if (!orderId || !buyerEmail || !orderData || !buyerName) {
      throw new Error("Missing required order information");
    }

    const transporter = createTransporter();
    
    try {
      // Prepare email to buyer
      const buyerMailOptions = {
        from: `"${senderName}" <${gmailEmail.value()}>`,
        to: buyerEmail,
        subject: type === 'reservation' 
          ? `✓ Reservation Confirmed #${orderId.slice(-6).toUpperCase()} - AutoLux Motors`
          : `✓ Order Received #${orderId.slice(-6).toUpperCase()} - AutoLux Motors`,
        html: generateBuyerEmailTemplate(orderData, type),
        text: `Your ${type} has been confirmed with AutoLux Motors. Order #${orderId.slice(-6).toUpperCase()}. Total: $${orderData.totalAmount.toLocaleString()}. We will contact you shortly.`,
      };

      // Prepare email to admin
      const adminMailOptions = {
        from: `"${senderName} System" <${gmailEmail.value()}>`,
        to: gmailEmail.value(), // Sends to the same Gmail (admin)
        // If you have a separate admin email, use: to: "admin@autolux.com",
        subject: `🔔 ${type === 'reservation' ? 'New Reservation' : 'New Purchase'}: ${buyerName} - $${orderData.totalAmount.toLocaleString()}`,
        html: generateAdminEmailTemplate(orderData, type, buyerEmail, buyerName),
        text: `New ${type} from ${buyerName} (${buyerEmail}). Order #${orderId.slice(-6).toUpperCase()}. Total: $${orderData.totalAmount.toLocaleString()}. Action required.`,
      };

      // Send both emails
      const [buyerResult, adminResult] = await Promise.all([
        transporter.sendMail(buyerMailOptions),
        transporter.sendMail(adminMailOptions),
      ]);

      console.log(`✅ Emails sent successfully for order ${orderId}`);
      console.log(`   Buyer: ${buyerResult.messageId}`);
      console.log(`   Admin: ${adminResult.messageId}`);

      return {
        success: true,
        orderId: orderId,
        buyerMessageId: buyerResult.messageId,
        adminMessageId: adminResult.messageId,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error(`❌ Failed to send emails for order ${orderId}:`, error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
);