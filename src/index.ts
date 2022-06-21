import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cloudinary from "cloudinary";
dotenv.config({ path: path.join(__dirname, "./.env") });
import cookieParser from "cookie-parser"

import userRoutes from "./routes/userRoutes";
import sampleRoutes from "./routes/sampleRoutes";
import database from "./database";
import swaggerOptions from "./swaggerOptions";
import User from "./models/userModel";
import Sample from "./models/sampleModel";
import { signIn } from "./utiles/authGuard";

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
console.log(path.join(__dirname , './../public'));

app.use( "/statics",express.static(path.join(__dirname , './../public')));
app.set('view engine', 'ejs');
app.set('views', path.join(path.join(__dirname , './../views')));
app.use(cookieParser());
database();
router.use("/users", userRoutes);
router.use("/samples", sampleRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/v1", router);

app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    status: "failed",
    message: err.message,
  });
});


// set the view engine to ejs
// admin dashboard route


app.get('/admin',async function(req, res) {
  if(!req.cookies.token) return res.redirect('/admin/login');
  const usersArray = await User.find()
  const samples = await Sample.find({tested : {$not :{$eq : true}}}).count()
  const samplesArray = await Sample.find()
  const testedSamples = await Sample.find({tested : true ,verified : true}).count()
  const negativeSamples = await Sample.find({tested : {$not :{$eq : true}} , covid : false}).count()
  const positiveSamples = await Sample.find({tested : {$not :{$eq : true}} , covid : true}).count()
  res.render('index' , {
    users : usersArray.length,
    samples,
    testedSamples,
    totalSamples : testedSamples+samples,
    negativeSamples,
    positiveSamples,
    samplesArray,
    usersArray
  });
});

app.get('/admin/samples',async function(req, res) {
  if(!req.cookies.token) return res.redirect('/admin/login');
  const samples = await Sample.find({tested : {$not :{$eq : true}}})
  const testedSamples = await Sample.find({tested : true ,verified : true})

  res.render('samples' , {
    samples : [...samples , ...testedSamples]
  });
});

app.get('/admin/login',async function(req, res) {
  res.render('login' , {
    message : ""
  });
});
app.get("/admin/logout",async function(req, res) {
  res.cookie("token" , "")
  res.redirect('/admin/login');
});
app.post('/admin/login',async function(req, res) {
  const user = await User.findOne({number : req.body.number.trim()})
  if (!user || !(await user.matchPassword(req.body.password))) {
    return res.render('login' , {
      message : "Number Or Password Are Incorrect!!"
    });
  }
  const token = signIn(user.id);
  res.cookie("token" , token)
  res.redirect('/admin');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
