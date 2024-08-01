import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import globalErrorHandler from "./controllers/errorController.js";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// ROUTES
<<<<<<< HEAD

=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
import userRoutes from "./routes/userRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import brandsRoutes from "./routes/brandRoutes.js";
<<<<<<< HEAD
=======

>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import subSubCategoryRoutes from "./routes/subSubCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import colorRoutes from "./routes/colorRoutes.js";
import whishlist from "./routes/wishlistRoutes.js";
import banner from "./routes/bannerRoutes.js";
import flashDeal from "./routes/flashDealRoutes.js";
import dealOfDay from "./routes/dealOfTheDayRoutes.js";
import featuredeal from "./routes/featureDealRoutes.js";
import oderRoutes from "./routes/orderRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import attributeRoutes from "./routes/attributeRoutes.js";
import coupons from "./routes/couponRoutes.js";
<<<<<<< HEAD
import subscriber from "./routes/subscriberRoutes.js";
import notification from "./routes/notificationRoutes.js";
import { sendErrorResponse } from "./utils/responseHandler.js";
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();

// app.use(cors({
//   origin: ['http://localhost:5173','http://localhost:5174',
//      'https://baaazaaradmin.ecommercebaazaar.com/', 
//      'https://ecommercebaazaar.com/'],
//   credentials: true,
// }));


app.use(cors({
  origin: '*',  
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Developing logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
<<<<<<< HEAD
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/sub-categories", subCategoryRoutes);
app.use("/api/sub-sub-categories", subSubCategoryRoutes);
<<<<<<< HEAD
=======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a
app.use("/api/products", productRoutes);

app.use('/api/attributes', attributeRoutes);
app.use("/api/orders", oderRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/whishlist", whishlist);
app.use("/api/banner", banner);
app.use("/api/flash-deals", flashDeal);
app.use("/api/deal-of-day", dealOfDay);
app.use("/api/feature-deals", featuredeal);
app.use("/api/coupons", coupons );
<<<<<<< HEAD
app.use("/api/subscribers", subscriber );
app.use("/api/notification",notification  );
=======
>>>>>>> f84ca444dffd3233b0b3d8ce37fa495e41d1c89a



app.use("/", (req, res) => {
  res.send("Ecommerce Bazaar API is Running");
});

// Unhandled Routes Handling Middleware
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
