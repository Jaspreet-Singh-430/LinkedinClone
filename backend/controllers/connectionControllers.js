import ConnectionRequest from "../models/connectionRequest.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
export const sendConnectionRequest = async (req, res) => {
    try{
        const targetUserId = req.params.id;
        if(targetUserId === req.user._id.toString()){
            return res.status(400).json({message:"You cannot send a connection request to yourself"});
        }
        if(req.user.connections.includes(targetUserId)){
            return res.status(400).json({message:"You are already connected with this user"});
        }
        const existingRequest = await ConnectionRequest.findOne({
            sender: req.user._id,
            recipient: targetUserId,
            status: "pending",
        });
        if(existingRequest){
            return res.status(400).json({message:"Connection request already sent"});
        }
        const newRequest = new ConnectionRequest({
            sender: req.user._id,
            recipient: targetUserId,
            status: "pending",
        });
        await newRequest.save();
        res.status(200).json({message:"Connection request sent successfully"});
        
    }
    catch(err){
        res.status(500).json({message:"Failed to send connection request",error:err.message});
    }
}
export const acceptConnectionRequest = async (req, res) => {
    try{
        const requestId = req.params.id;
        const connectionRequest = await ConnectionRequest.findById(requestId)
        .populate("sender", "name email username profilePicture")
        .populate("recipient", "name username profilePicture");
        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }
        if(connectionRequest.recipient._id.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to accept this connection request"});
        }
        if(connectionRequest.status !== "pending"){
            return res.status(400).json({message:"This connection request has already been processed"});
        }
        connectionRequest.status = "accepted";
        await connectionRequest.save();
        // Add each other to connections list
        const senderId = connectionRequest.sender._id;
        const recipientId = connectionRequest.recipient._id;
        await User.findByIdAndUpdate(senderId, {$push: {connections: recipientId}});
        await User.findByIdAndUpdate(recipientId, {$push: {connections: senderId}});
        const notification = new Notification({
            recipient: senderId,
            sender: recipientId,
            type: "connectionAccepted",
        });
        await notification.save();
        // send email notification to sender
        const senderEmail= connectionRequest.sender.email;
        const senderName = connectionRequest.sender.name;
        const recipientName = connectionRequest.recipient.name;
        const profileUrl=process.env.CLIENT_URL+"/profile/"+connectionRequest.recipient.username;
        try {
            sendCommentNotificationEmail(senderEmail, senderName, recipientName,profileUrl);
        }
        catch(err){
            console.error("Failed to send connection accepted email:", err);
        }
        res.status(200).json({message:"Connection request accepted successfully"});
    }
    catch(err){
        res.status(500).json({message:"Failed to accept connection request",error:err.message});
    }
}

export const rejectConnectionRequest = async (req, res) => {
    try{
        const requestId = req.params.id;
        const connectionRequest = await ConnectionRequest.findById(requestId);
        if(!connectionRequest){
            return res.status(404).json({message:"Connection request not found"});
        }
        if(connectionRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to reject this connection request"});
        }
        if(connectionRequest.status !== "pending"){
            return res.status(400).json({message:"This connection request has already been processed"});
        }
        connectionRequest.status = "rejected";

        await connectionRequest.save();

        res.status(200).json({message:"Connection request rejected successfully"});
    }
    catch(err){
        res.status(500).json({message:"Failed to reject connection request",error:err.message});
    }
    }

export const getConnectionRequests = async (req, res) => {
    try{
        const connectionRequests = await ConnectionRequest.find({recipient: req.user._id, status: "pending"})
        .populate("sender", "name username profilePicture headline connections");
        res.status(200).json(connectionRequests);
    }
    catch(err){
        res.status(500).json({message:"Failed to fetch connection requests",error:err.message});
    }
}  

export const getUserConnections = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).populate("connections", "name username profilePicture headline");
        res.status(200).json(user.connections);
    }
    catch(err){
        res.status(500).json({message:"Failed to fetch connections",error:err.message});
    }
}

export const removeConnection = async (req, res) => {
    try{
        const targetUserId = req.params.id;
        if(!req.user.connections.includes(targetUserId)){
            return res.status(400).json({message:"You are not connected with this user"});
        }
        await User.findByIdAndUpdate(req.user._id, {$pull: {connections: targetUserId}});
        await User.findByIdAndUpdate(targetUserId, {$pull: {connections: req.user._id}});
        res.status(200).json({message:"Connection removed successfully"});
    }
    catch(err){
        res.status(500).json({message:"Failed to remove connection",error:err.message});
    }
}

export const getConnectionStatus = async (req, res) => {
    try{
        const targetUserId = req.params.id;
        if(targetUserId == req.user._id.toString()){
            return res.status(400).json({message:"This is your own profile"});
        }
        if(req.user.connections.includes(targetUserId)){
            return res.status(200).json({status:"connected"});
        }
        const existingRequest = await ConnectionRequest.findOne({
            sender: req.user._id,
            recipient: targetUserId,
            status: "pending",
        });
        if(existingRequest){
            return res.status(200).json({status:"requestSent"});
        }
        const incomingRequest = await ConnectionRequest.findOne({
            sender: targetUserId,
            recipient: req.user._id,
            status: "pending",
        });
        if(incomingRequest){
            return res.status(200).json({status:"requestReceived",requestId:incomingRequest._id});
        }
        res.status(200).json({status:"notConnected"});
    }
    catch(err){
        res.status(500).json({message:"Failed to get connection status",error:err.message});
    }
}