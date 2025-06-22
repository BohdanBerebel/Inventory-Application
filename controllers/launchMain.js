const { header } = require("express-validator");
const db = require("../db/dbManipulations");
require("dotenv").config();

async function launchMain(req, res) {
  const sections = [];
  const titles = await db.getTableNames();
  for (let table_name of titles) {
    const items = await db.getAllEntriesOfTable(table_name);
    sections.push({ title: table_name, items });
  }
  await res.render("main", {
    sections,
    headers: titles,
  });
}

async function showOneSection(req, res) {
  const { name } = req.params;
  if (name === "style.css") {
    return;
  }
  const titles = await db.getTableNames();
  const items = await db.getAllEntriesOfTable(name);
  await res.render("main", {
    headers: titles,
    sections: [{ title: name, items }],
  });
}

async function addNewItem(req, res) {
  const inputs = req.body;
  const { password } = inputs;
  if (password !== process.env.password) {
    res.send("Amiss password...");
    return;
  }
  const { tableName } = req.params;
  delete inputs["password"];
  await db.addNewItem(tableName, inputs);
  await res.redirect("/");
}

async function openAddItemPage(req, res) {
  const { tableName } = req.params;
  const titles = await db.getTableNames();
  const columns = await db.getColumns(tableName);
  await res.render("main", { headers: titles, title: tableName, columns });
}

async function openAddNewSection(req, res) {
  const titles = await db.getTableNames();
  await res.render("addNewSection", { headers: titles });
}

async function addNewSection(req, res) {
  const titles = await db.getTableNames();
  const { sectionName, numberOfColumns } = req.body;
  await res.render("addColumns", {
    headers: titles,
    sectionName,
    ["numberOfColumns"]: +numberOfColumns,
  });
}

async function createSection(req, res, next) {
  const { sectionName, columns } = req.body;
  const columnsString =
    `id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, ` +
    columns.map((col) => `${col} VARCHAR(100)`).join(", ");
  await db.createNewTable(sectionName, columnsString);
  next();
}

module.exports = {
  launchMain,
  showOneSection,
  addNewItem,
  openAddItemPage,
  openAddNewSection,
  addNewSection,
  createSection,
};
