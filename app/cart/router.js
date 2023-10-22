const router = require("express").Router();
const cartController = require("./controller");
const { police_check } = require("../../middlewares");

router.put("/carts", police_check("update", "Carts"), cartController.update);
router.get("/carts", police_check("read", "Carts"), cartController.index);

module.exports = router;