const Post = require("../models/Post");
const User = require("../models/User")

exports.Create = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    await newPost.save();
    return res.status(200).json({ msg: "post saved" });
  } catch (err) {
    return res.status(400).json({ msg: "there is wrong! check you input" });
  }
};
exports.Edit = (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId ===req.body.userId){
            await post.updateOne({$set:req.body})
            return res.status(200).json({msg:"post updated"})
        }else{
            return res.status(400).json({ msg: "you can only update your posts" });
        } 
    }
    catch(err){
        return res.status(400).json({ msg: "there is wrong! check you input" });
    }
}
exports.Delete = (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(post.userId ===req.body.userId){
            await post.deleteOne()
            return res.status(200).json({msg:"post deleted"})
        }else{
            return res.status(400).json({ msg: "you can only delete your posts" });
        } 
    }
    catch(err){
        return res.status(400).json({ msg: "there is wrong! check you input" });
    }
}

exports.Like = (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId))
        {
            await post.updateOne({$push:{likes:req.body.userId}})
            return res.status(200).json({msg:"the post has been liked"})
        }
        else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            return res.status(200).json({msg:"the post has been disliked"})
        }
    }
    catch(err){
        return res.status(400).json({msg:"there is wrong! check you input"})
    }
}
exports.Get=(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        return res.status(200).json({post:post})
    }
    catch(err){
    return res.status(400).json({ msg: "there is wrong! check you input" });
    }
}
exports.GetTimeLine = (req,res)=>{
    let postArray = []
    try{
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId :currentUser._id })
        const friendPost = await Promise.all(
            currentUser.followings.map(friendId=>{
               return Post.find({userId :friendId })
            })
        )
        return res.status(200).json({userPost : userPosts.concat(...friendPost)})
    }
    catch(err){
        return res.status(400).json({ msg: "there is wrong! check you input" });
    }
}
