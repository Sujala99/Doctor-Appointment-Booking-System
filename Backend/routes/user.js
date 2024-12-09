const express = require('express');
const userController = require("../controller/user");
const { authenticateToken, authorizeRole } = require("../security/Auth");
const router = express.Router();
// const multer = require('multer')

// const storage = multer.diskStorage({
//     distanitaion: function(req, res, cb){
//         cb(null,'ground_images')
//     }, function (req, file,cb) {
//         cb(null, file.originalname)
        
//     }
// }
// )

// upload.single('file')
// const upload = multer({storage})
// router.post("/reset-password/:token", userController.resetPassword);
router.post("/reset-password/:token", userController.resetPassword);
router.post("/register",userController.registerUser);
router.post("/login",userController.loginUser);



module.exports= router;