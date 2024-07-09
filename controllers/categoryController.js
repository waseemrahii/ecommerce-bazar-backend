import Category from "../models/categoryModel.js";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./handleFactory.js";

export const createCategory = createOne(Category);
export const getCategories = getAll(Category);
export const getCategory = getOne(Category);
export const deleteCategory = deleteOne(Category);
export const updateCategory = updateOne(Category);
