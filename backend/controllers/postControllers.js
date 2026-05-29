import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
export const getFeedPosts=async(req,res)=>{
    try {
        const posts=await Post.find({author:{$in:[...req.user.connections,req.user._id]}}).populate("author","name headline profilePicture username")
        .populate("comments.user","name profilePicture")
        .sort({createdAt:-1});
        res.status(200).json(posts);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
export const createPost=async(req,res)=>{
    try {
        const {content,image}=req.body;
        if(!content){
            return res.status(400).json({message:"Content is required"});
        }
            let newPost;
        if(image){
            const result=await cloudinary.uploader.upload(image);
            // image=result.secure_url;
             newPost=new Post({
                author:req.user._id,
                content,
                image:result.secure_url
            });
        }
        else{
            newPost=new Post({
                author:req.user._id,
                content
            });
        }
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
export const deletePost=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        if(post.author.toString()!=req.user._id){
            return res.status(403).json({message:"Unauthorized"});
        }
        if(post.image){
            await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0]);
        }
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({message:"Post deleted successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

export const getPostById=async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id).populate("author","name headline profilePicture username")
        .populate("comments.user","name profilePicture");
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        console.log(post)
        res.status(200).json(post);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

export const createComment=async(req,res)=>{
    try {
    const postId=req.params.id;
    const {content}=req.body;
    const post=await Post.findByIdAndUpdate(postId,{$push:{comments:{content,user:req.user._id}}},{new:true}).populate("author","name email headline profilePicture username")
    .populate("comments.user","name profilePicture");

    //create notification if commenter is not post author
    if(post.author.toString()!==req.user._id){
        const notification=new Notification({
            recipient:post.author,
            type:"comment",
            sender:req.user._id,
            post:post._id
        });
        await notification.save();
        try {
            const postUrl=`${process.env.CLIENT_URL}/posts/${post._id}`;
            await sendCommentNotificationEmail(post.author.email,post.author.name, req.user.name, postUrl, content);
        }
        catch(err){
            console.error("Error sending notification email:", err);
        }
    }
    res.status(201).json(post);
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}
export const createLike=async(req,res)=>{
    try {
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        if(post.likes.includes(req.user._id)){
            //unlike the post
            post.likes=post.likes.filter((id)=>id.toString()!=req.user._id);
            if(post.author._id.toString()!==req.user._id){
                const notification=new Notification({
                    recipient:post.author,
                    type:"dislike",
                    sender:req.user._id,
                    post:post._id
                });
                await notification.save();
                await post.save();
                res.status(200).json({message:"Post disliked successfully"});
            }
            // return res.status(400).json({message:"Already liked"});

        }
        else{
            post.likes.push(req.user._id);
            if(post.author._id.toString()!==req.user._id){
                const notification=new Notification({
                    recipient:post.author,
                    type:"like",
                    sender:req.user._id,
                    post:post._id
                });
                await notification.save();
            }
        }
        await post.save();
        res.status(200).json({message:"Post liked successfully"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}