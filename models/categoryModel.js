import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide category."],
			unique: true,
		},
		logo: {
			type: String,
			required: [true, "Please provide logo."],
		},
		priority: Number,
		slug: string,
	},
	{
		timestamps: true,
	}
);

categorySchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
