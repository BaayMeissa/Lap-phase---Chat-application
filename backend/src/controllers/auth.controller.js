import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir plus de 6 caractères.",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Cet utilisateur existe déjà.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //Generate new token for the user using JWT
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.send(400).json({
        message: "Erreur lors de la création de l'utilisateur.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "Loged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Merci de vérifier les informations entrées" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(400).json({ message: "Merci de vérifier les informations entrées" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 


const updateProfile = async (req,res)=>{
  try {
    const {profilePic}=req.body;
    const UserId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message:"Pas de photo de profil"})
    }

  const uploadResponse = await cloudinary.uploader.upload(profilePic)
  const updatedUser = await User.findByIdAndUpdate(UserId,{profilePic:uploadResponse.secure_url},{new:true})

  res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Server error"})
  }
}

const checkAuth = (req,res)=>{
  try {
    res.status(200).json(req.user)
  } catch (error) {
  console.log(error.message);
  res.status(500).json({message:"Internal server error"})
  }
}

export { signup, logout, login, checkAuth, updateProfile };
