import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cloudinary from "cloudinary";

dotenv.config({ path: path.join(__dirname, "./.env") });

import userRoutes from "./routes/userRoutes";
import sampleRoutes from "./routes/sampleRoutes";
import database from "./database";
import swaggerOptions from "./swaggerOptions";

const app = express();
const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const port = process.env.PORT || 3000;
database();
router.use("/users", userRoutes);
router.use("/samples", sampleRoutes);

app.use("/api/v1", router);
app.use((err:any, req:any, res:any, next:any) => {
  res.status(500).json({
    status: "failed",
    message: err.message,
    
    })
  }
    );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
