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
const notificationRoutes = require("./routes/Notification");
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

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5173",
	process.env.FRONTEND_URL,
].filter(Boolean);

console.log("CORS allowed origins:", allowedOrigins);

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (Postman, curl, server-to-server)
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			console.error(`CORS blocked origin: ${origin}`);
			return callback(new Error(`CORS policy: origin ${origin} not allowed`));
		},
		credentials: true,
	})
);

// Middlewares
app.use(express.json());
app.use(cookieParser());
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());
app.use(userAgent.express())
app.use(morgan("dev"));

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: os.tmpdir(),
		limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
		abortOnLimit: true,
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
app.use("/api/v1/notifications", notificationRoutes);

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
const server = app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});
// Allow up to 10 minutes for large video uploads
server.timeout = 600000;

// End of code.
