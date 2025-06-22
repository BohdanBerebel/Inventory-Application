const { Router } = require("express");
const deleteController = require("../controllers/delete");
const deleteRoute = Router();

deleteRoute.get("/section/:name", deleteController.deleteSection);
deleteRoute.get("/item/:id/:sectionName", deleteController.deleteItem);

module.exports = deleteRoute;
