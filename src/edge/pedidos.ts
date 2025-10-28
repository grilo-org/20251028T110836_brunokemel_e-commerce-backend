import supabase from '../db/supabase';
import { ItemPedido } from '../Types/types';

export async function criarPedido(clienteId: string, itens: { produto_id: string, quantidade: number }[]) {
  // Busca produtos
  const { data: produtos, error: produtosError } = await supabase
    .from('produtos')
    .select('*')
    .in('id', itens.map(i => i.produto_id));

  if (produtosError || !produtos || produtos.length === 0) {
    console.error("Erro ao buscar produtos:", produtosError);
    return null;
  }

  // Cria pedido
  const { data: pedido, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({ cliente_id: clienteId })
    .select()
    .single();

  if (pedidoError || !pedido) {
    console.error("Erro ao criar pedido:", pedidoError);
    return null;
  }

  // Inserir itens do pedido
  const itensInsert: ItemPedido[] = itens.map(i => ({
    pedido_id: pedido.id,
    produto_id: i.produto_id,
    quantidade: i.quantidade,
    preco_unitario: produtos.find(p => p.id === i.produto_id)?.preco ?? 0
  }));

  const { error: itensError } = await supabase.from('itens_pedido').insert(itensInsert);
  if (itensError) {
    console.error("Erro ao inserir itens:", itensError);
    return null;
  }

  // Calcula total via RPC
  const { error: rpcError } = await supabase.rpc('calcular_total_pedido', { p_pedido_id: pedido.id });
  if (rpcError) console.error('Erro ao calcular total do pedido:', rpcError);

  return pedido;
}
