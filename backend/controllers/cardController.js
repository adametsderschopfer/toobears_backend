import card from '../models/card.js';


export const createCard = async (req, res, next) =>{
        
    const newCard = new card(req.body)

    try{
        const savedCard = await newCard.save();
        res.status(200).json(savedCard)
    } catch(err){
        next(err);
    }

}

export const updateCard = async (req, res, next) => {

    try {
        const updatedCard = await card.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new:true }
            )
        res.status(200).json(updatedCard)
    } catch(err){
        res.status(500).json(err)
    }

}

export const deleteCard = async (req, res, next) => {
    
    try {
        await card.findByIdAndDelete(
            req.params.id
            )
        res.status(200).json("Card has been deleted")
    } catch(err) {
        res.status(500).json(err)
    }
    

}

export const getCard = async (req, res, next) => {

    try {
        const Card = await card.findById(
            req.params.id, 
            )
        res.status(200).json(Card)
    } catch(err){
        res.status(500).json(err)
    }
    

}

export const getCards = async (req, res, next) => {

    try {
        const cards = await card.find()
        res.status(200).json(cards)
    } catch(err){
        next(err)
    }

}

