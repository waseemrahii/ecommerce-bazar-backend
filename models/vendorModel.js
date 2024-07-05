import { Schema, model } from "mongoose";

const vendorSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Vendor = model("vendor", vendorSchema);

export default Vendor;
