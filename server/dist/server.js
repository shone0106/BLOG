"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
mongoose_1.default.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
    console.log('mongoose connected');
    app_1.default.listen(process.env.PORT, () => {
        console.log(`server running on port ${process.env.PORT}`);
    });
})
    .catch(console.error);
