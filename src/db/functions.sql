CREATE OR REPLACE FUNCTION calcular_total_pedido(p_pedido_id UUID)
RETURNS NUMERIC AS $$
DECLARE 
    total NUMERIC;
BEGIN
    SELECT SUM(quantidade * preco_unitario)
    INTO total
    FROM itens_pedido
    WHERE pedido_id = p_pedido_id;

    UPDATE pedidos SET total = total WHERE id = p_pedido_id;
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- atualizar status do pedido
CREATE OR REPLACE FUNCTION atualizar_status_pedido(p_pedido_id UUID, p_status TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE pedidos SET status = p_status WHERE id = p_pedido_id;
END;
$$ LANGUAGE plpgsql;