"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailRouter = void 0;
const express_1 = __importDefault(require("express"));
exports.emailRouter = express_1.default.Router();
exports.emailRouter.post('/send-email', async (req, res) => {
    const { pedido_id, email } = req.body;
    if (!pedido_id || !email) {
        return res.status(400).json({ error: 'pedido_id e email são obrigatórios' });
    }
    // Simulação de envio de e-mail
    console.log(`Enviando e-mail de confirmação para ${email} (pedido #${pedido_id})`);
    return res.json({ message: 'E-mail enviado com sucesso!' });
});
