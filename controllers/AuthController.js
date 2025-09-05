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

    
    const newUser = new User({
      fullName,
      phone,
      email,
      password,
      isVerified: false,
      verificationCode,
    });

    await newUser.save();

    
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
// const User = require("../models/User.Schema");

const VerifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email va kod kerak" });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Kod noto‘g‘ri" });
    }

   
    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({ message: "Email muvaffaqiyatli tasdiqlandi ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

module.exports = { VerifyCode };


module.exports = { UserReg,VerifyCode };
