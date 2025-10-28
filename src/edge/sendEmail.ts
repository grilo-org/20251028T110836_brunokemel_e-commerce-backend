import express, { Request, Response } from 'express';

export const emailRouter = express.Router();

emailRouter.post('/send-email', async (req: Request, res: Response) => {
  const { pedido_id, email } = req.body;

  if (!pedido_id || !email) {
    return res.status(400).json({ error: 'pedido_id e email são obrigatórios' });
  }

  // Simulação de envio de e-mail
  console.log(`Enviando e-mail de confirmação para ${email} (pedido #${pedido_id})`);

  return res.json({ message: 'E-mail enviado com sucesso!' });
});