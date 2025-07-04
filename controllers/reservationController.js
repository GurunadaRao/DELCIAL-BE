import Reservation from "../models/reservationModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 🛜 Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // delicial4578@gmail.com
    pass: process.env.EMAIL_PASS, // App password
  },
});

export const createReservation = async (req, res) => {
  try {
    const {
      restaurant,
      name,
      email,
      phone,
      date,
      time,
      people,
      specialRequest,
    } = req.body;

    const reservation = new Reservation({
      restaurant,
      name,
      email,
      phone,
      date,
      time,
      guests: people,
      requests: specialRequest,
    });

    await reservation.save();
    console.log("✅ Reservation saved:", reservation);

    // 💌 Email content
    const userMail = {
      from: `"Delicial 🍲" <${process.env.EMAIL_USER}>`,
      to: reservation.email,
      subject: "🍽️ Your Reservation at Delicial is Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; background: #fffaf5; padding: 20px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #ffdbb5;">
          <div style="text-align: center;">
            <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFU1wrMmUqiDfqCLCwoIi87VSKnR7KxrTmWBaP8NU76VfoLgcrFpFmYzZmCi_0i1wKp1e3mIBwvtWvWBeAdLYAtNo-bNKI3NmK4x6Itky-noRWw8TYZm4NnezxEgTTuYw9hpoEZ25Bo9rnY2geS12YWFUH-V3MuAEKqoUo8n4VZGQydai5YT_Ei9kIW3E/s320/Sophisticated%20Restaurant%20Logo%20-%20Letter%20'D'.png" alt="Delicial Logo" style="height: 60px; margin-bottom: 10px;" />
            <h2 style="color: #d63636;">Reservation Confirmed!</h2>
          </div>

          <p>Hey <strong>${reservation.name}</strong>,</p>
          <p>Your reservation at <strong>${reservation.restaurant}</strong> is confirmed 🎉</p>

          <table style="width: 100%; margin-top: 10px; margin-bottom: 20px; font-size: 15px;">
            <tr><td><strong>Date:</strong></td><td>${reservation.date}</td></tr>
            <tr><td><strong>Time:</strong></td><td>${reservation.time}</td></tr>
            <tr><td><strong>Guests:</strong></td><td>${reservation.guests}</td></tr>
            <tr><td><strong>Phone:</strong></td><td>${reservation.phone}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${reservation.email}</td></tr>
            <tr><td><strong>Special Requests:</strong></td><td>${reservation.requests || "None"}</td></tr>
            <tr><td><strong>Pre-reservation Fee:</strong></td><td>₹60 (will be adjusted in bill)</td></tr>
          </table>

          <p style="margin-bottom: 25px;">We’ll hold your table for 15 minutes after your selected time. Please try to be on time 😄</p>

          <div style="text-align: center;">
            <p style="font-weight: bold; color: #333;">Thank you for choosing <span style="color: #d63636;">Delicial</span> 💖</p>
            <p style="font-size: 13px; color: #888;">For any queries, contact us at <a href="mailto:delicial4578@gmail.com">delicial4578@gmail.com</a></p>
          </div>
        </div>
      `,
    };

    const adminMail = {
      from: `"Delicial Booking Bot 🤖" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: `📥 New Reservation by ${reservation.name}`,
      html: `
        <div style="font-family: Arial; padding: 20px; background-color: #fff3f3; border: 1px solid #f8caca; border-radius: 10px; max-width: 600px; margin: auto;">
          <h2>🔔 New Reservation Alert</h2>
          <ul style="line-height: 1.6;">
            <li><strong>Name:</strong> ${reservation.name}</li>
            <li><strong>Email:</strong> ${reservation.email}</li>
            <li><strong>Phone:</strong> ${reservation.phone}</li>
            <li><strong>Restaurant:</strong> ${reservation.restaurant}</li>
            <li><strong>Date:</strong> ${reservation.date}</li>
            <li><strong>Time:</strong> ${reservation.time}</li>
            <li><strong>Guests:</strong> ${reservation.guests}</li>
            <li><strong>Requests:</strong> ${reservation.requests || "None"}</li>
            <li><strong>Prepaid:</strong> ₹60</li>
          </ul>
          <p style="margin-top: 10px;">📩 Auto-generated by Delicial system.</p>
        </div>
      `,
    };

    const [userSent, adminSent] = await Promise.all([
      transporter.sendMail(userMail),
      transporter.sendMail(adminMail),
    ]);

    console.log("📤 Emails sent to user & admin");
    res.status(201).json({
      message: "Reservation successfully created and emails sent!",
      data: reservation,
    });
  } catch (err) {
    console.error("❌ Server Error (createReservation):", err.message);
    res.status(500).json({
      message: "Internal server error. Reservation could not be created.",
    });
  }
};

export const cancelReservation = (req, res) => {
  res.send("Cancel reservation not implemented yet.");
};
