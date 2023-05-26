"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAuth = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const requiresAuth = (req, res, next) => {
    var _a;
    if ((_a = req.session.user) === null || _a === void 0 ? void 0 : _a.userId) {
        next();
    }
    else {
        next((0, http_errors_1.default)(401, "User not authenticated"));
    }
};
exports.requiresAuth = requiresAuth;
