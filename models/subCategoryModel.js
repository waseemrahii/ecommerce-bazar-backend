import mongoose from "mongoose";
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide category."],
			unique: true,
		},
		mainCategory: {
			type: mongoose.Types.ObjectId,
			required: [true, "Please provide main category."],
			ref: "Category",
		},
		priority: Number,
		slug: string,
	},
	{
		timestamps: true,
	}
);

subCategorySchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
