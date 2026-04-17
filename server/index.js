// Importing necessary modules and packages
const dotenv = require("dotenv");

// Loading environment variables from .env file — must be first
dotenv.config();

const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const maintenanceRoutes = require("./routes/Maintenance");
const analyticsRoutes = require("./routes/Analytics");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const os = require("os");
const userAgent = require('express-useragent')
var morgan = require('morgan')

// Setting up port number
const PORT = process.env.PORT || 4000;

// Trust Render/Vercel/Railway reverse proxy — required for express-rate-limit to work correctly
app.set("trust proxy", 1);

// Connecting to database
database.connect();

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5173",
			process.env.FRONTEND_URL,
		].filter(Boolean),
		credentials: true,
	})
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(userAgent.express())
app.use(morgan("dev"));

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: os.tmpdir(),
	})
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/maintenance", maintenanceRoutes);
app.use("/api/v1/analytics",  analyticsRoutes);

// Testing the server
app.get("/", (req, res) => {
	return res.json({
		success: true,
		message: "Your server is up and running ...",
	});
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	customCss: `
		.swagger-ui .topbar { display: none }
		.swagger-ui .info .title { font-size: 2.5em; }
	`,
	customSiteTitle: "StudyNotion API Docs",
}));

// API Documentation JSON endpoint
app.get("/api-docs.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
