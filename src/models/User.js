import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

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

const User = mongoose.model("User", userSchema);

export default User;
