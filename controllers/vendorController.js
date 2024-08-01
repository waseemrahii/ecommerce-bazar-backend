import Vendor from "../models/vendorModel.js";
import jwt from 'jsonwebtoken';
// Create a new vendor
export const createVendor = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password,  shopName, address } = req.body;
    const vendorImage = req.files['vendorImage'] ? req.files['vendorImage'][0].path : null;
    const logo = req.files['logo'] ? req.files['logo'][0].path : null;
    const banner = req.files['banner'] ? req.files['banner'][0].path : null;

    const vendor = new Vendor({
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      shopName,
      address,
      vendorImage,
      logo,
      banner,
      status: 'pending', // Set default status to pending
    });


    await vendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Create a new vendor registration

export const registerVendor = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password,  shopName, address } = req.body;

    const vendorImage = req.files['vendorImage'] ? req.files['vendorImage'][0].path : null;
    const logo = req.files['logo'] ? req.files['logo'][0].path : null;
    const banner = req.files['banner'] ? req.files['banner'][0].path : null;
    const newVendor = new Vendor({
      firstName,
      lastName,
      phoneNumber,
      email,
      password, // Save the plain text password directly
      shopName,
      address,
      vendorImage,
      logo,
      banner,
      status: 'pending', // Set default status to pending
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Vendor login
export const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find vendor by email
    const vendor = await Vendor.findOne({ email });

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const isPasswordCorrect = password === vendor.password;
    console.log("Password comparison result:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: vendor.email, id: vendor._id },
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_ACCESS_TIME } 
    );

    // Send successful response with token and vendor data
    res.status(200).json({ result: vendor, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};
// Update vendor status
export const updateVendorStatus = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, { status }, { new: true });

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor status updated successfully', vendor: updatedVendor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete vendor by ID
export const deleteVendor = async (req, res) => {
	try {
	  const { vendorId } = req.params;
  
	  const deletedVendor = await Vendor.findByIdAndDelete(vendorId);
  
	  if (!deletedVendor) {
		return res.status(404).json({ message: 'Vendor not found' });
	  }
  
	  res.json({ message: 'Vendor deleted successfully' });
	} catch (error) {
	  res.status(400).json({ error: error.message });
	}
  };