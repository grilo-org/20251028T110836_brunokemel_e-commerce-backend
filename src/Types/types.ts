// src/types.ts
export type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  data_criacao: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  data_criacao: string;
};

export type Pedido = {
  id: string;
  cliente_id: string;
  data_pedido: string;
  status: string;
  total: number;
};

export type ItemPedido = {
  id?: number;
  pedido_id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
};
