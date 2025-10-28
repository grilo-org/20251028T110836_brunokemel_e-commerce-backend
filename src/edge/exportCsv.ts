import express, { Request, Response } from 'express';
import supabase from '../db/supabase';
import { Parser } from 'json2csv';

export const exportRouter = express.Router();

exportRouter.post('/export', async (req: Request, res: Response) => {
  const { cliente_id, formato = 'csv' } = req.body;

  if (!cliente_id) return res.status(400).json({ error: "cliente_id é obrigatório" });

  const { data, error } = await supabase
    .from('view_pedidos_detalhados')
    .select('*')
    .eq('cliente_id', cliente_id);

  if (error) return res.status(500).json({ error: "Erro ao buscar dados", detalhes: error });

  if (!data || data.length === 0) return res.status(404).json({ error: "Nenhum dado encontrado" });

  if (formato.toLowerCase() === 'json') {
    return res.json(data);
  }

  // CSV
  const parser = new Parser();
  const csv = parser.parse(data);
  res.header('Content-Type', 'text/csv');
  res.attachment('pedidos.csv');
  res.send(csv);
});
