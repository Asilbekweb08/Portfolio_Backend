const User = require("../models/User.Schema");
const sendEmail = require("../config/email"); // helper funksiyamiz

const UserReg = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;

 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Bu email bilan ro'yxatdan o'tilgan" });
    }


    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // yangi user yaratamiz
    const newUser = new User({
      fullName,
      phone,
      email,
      password,
      isVerified: false,
      verificationCode,
    });

    await newUser.save();

    // emailga yuborish
    await sendEmail(
      email,
      "Email Verification",
      `Assalomu alaykum ${fullName},\n\nSizning tasdiqlash kodingiz: ${verificationCode}`
    );

    res.json({
      message: "Ro‘yxatdan o‘tildi ✅, emailga tasdiqlash kodi yuborildi 📩",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { UserReg };
