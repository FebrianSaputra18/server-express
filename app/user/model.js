const mongoose = require("mongoose");
const { model, Schema } = mongoose;
// const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Name is not empty"],
      maxLength: [
        255,
        "Maximum length of the name is not exceed 255 characters",
      ],
      minLength: [3, "Minimum length of the name is not exceed 3 characters"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email is not empty"],
      maxLength: [
        255,
        "Maximum length of the email is not exceed 255 characters",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is not empty"],
      maxLength: [
        255,
        "Maximum length of the password is not exceed 255 characters",
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  attr => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      // pencarian ke collection USer berdasarkan `email`
      const count = await this.model("User").count({ email: value });
      // kode ini mengindikasikan bahwa jika user ditemukan akan mengembalikan `false` jika tidak ditemukan mengembalikan ` true`
      // jika ` false` maka validation gagal
      // jika ` true` maka validation berhasil

      return !count;
    } catch (err) {
      throw err;
    }
  },
  attr => `${attr.value} sudah terdaftar`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

// userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("User", userSchema);
