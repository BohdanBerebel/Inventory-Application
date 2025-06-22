const express = require("express");
const app = express();
const controllers = require("./controllers/launchMain");
const path = require("path");
const deleteRoute = require("./routers/delete");
// require("dotenv").config();
// process.env

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/section/:name", controllers.showOneSection);
app.get("/openAddItemPage/:tableName", controllers.openAddItemPage);
app.post("/addNewItem/:tableName", controllers.addNewItem);
app.get("/openAddNewSection", controllers.openAddNewSection);
app.post("/addNewSection", controllers.addNewSection);
app.post("/createSection", controllers.createSection, async (req, res) => {
  return res.status(200).json({ success: true });
});
app.use("/delete", deleteRoute);
app.get("/", controllers.launchMain);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The server has been launched on port ${PORT}`);
});
