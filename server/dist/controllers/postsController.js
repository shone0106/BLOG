"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNote = exports.getNotes = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const Post_1 = __importDefault(require("../models/Post"));
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post_1.default.find().exec();
        res.status(200).json(posts);
    }
    catch (error) {
        next(error);
    }
});
exports.getNotes = getNotes;
const getNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        if (!mongoose_1.default.isValidObjectId(postId)) {
            throw (0, http_errors_1.default)(400, "Invalid Post id");
        }
        const post = yield Post_1.default.findById(postId).exec();
        if (!post) {
            throw (0, http_errors_1.default)(404, "Post not found");
        }
        res.status(200).json(post);
    }
    catch (error) {
        next(error);
    }
});
exports.getNote = getNote;
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const text = req.body.text;
    const userId = req.session.userId;
    try {
        if (!userId) {
            throw (0, http_errors_1.default)(401, "You must be logged in to perform this action");
        }
        if (!title) {
            throw (0, http_errors_1.default)(400, "Post must have a title");
        }
        const newPost = yield Post_1.default.create({
            authorId: userId,
            title: title,
            text: text,
        });
        res.status(201).json(newPost);
    }
    catch (error) {
        next(error);
    }
});
exports.createNote = createNote;
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const newTitle = req.body.title;
    const newText = req.body.text;
    const userId = req.session.userId;
    try {
        if (!userId) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        if (!mongoose_1.default.isValidObjectId(postId)) {
            throw (0, http_errors_1.default)(400, "Invalid post id");
        }
        if (!newTitle) {
            throw (0, http_errors_1.default)(400, "Post must have a title");
        }
        const post = yield Post_1.default.findById(postId).exec();
        if (!post) {
            throw (0, http_errors_1.default)(404, "Post not found");
        }
        if (!post.authorId.equals(userId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        post.title = newTitle;
        post.text = newText || '';
        const updatedNote = yield post.save();
        res.status(200).json(updatedNote);
    }
    catch (error) {
        next(error);
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    const userId = req.session.userId;
    try {
        if (!userId) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        if (!mongoose_1.default.isValidObjectId(postId)) {
            throw (0, http_errors_1.default)(400, "Invalid post id");
        }
        const post = yield Post_1.default.findById(postId).exec();
        if (!post) {
            throw (0, http_errors_1.default)(404, "Post not found");
        }
        if (!post.authorId.equals(userId)) {
            throw (0, http_errors_1.default)(401, "You cannot access this note");
        }
        yield post.deleteOne();
        res.sendStatus(204);
    }
    catch (e) {
        next(e);
    }
});
exports.deleteNote = deleteNote;
