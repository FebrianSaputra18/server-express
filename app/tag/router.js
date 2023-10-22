const router = require("express").Router();
const categoryController = require("./controller");
const { police_check } = require("../../middlewares");


router.get("/tags", categoryController.index);
router.post(
  "/tags",
  police_check("create", "Tag"),
  categoryController.store
);
router.put(
  "/tags/:id",
  police_check("update", "Tag"),
  categoryController.update
);
router.delete(
  "/tags/:id",
  police_check("delete", "Tag"),
  categoryController.destroy
);

module.exports = router;
