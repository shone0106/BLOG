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
exports.logout = exports.login = exports.signUp = exports.getAuthenticatedUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.user.userId;
        const user = yield User_1.default.findById(userId).exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const existingUsername = yield User_1.default.findOne({ username: username }).exec();
        if (existingUsername)
            throw (0, http_errors_1.default)(409, 'Username already taken. Please choose a different one or log in instead.');
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield User_1.default.create({ username: username, password: hashedPassword });
        req.session.user = { userId: newUser._id, username: newUser.username };
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        const user = yield User_1.default.findOne({ username: username }).select("+password").exec();
        if (!user)
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        req.session.user = { userId: user._id, username: user.username };
        yield req.session.save();
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.logout = logout;
