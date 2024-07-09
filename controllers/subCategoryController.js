import SubCategory from "../models/subCategoryModel.js";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./handleFactory.js";

export const createSubCategory = createOne(SubCategory);
export const getSubCategories = getAll(SubCategory);
export const getSubCategory = getOne(SubCategory);
export const deleteSubCategory = deleteOne(SubCategory);
export const updateSubCategory = updateOne(SubCategory);
