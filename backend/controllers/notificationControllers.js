import Notification from "../models/notification.model.js";
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 })
        .populate("sender", "name username profilePicture")
        .populate("post", "content image");
        res.status(200).json(notifications);
    }
    catch(err){
        res.status(500).json({ message: "Failed to fetch notifications", error: err.message });
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    }
    catch(err){
        res.status(500).json({ message: "Failed to mark notification as read", error: err.message });
    }
}

export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.status(200).json({ message: "Notification deleted successfully" });
    }
    catch(err){
        res.status(500).json({ message: "Failed to delete notification", error: err.message });
    }
}