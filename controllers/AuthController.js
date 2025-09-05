const User = require("../models/User.Schema");
const sendEmail = require("../config/email"); // helper funksiyamiz

const UserReg = async (req, res) => {
  try {
    const { fullName, phone, email, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
 
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
      password:hashedPassword,
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

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Email orqali foydalanuvchini topamiz
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Bunday foydalanuvchi topilmadi ❌" });
    }

    // 2. Email tasdiqlanganmi?
    if (!user.isVerified) {
      return res.status(400).json({ message: "Email tasdiqlanmagan ❌" });
    }

    // 3. Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Parol noto‘g‘ri ❌" });
    }

   
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Muvaffaqiyatli login ✅",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi ❌" });
  }
};





module.exports = { UserReg,VerifyCode,Login };
