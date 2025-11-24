const express = require("express");
const { PrismaClient } = require("@prisma/client");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
const prisma = new PrismaClient();

const expressLayouts = require("express-ejs-layouts");
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

const adminOrderRoutes = require("./routes/adminOrderRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const { attachUser } = require("./middleware/auth");

app.use(attachUser);


app.use("/", adminOrderRoutes);
app.use("/", orderRoutes);
app.use("/", cartRoutes);
app.use("/", authRoutes);
app.use("/", productRoutes);



app.get("/", (req, res) => {
  res.send("Home Page working ✅");
});

app.listen(6543, () => console.log("Server running on http://localhost:6543"));
