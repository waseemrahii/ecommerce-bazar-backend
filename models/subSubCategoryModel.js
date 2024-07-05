import mongoose from "mongoose";
import slugify from "slugify";

const subSubCategorySchema = new mongoose.Schema(
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
		subCategory: {
			type: mongoose.Types.ObjectId,
			required: [true, "Please provide sub category."],
			ref: "SubCategory",
		},
		priority: Number,
		slug: string,
	},
	{
		timestamps: true,
	}
);

subSubCategorySchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

const SubSubCategory = mongoose.model("subSubCategory", subSubCategorySchema);

export default SubSubCategory;
