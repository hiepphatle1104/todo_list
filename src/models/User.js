import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/errorHandler.js";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		minlength: 3,
		unique: true,
	},

	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		minlength: 6,
	},
});

// Hash password
userSchema.pre("save", async function (next) {
	// A: old data | B: new data
	// If data B != A => hash
	// Else next()
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password);
	if (!isMatch) throw new AppError("Invalid credentials!", 400);
};

// Create token
userSchema.methods.createToken = function () {
	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

const User = model("User", userSchema);

export default User;
