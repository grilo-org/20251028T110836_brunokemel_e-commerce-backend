"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const exportCsv_1 = require("./edge/exportCsv");
const sendEmail_1 = require("./edge/sendEmail");
const supabase_1 = __importDefault(require("./db/supabase"));
const pedidos_1 = require("./edge/pedidos");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Rotas
app.use(exportCsv_1.exportRouter);
app.use(sendEmail_1.emailRouter);
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
        const { data: clientes, error: clientesError } = await supabase_1.default
            .from('clientes')
            .select('*')
            .eq('email', 'teste@teste.com');
        if (clientesError)
            throw clientesError;
        let cliente = clientes?.[0];
        if (!cliente) {
            const { data: novoCliente, error: clienteError } = await supabase_1.default
                .from('clientes')
                .insert({
                nome: 'Cliente Teste',
                email: 'teste@teste.com',
                telefone: '0000000000'
            })
                .select()
                .single();
            if (clienteError)
                throw clienteError;
            cliente = novoCliente;
        }
        console.log("Cliente pronto:", cliente);
        // ==========================
        // 2️⃣ Criar produtos de teste
        // ==========================
        const { data: produtosExistentes, error: produtosError } = await supabase_1.default.from('produtos').select('*');
        if (produtosError)
            throw produtosError;
        // Produto A
        let produtoA = produtosExistentes?.find(p => p.nome === 'Produto A');
        if (!produtoA) {
            const { data: novoProdutoA, error: erroProdutoA } = await supabase_1.default
                .from('produtos')
                .insert({ nome: 'Produto A', preco: 10.5 })
                .select()
                .single();
            if (erroProdutoA)
                throw erroProdutoA;
            produtoA = novoProdutoA;
        }
        // Produto B
        let produtoB = produtosExistentes?.find(p => p.nome === 'Produto B');
        if (!produtoB) {
            const { data: novoProdutoB, error: erroProdutoB } = await supabase_1.default
                .from('produtos')
                .insert({ nome: 'Produto B', preco: 25 })
                .select()
                .single();
            if (erroProdutoB)
                throw erroProdutoB;
            produtoB = novoProdutoB;
        }
        console.log("Produtos prontos:", produtoA, produtoB);
        // ==========================
        // 3️⃣ Criar pedido de teste
        // ==========================
        if (!pedidos_1.criarPedido)
            throw new Error("Função criarPedido não encontrada");
        const pedido = await (0, pedidos_1.criarPedido)(cliente.id, [
            { produto_id: produtoA.id, quantidade: 2 },
            { produto_id: produtoB.id, quantidade: 1 }
        ]);
        if (pedido)
            console.log("Pedido criado com sucesso:", pedido);
        else
            console.log("Falha ao criar pedido.");
    }
    catch (err) {
        console.error("Erro na inicialização:", err);
    }
    console.log("=== Inicialização concluída ===");
}
main();
