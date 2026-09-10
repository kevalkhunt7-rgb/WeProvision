const nodemailer = require('nodemailer');

// Helper to create Nodemailer Transporter dynamically
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.EMAIL_USER || 'weprovisioninfotech@gmail.com';
  const pass = process.env.EMAIL_PASS || 'temp_app_password_here';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Prevent SSL handshake issues on local development
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Core sendMail wrapper with safe placeholder handling & fallback logging
 */
const sendMailSafe = async ({ to, subject, html, text }) => {
  const from = process.env.EMAIL_FROM || '"WeProvision Infotech" <weprovisioninfotech@gmail.com>';
  const pass = process.env.EMAIL_PASS;

  // Check if credentials are using temporary placeholder password
  if (!pass || pass === 'temp_app_password_here' || pass.includes('temp')) {
    console.log(`\n📧 [EMAIL SERVICE - TEMP MODE] Email sending simulated (Update EMAIL_PASS in backend/.env for real SMTP dispatch)`);
    console.log(` ├─ To: ${to}`);
    console.log(` ├─ Subject: ${subject}`);
    console.log(` └─ From: ${from}\n`);
    return { success: true, simulated: true };
  }

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]+>/g, ''),
      html,
    });
    console.log(`✅ [EMAIL SERVICE] Email dispatched successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`⚠️ [EMAIL SERVICE] Could not dispatch email to ${to}: ${error.message}`);
    // Log body safely so no data is lost
    console.log(` └─ Attempted Subject: "${subject}"`);
    return { success: false, error: error.message };
  }
};

/**
 * 1. Send Contact Inquiry Emails (to Admin & Client confirmation)
 */
exports.sendInquiryEmails = async (inquiryData) => {
  const { name, email, phone, company, service, budget, subject, message } = inquiryData;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'weprovisioninfotech@gmail.com';

  // --- Admin Notification Email HTML ---
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; borderRadius: 16px;">
      <h2 style="color: #a855f7; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-top: 0;">
        📬 New Client Inquiry Received
      </h2>
      <p style="font-size: 14px; color: #cbd5e1;">A new inquiry has been submitted through the WeProvision Contact Form:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; width: 140px; color: #c084fc;">Client Name:</td><td style="padding: 10px;">${name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #c084fc;">Email Address:</td><td style="padding: 10px;"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #c084fc;">Phone Number:</td><td style="padding: 10px;">${phone || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #c084fc;">Company:</td><td style="padding: 10px;">${company || 'N/A'}</td></tr>
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #c084fc;">Service Requested:</td><td style="padding: 10px; font-weight: bold; color: #34d399;">${service}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #c084fc;">Budget Range:</td><td style="padding: 10px;">${budget}</td></tr>
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #c084fc;">Subject:</td><td style="padding: 10px; font-weight: bold;">${subject}</td></tr>
      </table>

      <div style="margin-top: 20px; background-color: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #a855f7;">
        <strong style="color: #c084fc; display: block; margin-bottom: 6px;">Message Details:</strong>
        <p style="margin: 0; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>

      <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">
        WeProvision Infotech Backend System • ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  // --- Client Confirmation Email HTML ---
  const clientHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #090613; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #3b0764;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0;">
          WEPROVISION <span style="color: #c084fc;">INFOTECH</span>
        </h1>
        <p style="color: #a855f7; font-size: 11px; font-weight: 700; letter-spacing: 3px; uppercase; margin-top: 4px;">
          NEXT-GEN DIGITAL SYSTEMS
        </p>
      </div>

      <h2 style="color: #f472b6; font-size: 18px; margin-top: 0;">Hello ${name},</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Thank you for reaching out to <strong>WeProvision Infotech</strong>. We have successfully received your inquiry regarding <strong>${service}</strong>.
      </p>

      <div style="background-color: #170f25; padding: 16px; border-radius: 12px; border: 1px solid #30204a; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #c084fc; font-weight: bold;">Summary of your message:</p>
        <p style="margin: 0; font-size: 13px; color: #e2e8f0; italic;">"${subject}" — ${message.substring(0, 140)}${message.length > 140 ? '...' : ''}</p>
      </div>

      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Our team of engineers and specialists is reviewing your project details. We will contact you back via email or phone within 24 business hours.
      </p>

      <div style="border-top: 1px solid #334155; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
        <p style="margin: 0;">Need immediate assistance? Email us at <a href="mailto:weprovisioninfotech@gmail.com" style="color: #c084fc;">weprovisioninfotech@gmail.com</a></p>
        <p style="margin: 6px 0 0 0;">&copy; ${new Date().getFullYear()} WeProvision Infotech. All rights reserved.</p>
      </div>
    </div>
  `;

  // Send admin notification
  await sendMailSafe({
    to: adminEmail,
    subject: `[New Inquiry] ${subject} - ${name}`,
    html: adminHtml,
  });

  // Send client confirmation if valid email provided
  if (email && email.includes('@')) {
    await sendMailSafe({
      to: email,
      subject: `We have received your message - WeProvision Infotech`,
      html: clientHtml,
    });
  }
};

/**
 * 2. Send Candidate Job Application Emails (to Admin HR & Candidate confirmation)
 */
exports.sendApplicationEmails = async (appData) => {
  const { applicantName, email, phone, jobTitle, portfolioUrl, resumeUrl, coverLetter } = appData;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'weprovisioninfotech@gmail.com';

  // --- Admin Notification Email HTML ---
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 16px;">
      <h2 style="color: #38bdf8; border-bottom: 2px solid #334155; padding-bottom: 12px; margin-top: 0;">
        📄 New Job Application Submitted
      </h2>
      <p style="font-size: 14px; color: #cbd5e1;">A new candidate applied for position <strong>${jobTitle}</strong>:</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; width: 150px; color: #38bdf8;">Applicant Name:</td><td style="padding: 10px; font-bold;">${applicantName}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #38bdf8;">Email:</td><td style="padding: 10px;"><a href="mailto:${email}" style="color: #38bdf8;">${email}</a></td></tr>
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #38bdf8;">Phone:</td><td style="padding: 10px;">${phone || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #38bdf8;">Target Position:</td><td style="padding: 10px; font-weight: bold; color: #34d399;">${jobTitle}</td></tr>
        <tr style="background-color: #1e293b;"><td style="padding: 10px; font-weight: bold; color: #38bdf8;">Portfolio URL:</td><td style="padding: 10px;">${portfolioUrl ? `<a href="${portfolioUrl}" target="_blank" style="color: #c084fc;">${portfolioUrl}</a>` : 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; color: #38bdf8;">Resume URL:</td><td style="padding: 10px;">${resumeUrl ? `<a href="${resumeUrl}" target="_blank" style="color: #c084fc;">${resumeUrl}</a>` : 'Attached/Not Provided'}</td></tr>
      </table>

      ${coverLetter ? `
        <div style="margin-top: 20px; background-color: #1e293b; padding: 16px; border-radius: 8px; border-left: 4px solid #38bdf8;">
          <strong style="color: #38bdf8; display: block; margin-bottom: 6px;">Cover Letter:</strong>
          <p style="margin: 0; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${coverLetter}</p>
        </div>
      ` : ''}

      <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">
        WeProvision Hiring Portal • ${new Date().toLocaleString()}
      </p>
    </div>
  `;

  // --- Candidate Confirmation Email HTML ---
  const candidateHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #090613; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #1e1b4b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 2px; margin: 0;">
          WEPROVISION <span style="color: #38bdf8;">CAREERS</span>
        </h1>
      </div>

      <h2 style="color: #34d399; font-size: 18px; margin-top: 0;">Dear ${applicantName},</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Thank you for submitting your application for the position of <strong>${jobTitle}</strong> at WeProvision Infotech!
      </p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Our engineering and talent acquisition team is currently reviewing your profile and credentials. If your qualifications match our current openings, we will contact you directly to schedule an interview.
      </p>

      <div style="border-top: 1px solid #334155; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
        <p style="margin: 0;">We wish you all the best in your career journey!</p>
        <p style="margin: 6px 0 0 0;">&copy; ${new Date().getFullYear()} WeProvision Infotech Careers Team.</p>
      </div>
    </div>
  `;

  await sendMailSafe({
    to: adminEmail,
    subject: `[New Application] ${applicantName} - ${jobTitle}`,
    html: adminHtml,
  });

  if (email && email.includes('@')) {
    await sendMailSafe({
      to: email,
      subject: `Application Received: ${jobTitle} at WeProvision Infotech`,
      html: candidateHtml,
    });
  }
};

/**
 * 3. Send Candidate Application Status Update Email
 */
exports.sendApplicationStatusEmail = async (appData) => {
  const { applicantName, email, jobTitle, status } = appData;
  if (!email || !email.includes('@')) return;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #090613; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #30204a;">
      <h2 style="color: #c084fc; font-size: 18px; margin-top: 0;">Dear ${applicantName},</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        This is an update regarding your application for the <strong>${jobTitle}</strong> position at WeProvision Infotech.
      </p>
      
      <div style="background-color: #170f25; padding: 16px; border-radius: 12px; border: 1px solid #8b5cf6; margin: 20px 0; text-align: center;">
        <span style="font-size: 12px; color: #a855f7; uppercase; font-weight: bold;">Current Application Status</span>
        <h3 style="color: #34d399; font-size: 20px; margin: 6px 0 0 0;">${status}</h3>
      </div>

      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Our team will provide further instructions if next steps are required. Thank you for your continued interest in WeProvision Infotech.
      </p>
    </div>
  `;

  await sendMailSafe({
    to: email,
    subject: `Application Status Update: ${jobTitle} - WeProvision Infotech`,
    html,
  });
};

/**
 * 4. Send Maintenance Mode Subscription Email
 */
exports.sendMaintenanceSubscribeEmail = async (userEmail) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'weprovisioninfotech@gmail.com';

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; border-radius: 12px;">
      <h3 style="color: #f472b6; margin-top: 0;">🔔 New Maintenance Notification Signup</h3>
      <p style="font-size: 14px; color: #cbd5e1;">A user requested to be notified when WeProvision website is back live:</p>
      <p style="font-size: 16px; font-weight: bold; color: #38bdf8;">${userEmail}</p>
    </div>
  `;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; background-color: #090613; color: #f8fafc; padding: 28px; border-radius: 16px; max-width: 550px; margin: 0 auto; border: 1px solid #30204a;">
      <h2 style="color: #c084fc; font-size: 18px; margin-top: 0;">We'll Keep You Posted!</h2>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Thank you for subscribing! You will receive an automated notification as soon as WeProvision Infotech completes its system upgrade and returns live.
      </p>
    </div>
  `;

  await sendMailSafe({
    to: adminEmail,
    subject: `[Maintenance Signup] ${userEmail}`,
    html: adminHtml,
  });

  if (userEmail && userEmail.includes('@')) {
    await sendMailSafe({
      to: userEmail,
      subject: `We'll notify you when WeProvision returns live!`,
      html: userHtml,
    });
  }
};

/**
 * 5. Send Inquiry Reply Email to Client
 */
exports.sendInquiryReplyEmail = async ({ to, clientName, originalSubject, replySubject, replyMessage }) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #090613; color: #f8fafc; padding: 32px; border-radius: 16px; max-width: 620px; margin: 0 auto; border: 1px solid #30204a;">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 1px solid #2e1065; padding-bottom: 16px;">
        <h2 style="color: #c084fc; font-size: 22px; margin: 0; font-weight: 800;">WeProvision Infotech</h2>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Official Inquiry Response</p>
      </div>

      <div style="margin-bottom: 20px;">
        <p style="font-size: 15px; color: #f8fafc; font-weight: 600;">Dear ${clientName || 'Valued Client'},</p>
        <div style="background-color: #170f25; padding: 20px; border-radius: 12px; border-left: 4px solid #a855f7; color: #e2e8f0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${replyMessage}</div>
      </div>

      <div style="background-color: #110c1d; padding: 14px; border-radius: 8px; font-size: 12px; color: #94a3b8; margin-top: 24px;">
        <strong>Original Subject:</strong> ${originalSubject || 'Inquiry'}
      </div>

      <div style="border-top: 1px solid #2e1065; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} WeProvision Infotech. All rights reserved.</p>
        <p style="margin: 4px 0 0 0;">Need further assistance? Reply directly to this email or visit <a href="https://weprovisioninfotech.com" style="color: #c084fc; text-decoration: none;">weprovisioninfotech.com</a></p>
      </div>
    </div>
  `;

  return await sendMailSafe({
    to,
    subject: replySubject || `Re: ${originalSubject || 'Inquiry'}`,
    html,
  });
};

