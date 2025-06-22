const db = require("../db/dbManipulations");

async function deleteSection(req, res) {
  const { name } = req.params;
  await db.deleteSection(name);
  await res.redirect("/");
}

async function deleteItem(req, res) {
  const { id, sectionName } = req.params;
  await db.deleteItem(sectionName, id);
  await res.redirect("/");
}

module.exports = { deleteSection, deleteItem };
