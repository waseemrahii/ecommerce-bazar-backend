
import SubSubCategory from "../models/subSubCategoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Category from "../models/categoryModel.js";
import slugify from "slugify";
import asyncHandler from "express-async-handler";

export const createSubSubCategory = async (req, res) => {
	try {
	  const { name, mainCategory: mainCategorySlug, subCategory, priority } = req.body;
  
	  // Find main category by slug
	  const mainCategory = await Category.findOne({ slug: mainCategorySlug });
	  if (!mainCategory) {
		return res.status(400).json({
		  status: 'fail',
		  message: 'Main category not found.',
		});
	  }
  
	  // Create new sub-subcategory using the Object ID of the main category
	  const newSubSubCategory = new SubSubCategory({
		name,
		mainCategory: mainCategory._id, // Use the Object ID
		subCategory, // Ensure this is the Object ID of the subcategory
		priority,
	  });
  
	  // Save to database
	  await newSubSubCategory.save();
  
	  res.status(201).json({
		status: 'success',
		data: newSubSubCategory,
	  });
	} catch (error) {
	  res.status(400).json({
		status: 'fail',
		message: error.message,
	  });
	}
  };
  

// Get all sub-subcategories
export const getAllSubSubCategories = asyncHandler(async (req, res) => {
  const subSubCategories = await SubSubCategory.find().populate("mainCategory subCategory", "name");
  const subSubCategoriesCount = await SubSubCategory.countDocuments();

  // Get the count of sub-subcategories grouped by main category and sub category
  const counts = await SubSubCategory.aggregate([
    { $group: { _id: "$subCategory", count: { $sum: 1 } } },
    { $lookup: { from: "subcategories", localField: "_id", foreignField: "_id", as: "subCategory" } },
    { $unwind: "$subCategory" },
    { $project: { _id: 0, subCategory: "$subCategory.name", count: 1 } },
  ]);

  res.status(200).json({ subSubCategories, total: subSubCategoriesCount, counts });
});

// Get a sub-subcategory by ID
export const getSubSubCategoryById = asyncHandler(async (req, res) => {
  const subSubCategory = await SubSubCategory.findById(req.params.id).populate("mainCategory subCategory", "name");
  if (!subSubCategory) {
    return res.status(404).json({ message: "Sub-subcategory not found." });
  }
  res.status(200).json(subSubCategory);
});

// Get a sub-subcategory by slug
export const getSubSubCategoryBySlug = asyncHandler(async (req, res) => {
  const subSubCategory = await SubSubCategory.findOne({ slug: req.params.slug }).populate("mainCategory subCategory", "name");
  if (!subSubCategory) {
    return res.status(404).json({ message: "Sub-subcategory not found." });
  }
  res.status(200).json(subSubCategory);
});

// Update a sub-subcategory by ID
export const updateSubSubCategoryById = asyncHandler(async (req, res) => {
  const { name, mainCategory, subCategory, priority } = req.body;

  // Check if mainCategory exists
  const category = await Category.findById(mainCategory);
  if (!category) {
    return res.status(400).json({ message: "Main category not found." });
  }

  // Check if subCategory exists
  const subCat = await SubCategory.findById(subCategory);
  if (!subCat) {
    return res.status(400).json({ message: "Subcategory not found." });
  }

  const updatedSubSubCategory = await SubSubCategory.findByIdAndUpdate(
    req.params.id,
    {
      name,
      mainCategory,
      subCategory,
      priority,
      slug: slugify(name, { lower: true }),
    },
    { new: true, runValidators: true }
  ).populate("mainCategory subCategory", "name");

  if (!updatedSubSubCategory) {
    return res.status(404).json({ message: "Sub-subcategory not found." });
  }

  res.status(200).json(updatedSubSubCategory);
});

// Delete a sub-subcategory by ID
export const deleteSubSubCategoryById = asyncHandler(async (req, res) => {
  const deletedSubSubCategory = await SubSubCategory.findByIdAndDelete(req.params.id);
  if (!deletedSubSubCategory) {
    return res.status(404).json({ message: "Sub-subcategory not found." });
  }
  res.status(200).json({ message: "Sub-subcategory deleted successfully." });
});


// Get sub-subcategories by subcategory slug
export const getSubSubCategoriesBySubCategorySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Find the subcategory by slug
  const subCategory = await SubCategory.findOne({ slug });
  if (!subCategory) {
    return res.status(404).json({ message: "Subcategory not found." });
  }

  // Find all sub-subcategories associated with the found subcategory
  const subSubCategories = await SubSubCategory.find({ subCategory: subCategory._id }).populate("mainCategory", "name");

  res.status(200).json({
    status: 'success',
    data: subSubCategories,
  });
});
