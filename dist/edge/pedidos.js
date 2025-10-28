"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarPedido = criarPedido;
const supabase_1 = __importDefault(require("../db/supabase"));
async function criarPedido(clienteId, itens) {
    // Busca produtos
    const { data: produtos, error: produtosError } = await supabase_1.default
        .from('produtos')
        .select('*')
        .in('id', itens.map(i => i.produto_id));
    if (produtosError || !produtos || produtos.length === 0) {
        console.error("Erro ao buscar produtos:", produtosError);
        return null;
    }
    // Cria pedido
    const { data: pedido, error: pedidoError } = await supabase_1.default
        .from('pedidos')
        .insert({ cliente_id: clienteId })
        .select()
        .single();
    if (pedidoError || !pedido) {
        console.error("Erro ao criar pedido:", pedidoError);
        return null;
    }
    // Inserir itens do pedido
    const itensInsert = itens.map(i => ({
        pedido_id: pedido.id,
        produto_id: i.produto_id,
        quantidade: i.quantidade,
        preco_unitario: produtos.find(p => p.id === i.produto_id)?.preco ?? 0
    }));
    const { error: itensError } = await supabase_1.default.from('itens_pedido').insert(itensInsert);
    if (itensError) {
        console.error("Erro ao inserir itens:", itensError);
        return null;
    }
    // Calcula total via RPC
    const { error: rpcError } = await supabase_1.default.rpc('calcular_total_pedido', { p_pedido_id: pedido.id });
    if (rpcError)
        console.error('Erro ao calcular total do pedido:', rpcError);
    return pedido;
}
