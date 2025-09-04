const mongoose = require("mongoose");

const DB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.error(" DB not connect", err.message);
    process.exit(1); 
  }
};

module.exports = DB;
