const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  googleID:{
    type:String
  },
  facebookID:{
    type:String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema,"MERN");
//524078277234-2es1eicloqai5g0liv1vnk1sld2ueave.apps.googleusercontent.com
//-woIP07QSSQZNCdipxku88J6