import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const vendorSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, "Please tell us your name."],
		},
		lastName: {
			type: String,
		},
		email: {
			type: String,
			required: [true, "Please provide your email address."],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Please provide a valid email address."],
		},
		phoneNumber: {
			type: String,
			unique: true,
		},
		image: {
			type: String,
		},
		shopName: {
			type: String,
			required: [true, "Please provide shop name."],
			unique: true,
		},
		shopAddress: {
			type: String,
			reuqired: [true, "Please provide shop address."],
		},
		logo: {
			type: String,
			// required: [true, 'Please provide shop logo.']
		},
		banner: {
			type: String,
			// required: [true, 'Please provide shop banner.']
		},
		role: {
			type: String,
			enum: ["vendor"],
			default: "vendor",
		},
		password: {
			type: String,
			required: [true, "Please provide a password."],
			minlength: 8,
			select: false,
		},
	},
	{
		timestamps: true,
	}
);

// Virtual populate to get bank details belong to specific vendor id
vendorSchema.virtual("bankDetails", {
	ref: "VendorBank",
	foreignField: "vendorId",
	localField: "_id",
	justOne: true, // Set justOne to true to get a single document instead of an array
});

vendorSchema.methods.correctPassword = async function (
	candidatePassword,
	vendorPassword
) {
	return await bcrypt.compare(candidatePassword, vendorPassword);
};

vendorSchema.pre("save", async function (next) {
	// Only work when the password is not modified
	if (!this.isModified("password")) return next();

	// Hash the password using cost of 12
	this.password = await bcrypt.hash(this.password, 12);

	next();
});

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;
