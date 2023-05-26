import { RequestHandler } from 'express'
import mongoose from 'mongoose'
import createHttpError from "http-errors";
import postModel from '../models/Post'


export const getNotes: RequestHandler = async (req, res, next) =>{
    try{
        const posts = await postModel.find().exec()
        res.status(200).json(posts)
        }
        catch(error){
            next(error)        
        }
}

export const getNote: RequestHandler = async (req, res, next) => {
    const postId = req.params.postId;

    try {

        if (!mongoose.isValidObjectId(postId)) {
            throw createHttpError(400, "Invalid Post id");
        }

        const post = await postModel.findById(postId).exec();

        if (!post) {
            throw createHttpError(404, "Post not found");
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
}


interface CreatePostBody {
    title?: string,
    text?: string,
}

export const createNote: RequestHandler<unknown, unknown, CreatePostBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    const userId = req.session.user!.userId
    const username = req.session.user!.username

    try {
        if(!userId){
            throw createHttpError(401, "You must be logged in to perform this action")
        }

        if (!title) {
            throw createHttpError(400, "Post must have a title");
        }

        const newPost = await postModel.create({
            authorId: userId,
            title: title,
            text: text,
            authorName: username
        });

        res.status(201).json(newPost);
    } catch (error) {
        next(error);
    }
};


interface PostParams {
    postId: string,
}
interface UpdatePostBody {
    title?: string,
    text?: string,
}

export const updateNote: RequestHandler<PostParams, unknown, UpdatePostBody, unknown> = async (req, res, next) => {
    const postId = req.params.postId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    const userId = req.session.user!.userId

    try {

        if(!userId){
            throw createHttpError(401, "You cannot access this note")
        }

        if (!mongoose.isValidObjectId(postId)) {
            throw createHttpError(400, "Invalid post id");
        }

        if (!newTitle) {
            throw createHttpError(400, "Post must have a title");
        }

        const post = await postModel.findById(postId).exec();

        if (!post) {
            throw createHttpError(404, "Post not found");
        }

        if (!post.authorId.equals(userId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        post.title = newTitle;
        post.text = newText || '';

        const updatedNote = await post.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
};


export const deleteNote : RequestHandler<PostParams, unknown, unknown, unknown> = async (req, res, next) => {
    const postId = req.params.postId
    
    const userId = req.session.user!.userId

    try{

        if(!userId){
            throw createHttpError(401, "You cannot access this note")
        }

        if (!mongoose.isValidObjectId(postId)) {
            throw createHttpError(400, "Invalid post id");
        }

        const post = await postModel.findById(postId).exec();

        if (!post) {
            throw createHttpError(404, "Post not found");
        }

        if (!post.authorId.equals(userId)) {
            throw createHttpError(401, "You cannot access this note");
        }

        await post.deleteOne()
        res.sendStatus(204);
    }
    catch(e){
        next(e)
    }
}