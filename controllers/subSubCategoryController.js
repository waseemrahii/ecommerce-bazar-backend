import SubSubCategory from "../models/subSubCategoryModel.js";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./handleFactory.js";

export const createSubSubCategory = createOne(SubSubCategory);
export const getSubSubCategories = getAll(SubSubCategory);
export const getSubSubCategory = getOne(SubSubCategory);
export const deleteSubSubCategory = deleteOne(SubSubCategory);
export const updateSubSubCategory = updateOne(SubSubCategory);
