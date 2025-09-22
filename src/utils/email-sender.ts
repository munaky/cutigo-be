import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

function formatDate(dateStr: string): string {
  const days = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu",
  ];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  if (!dateStr) return "";

  // Normalize: PostgreSQL can return with " " instead of "T"
  const [datePart] = dateStr.replace(" ", "T").split("T");
  if (!datePart) return "";

  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return "";

  let month = m;
  let year = y;
  if (month < 3) {
    month += 12;
    year -= 1;
  }
  const q = d;
  const K = year % 100;
  const J = Math.floor(year / 100);

  const h =
    (q +
      Math.floor((13 * (month + 1)) / 5) +
      K +
      Math.floor(K / 4) +
      Math.floor(J / 4) +
      5 * J) %
    7;

  const weekdayIndex = (h + 6) % 7;

  return `${days[weekdayIndex]}, ${d} ${months[m - 1]} ${y}`;
}


export const sendEmail = async (leaveRequest: any) => {
  const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `CutiGo <${process.env.ADMIN_EMAIL}>`,
    to: leaveRequest?.User?.email,
    subject: 'CutiGo - Leave Request Notification',
    html: ` 
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Leave Request Notification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #ddd;">
    <tr>
      <td style="background-color:#4A90E2; color:#ffffff; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
        Leave Request Notification
      </td>
    </tr>
    <tr>
      <td style="padding:20px; color:#333333; font-size:14px; line-height:1.5;">
        <p>Hello <b>${leaveRequest.User.name}</b>,</p>
        <p>Your leave request with the following details:</p>
        <table width="100%" cellpadding="5" cellspacing="0" style="border-collapse: collapse; margin: 10px 0;">
          <tr>
            <td style="border:1px solid #ddd; background:#f9f9f9;">Request Date</td>
            <td style="border:1px solid #ddd;">${formatDate(leaveRequest.createdAt)}</td>
          </tr>
          <tr>
            <td style="border:1px solid #ddd; background:#f9f9f9;">Leave Period</td>
            <td style="border:1px solid #ddd;">${formatDate(leaveRequest.startDate)} - ${formatDate(leaveRequest.endDate)}</td>
          </tr>
        </table>
        <p>The status of your request is:</p>
        
        ${leaveRequest.status === 'APPROVED' ? `
        <div style="background:#e6f9f0; color:#2e7d32; padding:15px; border:1px solid #2e7d32; border-radius:6px; text-align:center; font-weight:bold;">
          APPROVED
        </div>
        ` : `
        <div style="background:#fdecea; color:#c62828; padding:15px; border:1px solid #c62828; border-radius:6px; text-align:center; font-weight:bold;">
          REJECTED
        </div>
        `}

        <p style="margin-top:20px;">Thank you,<br>HR Department</p>
      </td>
    </tr>
  </table>

</body>
</html>

    `
    });
}
