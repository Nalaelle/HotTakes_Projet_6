const Sauce = require('../models/Sauce');
const fs = require('fs');

function validName(name){
    const regex = /^[^@&"<>!_$€`+=\/;?#]+$/;
    return regex.test(name)
}

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    
    if (validName(sauceObject.name)) {
        delete sauceObject.userId;
        const sauce = new Sauce ({
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        sauce
            .save()
            .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
            .catch(error => res.status(400).json({ error }))

    }else{
        console.log('il y a une erreur !')
        return res.status(400).json({ message: "erreur de saisie" })
       
    }

    
    
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    if (validName(sauceObject.name)){
        delete sauceObject.userId;
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.userId !== req.auth.userId) {
                    res.status(403).json({ message: 'Non autorisé' })
                } else {
                    if (req.file){
                        const filename = sauce.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, (error) => {
                            if(error){
                                console.log("error modifier ");
                                console.log(error);
                                throw error;
                            }
                        })
                    }
                    
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Objet modifier avec succès' })
                        })
                        .catch(error => res.status(500).json({ error }));
                    }
            })
            .catch(error => res.status(500).json({ error }))

    }else{
        console.log('il y a une erreur !')
        return res.status(400).json({ message: "erreur de saisie" })
    }
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisé !'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error){
                        console.log("error delete ");
                        console.log(error);
                        throw error;
                    }else{
                    sauce.deleteOne({ _id: req.params.id })
                        .then(() => {res.status(200).json({message: 'Objet Supprimé'})})
                        .catch(error => res.status(500).json({ error }));
                    }
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.likeOrDislike = (req, res, next) => {   
    const likes = req.body.like;

    if (req.body.userId != req.auth.userId) {
        res.status(403).json({ message: 'Non autorisé !'});
    } else {

    Sauce.findOne({ _id: req.params.id })
        .then((objetSauce)=> {
            if (!objetSauce.usersLiked.includes(req.body.userId) && likes === 1 ) {
                console.log("like = 1")
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes : 1 },
                    $push: { usersLiked : req.body.userId }
            })
                .then(() => res.status(200).json({ message: "Like" }))
                .catch((error) => res.status(400).json({ error }))
            }

            if (!objetSauce.usersDisliked.includes(req.body.userId) && likes === -1 ){
                console.log("like = -1 / dislike = 1")
                 Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes : 1 },
                    $push: { usersDisliked : req.body.userId }
                })
                    .then(() => res.status(200).json({ message: "Unlike" }))
                    .catch((error) => res.status(400).json({ error }))
            }

            if (objetSauce.usersLiked.includes(req.body.userId) && likes === 0){
                console.log("il y a zero like");
    
                Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                    .then(() => res.status(200).json({ message: "Nothing" }))
                    .catch((error) => res.status(400).json({ error }))
                              
            }
            if (objetSauce.usersDisliked.includes(req.body.userId) && likes === 0){
                console.log("il y a zero Dislike");

                Sauce.updateOne({ _id: req.params.id }, {$inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                    .then(() => res.status(200).json({ message: "Nothing" }))
                    .catch((error) => res.status(400).json({ error }))
            }
        })
        .catch((error) => res.status(500).json({ error }))
    }

};