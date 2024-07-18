// import Category from "../models/categoryModel.js";
// import {
// 	createOne,
// 	deleteOne,
// 	getAll,
// 	getOne,
// 	updateOne,
// } from "./handleFactory.js";

// export const createCategory = createOne(Category);
// export const getCategories = getAll(Category);
// export const getCategory = getOne(Category);
// export const deleteCategory = deleteOne(Category);
// export const updateCategory = updateOne(Category);



// new
import Category from "../models/categoryModel.js";
import fs from "fs";
import path from "path";
import slugify from "slugify";

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, priority } = req.body;
        const logo = req.file ? req.file.filename : null;
        const slug = slugify(name, { lower: true });

        const category = new Category({ name, logo, priority, slug });
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Get a single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
    try {
        const { name, priority } = req.body;
        const logo = req.file ? req.file.filename : req.body.logo;
        const slug = slugify(name, { lower: true });

        const category = await Category.findByIdAndUpdate(req.params.id, { name, logo, priority, slug }, {
            new: true,
            runValidators: true,
        });

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        if (category.logo) {
            fs.unlinkSync(path.join("uploads", category.logo));
        }

        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};


// Get category by slug
export const getCategoryBySlug = async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};