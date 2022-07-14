import express from 'express';
import { createCard, 
         updateCard, 
         deleteCard, 
         getCard, 
         getCards} from '../controllers/cardController.js';

import { verifyAdmin } from '../utils/verifyToken.js';



const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createCard)

//UPDATE
router.put("/:id", verifyAdmin, updateCard)

//DELETE
router.delete("/:id", verifyAdmin, deleteCard)

//GET
router.get("/:id", verifyAdmin, getCard)

//GET ALL
router.get("/", verifyAdmin, getCards)

export default router