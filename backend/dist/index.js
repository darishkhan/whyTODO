"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const todoRoutes_1 = __importDefault(require("./routes/todoRoutes"));
const app = (0, express_1.default)();
const port = 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/todo', todoRoutes_1.default);
app.listen(port, () => {
    console.log("listening on port", port);
});
