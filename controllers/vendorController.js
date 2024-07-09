import Vendor from "../models/vendorModel.js";
import {
	createOne,
	deleteOne,
	getAll,
	getOne,
	updateOne,
} from "./handleFactory.js";

export const createVendor = createOne(Vendor);
export const getVendors = getAll(Vendor, { path: "bankDetails" });
export const getVendor = getOne(Vendor, { path: "bankDetails" });
export const deleteVendor = deleteOne(Vendor);
export const updateVendor = updateOne(Vendor);
