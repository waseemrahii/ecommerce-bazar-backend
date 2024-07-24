// models/Banner.js
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    bannerType: { type: String, required: true },
    resourceType: { type: String, enum: ['product', 'category','brand'], required: true },
    resourceId: { type: String },
    url: { type: String, required: true },
    bannerImage: { type: String, required: true }, // Store image URL or path
    publish: { type: Boolean, default: false } // Add publish field
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
