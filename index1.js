import express from "express";
// import fs from 'fs';
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bycrpt from 'bcrypt';

// if not connected go to bin folder open cmd and get the ip address
mongoose
  .connect("mongodb://localhost:27017", {
    dbName: "Backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

// const UserSchema = new mongoose.Schema({
//   name:"String",
//   email:"String",
//   PhoneNo:"Number"
// })

// const User = mongoose.model("User",UserSchema);

const UserSchema = new mongoose.Schema({
  name: "String",
  Email: "String",
  PhoneNo: "Number",
  password: "String", // Corrected field name to match the schema
});

const User = mongoose.model("User", UserSchema);
const app = express();

// resolve hamra poora directory ka path de deta hai
// par issse kaam nahi yeh ek middleware  hai
// middle ware gtab kaam ata like sign up kara next time direct main page
//dikhe consisting of 3 params req,res,next next goes to new home if done
app.use(express.static(path.join(path.resolve(), "public")));
//acess the body of the req buy this
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Temporaray database
// const users = [];
//Setting up ejs engine
console.log(path.join(path.resolve(), "public"));
app.set("view engine", "ejs");

// app.get("/getProducts", (req, res) => {
//   res.json({
//     sucess: true,
//     products: [],
//   });
// });

// yeh token wala middle ware hai ab
// const isAuthnicated = async (req, res, next) => {
//   const { Token } = req.cookies;
//   if (Token) {
//     // res.render('logout')
//     // call next before or it will cause the error in setting headers
//     // as multiple rendering in one res
//     const decoded = jwt.verify(Token, "absciubob");

//     // ab token hai tabhi value hoon iske liye
//      req.user = await User.findById(decoded._id);
//     // agle handler pai chala jata hai
//     next();
//   } else {
//     res.render("login");
//   }

// };
const isAuthnicated = async (req, res, next) => {
  const { Token } = req.cookies;
  if (!Token) {
    // redirect isliye kyuki isAuthticated will work taki user logout page na jaye bina login ke
    res.redirect("/login");
  } else {
    const decoded = jwt.verify(Token, "absciubob");
    console.log(decoded);

    const user = await User.findById(decoded._id);

    req.user = user;
    next();
  }
};

app.get("/", isAuthnicated, (req, res) => {
  res.render("logout", { name: req.user.name });
});
app.get("/register", (req, res) => {
  res.render("resgister");
});
// app.get("/",isAuthnicated, (req, res) => {
//   // res.json({
//   //     sucess:true,
//   //     products:[]
//   // });
//   //     // res.status(404).send("damn bro!!")
//   //     const file = fs.readFileSync('./index.html');
//   //     //file ko bhejna hai par fs se nahi hoga toh file as varibale nahi bhej skte toh
//   //     //path ko import karow
//   //     //__dirname tabhi kaam karega if we are using a commmonjs
//   //     // ye absolute path de dega infinite loop on commenting res.sendFile(file)
//   //    const pathLocation = path.resolve();
//   //    res.sendFile(path.join(pathLocation,'./index.html'))
//   // res.sendFile(file)
//   // ab humme koi random name show karna hai like making the html thing a varibale
//   // it will change for every person here we need html template
//   const { Token } = req.cookies;
//   if (!Token) {
//     res.render("login");
//     console.log(Token);
//   } else {
//     res.render("logout");
//     console.log(Token);
//   }
//   console.log(Token);
//   // console.log(token);
//   // }
//   // Cant see the cookies by normal method need something so use cookie-parser
//   // ab mujhe static pages like html and css file acess kaise karu??
//   //create a folder called public use express.static( aur yaha path dalo)
//   // res.sendFile('index')
// });

// app.post("/contact", async (req, res) => {
//   console.log("Button Clicked");
//   console.log(req.body);
//   // users.push({ name: req.body.name, email: req.body.email });
//   const {name,email} = req.body;
//   await Message.create({name:name,email:email});
//   // await Message.create({name,email});
//     res.render("Sucess");
// //   res.redirect("Sucess");
//   // isse button click karne pai get nahi kar payega we have to make app.get for this and res.render("sucess")
// });
// app.get('/users',(req,res)=>{
//     res.json({
//         users,
//     })
// })

// app.get('/add',async (req,res)=>{
//   await Message.create({name:"Rohan",email:"rohanchatterjee866@gmail.com"})
//     res.send("Nice");
// })
app.listen(8000, () => {
  console.log("Server is working!!");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// app.post("/login", async (req, res) => {
//   const { name, Email, PhoneNo } = req.body;
//   console.log(req.body);
//   let user = await User.findOne({ Email });

//   if (!user) {
//     return res.redirect("/register");
//   }
//   user = await User.create({
//     name,
//     Email,
//     PhoneNo, // Changed from 'number' to 'PhoneNo'
//   });

//   //Cookies is short time "i am in"
//   // HEre the user._id has another type than in the mongoDB objectid
//   const token = jwt.sign({ _id: user._id }, "absciubob");
//   // our token is secure now
//   res.cookie("Token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//     //to make it more secure client side se message nahi kar skate
//   });
//   res.redirect("/");
// });

app.post("/register", async (req, res) => {
  const { name, Email, PhoneNo, password } = req.body;
  console.log(req.body);
  let user = await User.findOne({ Email });
   const hashedPassword = await bycrpt.hash(password,10);
  if (user) {
    return res.redirect("/login");
  }
  user = await User.create({
    name,
    Email,
    PhoneNo,
    password : hashedPassword,
  });

  //Cookies is short time "i am in"
  // HEre the user._id has another type than in the mongoDB objectid
  const token = jwt.sign({ _id: user._id }, "absciubob");
  // our token is secure now
  res.cookie("Token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
    //to make it more secure client side se message nahi kar skate
  });
  res.redirect("/");
});

app.post("/login", async (req, res) => {
  const { Email, password } = req.body;

  let user = await User.findOne({ Email });

  if (!user) {
    return res.redirect("/register");
  }

  const isMatch = await bycrpt.compare(password,user.password);
  console.log(isMatch);
  if (!isMatch) { 
    return res.render("login",{Email,message : "Invalid Password"});
  } else if (isMatch) {
    const token = jwt.sign({ _id: user._id }, "absciubob");
    res.cookie("Token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");
  }
});

app.get("/logout", isAuthnicated, (req, res) => {
  //Cookies is short time
  res.cookie("Token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
    //to make it more secure client side se message nahi kar skate
  });
  res.redirect("/");
});
