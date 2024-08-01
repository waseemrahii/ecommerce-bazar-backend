import mongoose from "mongoose";
import slugify from "slugify";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide brand."],
      unique: true,
    },
 
	thumbnail: { type: String },
    imageAltText: {
      type: String,
      required: [true, "Please provide image alt text."],
    },
<<<<<<< HEAD
    status: {
			type: String,
			enum: ["active", "inactive"],
			default: "inactive",
		},
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
    slug: String,
  },
  {
    timestamps: true,
  }
);

brandSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
