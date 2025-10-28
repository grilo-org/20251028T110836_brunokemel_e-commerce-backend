import express from 'express';
import dotenv from 'dotenv';
import { exportRouter } from './edge/exportCsv';
import { emailRouter } from './edge/sendEmail';
import supabase from './db/supabase';
import { criarPedido } from './edge/pedidos';

dotenv.config();

const app = express();
app.use(express.json());

// Rotas
app.use(exportRouter);
app.use(emailRouter);

app.listen(3000, () => console.log('Server running on port 3000'));

// ==========================
// Script de inicialização automático
// ==========================
async function main() {
  console.log("=== Inicializando dados de teste ===");

  try {
    // ==========================
    // 1️⃣ Criar cliente de teste
    // ==========================
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .eq('email', 'teste@teste.com');

    if (clientesError) throw clientesError;

    let cliente = clientes?.[0];

    if (!cliente) {
      const { data: novoCliente, error: clienteError } = await supabase
        .from('clientes')
        .insert({
          nome: 'Cliente Teste',
          email: 'teste@teste.com',
          telefone: '0000000000'
        })
        .select()
        .single();

      if (clienteError) throw clienteError;
      cliente = novoCliente;
    }

    console.log("Cliente pronto:", cliente);

    // ==========================
    // 2️⃣ Criar produtos de teste
    // ==========================
    const { data: produtosExistentes, error: produtosError } = await supabase.from('produtos').select('*');
    if (produtosError) throw produtosError;

    // Produto A
    let produtoA = produtosExistentes?.find(p => p.nome === 'Produto A');
    if (!produtoA) {
      const { data: novoProdutoA, error: erroProdutoA } = await supabase
        .from('produtos')
        .insert({ nome: 'Produto A', preco: 10.5 })
        .select()
        .single();
      if (erroProdutoA) throw erroProdutoA;
      produtoA = novoProdutoA;
    }

    // Produto B
    let produtoB = produtosExistentes?.find(p => p.nome === 'Produto B');
    if (!produtoB) {
      const { data: novoProdutoB, error: erroProdutoB } = await supabase
        .from('produtos')
        .insert({ nome: 'Produto B', preco: 25 })
        .select()
        .single();
      if (erroProdutoB) throw erroProdutoB;
      produtoB = novoProdutoB;
    }

    console.log("Produtos prontos:", produtoA, produtoB);

    // ==========================
    // 3️⃣ Criar pedido de teste
    // ==========================
    if (!criarPedido) throw new Error("Função criarPedido não encontrada");

    const pedido = await criarPedido(cliente.id, [
      { produto_id: produtoA.id, quantidade: 2 },
      { produto_id: produtoB.id, quantidade: 1 }
    ]);

    if (pedido) console.log("Pedido criado com sucesso:", pedido);
    else console.log("Falha ao criar pedido.");

  } catch (err) {
    console.error("Erro na inicialização:", err);
  }

  console.log("=== Inicialização concluída ===");
}

main();