
import SubCategory from "../models/subCategoryModel.js";
import Category from "../models/categoryModel.js";
import slugify from "slugify";

// Create a new subcategory
export const createSubCategory = async (req, res) => {
  try {
    const { name, mainCategory, priority } = req.body;

    // Check if mainCategory exists
    const category = await Category.findById(mainCategory);
    if (!category) {
      return res.status(400).json({ message: "Main category not found." });
    }
    const newSubCategory = new SubCategory({
      name,
      mainCategory,
      priority,
      slug: slugify(name, { lower: true })
    });

    const savedSubCategory = await newSubCategory.save();
    res.status(201).json(savedSubCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all subcategories with counts per main category
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("mainCategory", "name");
    const subCategoriesCount = await SubCategory.countDocuments();
    
    // Get the count of subcategories grouped by main category
    const counts = await SubCategory.aggregate([
      { $group: { _id: "$mainCategory", count: { $sum: 1 } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "mainCategory" } },
      { $unwind: "$mainCategory" },
      { $project: { _id: 0, mainCategory: "$mainCategory.name", count: 1 } }
    ]);

    res.status(200).json({ subCategories, total: subCategoriesCount, counts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a subcategory by ID
export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate("mainCategory", "name");
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a subcategory by slug
export const getSubCategoryBySlug = async (req, res) => {
  try {
    const subCategory = await SubCategory.findOne({ slug: req.params.slug }).populate("mainCategory", "name");
    if (!subCategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a subcategory by ID
export const updateSubCategoryById = async (req, res) => {
  try {
    const { name, mainCategory, priority } = req.body;

    // Check if mainCategory exists
    const category = await Category.findById(mainCategory);
    if (!category) {
      return res.status(400).json({ message: "Main category not found." });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        name,
        mainCategory,
        priority,
        slug: slugify(name, { lower: true })
      },
      { new: true, runValidators: true }
    ).populate("mainCategory", "name");

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a subcategory by ID
export const deleteSubCategoryById = async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }
    res.status(200).json({ message: "Subcategory deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Get subcategories by main category slug
export const getSubCategoriesByMainCategorySlug = async (req, res) => {
	try {
	  const mainCategorySlug = req.params.slug;
  
	  // Find the main category by slug
	  const mainCategory = await Category.findOne({ slug: mainCategorySlug });
  
	  if (!mainCategory) {
		return res.status(404).json({ message: "Main category not found." });
	  }
  
	  // Find subcategories by main category ID
	  const subCategories = await SubCategory.find({ mainCategory: mainCategory._id });
  
	  res.status(200).json(subCategories);
	} catch (error) {
	  res.status(400).json({ message: error.message });
	}
  };