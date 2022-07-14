import express from 'express';
import {updateUser, 
        deleteUser, 
        getUser, 
        getUsers} from '../controllers/userController.js';
import { verifyAdmin, verifyToken, verifyUser } from '../utils/verifyToken.js';


const router = express.Router();

// router.get("/checkauth", verifyToken, (req, res, next) => {
//     res.send("User logged")
// })

// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//     res.send("User logged and not deleted")
// })

// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//     res.send("Admin logged and not deleted")
// })
verifyUser, 
//UPDATE
router.put("/:id", verifyUser, updateUser)

//DELETE
router.delete("/:id", verifyUser, deleteUser)

//GET
router.get("/:id",verifyUser,  getUser)

//GET ALL
router.get("/", verifyAdmin, getUsers)


export default router