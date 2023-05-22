const {Router} = require("express")
const router = Router();
const Controller = require("../controllers/Controller")


router.get("/api/users",Controller.getAll);
router.get("/api/users/:name",Controller.getOne);
router.post("/api/users/set",Controller.addOne)
router.delete("/api/users/delete/:name",Controller.deleteOne)
router.put("/api/users/update/:id",Controller.updateOne)



module.exports = router;