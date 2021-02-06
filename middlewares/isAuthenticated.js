const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      //On récupère le token utilisateur
      const token = req.headers.authorization.replace("Bearer ", "");
      //On vérifie la présence de ce token dans la base de données
      const user = await User.findOne({ token: token }).select(
        "email username _id"
      );
      if (user) {
        // On ajoute une clé user à l'objet req
        req.user = user;
        //console.log(user);
        return next();
      } else {
        return res.status(400).json({ message: "Unauthorized" });
      }
    } else {
      return res.status(400).json({ message: "Authorisation missing" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
