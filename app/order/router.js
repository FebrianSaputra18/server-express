const router = require("express").Router();
const { police_check } = require("../../middlewares");
const orderController = require("./controller.js");

router.get("/orders", police_check("view", "Order"), orderController.index);
router.post("/orders", police_check("create", "Order"), orderController.store);

module.exports = router;
