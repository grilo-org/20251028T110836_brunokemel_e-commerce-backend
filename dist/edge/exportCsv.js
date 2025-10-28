"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportRouter = void 0;
const express_1 = __importDefault(require("express"));
const supabase_1 = __importDefault(require("../db/supabase"));
const json2csv_1 = require("json2csv");
exports.exportRouter = express_1.default.Router();
exports.exportRouter.post('/export', async (req, res) => {
    const { cliente_id, formato = 'csv' } = req.body;
    if (!cliente_id)
        return res.status(400).json({ error: "cliente_id é obrigatório" });
    const { data, error } = await supabase_1.default
        .from('view_pedidos_detalhados')
        .select('*')
        .eq('cliente_id', cliente_id);
    if (error)
        return res.status(500).json({ error: "Erro ao buscar dados", detalhes: error });
    if (!data || data.length === 0)
        return res.status(404).json({ error: "Nenhum dado encontrado" });
    if (formato.toLowerCase() === 'json') {
        return res.json(data);
    }
    // CSV
    const parser = new json2csv_1.Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('pedidos.csv');
    res.send(csv);
});
