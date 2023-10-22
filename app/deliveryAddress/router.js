const router = require("express").Router();
const { police_check } = require("../../middlewares");
const addressController = require("./controller");

router.post(
  "/delivery-addresses",
  police_check("create", "DeliveryAddress"),
  addressController.store
);
router.get(
  '/delivery-addresses',
  police_check("view", "DeliveryAddress"),
  addressController.index
)
router.put(
  '/delivery-addresses/:id',
  addressController.update
)
router.delete(
  '/delivery-addresses/:id',
  addressController.destroy
)

module.exports = router