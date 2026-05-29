import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser=await User.findById(req.user._id);
        console.log(currentUser._id);
        const suggestions=await User.find({
            _id:{$nin:[currentUser._id,...(currentUser.connections || [])]}
        }).select("name headline profilePicture username").limit(5);
        res.status(200).json(suggestions);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
export const getPublicProfile=async(req,res)=>{
    try {
const user=await User.findOne({username:req.params.username}).select("-password");
if(!user){
    return res.status(404).json({message:"User not found"});
}
res.status(200).json(user);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
export const updateUserProfile=async(req,res)=>{
    try {
        const allowedFields=["name","headline","location","about","username","profilePicture","bannerImage","skills","experience","education"];
        const updatedData={};
        for(let field of allowedFields){
            if(req.body[field]){
                updatedData[field]=req.body[field];
            }
        }
        if(req.body.profilePicture){
        const result=await cloudinary.uploader.upload(req.body.profilePicture);
        updatedData.profilePicture=result.secure_url;
        }
        if(req.body.bannerImage){
            const result=await cloudinary.uploader.upload(req.body.bannerImage);
            updatedData.bannerImage=result.secure_url;
        }
        const updatedUser=await User.findByIdAndUpdate(req.user.id, updatedData, {new:true}).select("-password");
        res.status(200).json(updatedUser);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}