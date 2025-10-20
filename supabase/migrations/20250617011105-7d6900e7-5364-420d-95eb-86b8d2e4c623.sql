
-- Primeiro, vamos verificar se existe a foreign key constraint e recriá-la corretamente
-- Remove a constraint existente se houver problema
ALTER TABLE system_users DROP CONSTRAINT IF EXISTS system_users_laundry_id_fkey;

-- Cria a foreign key constraint correta referenciando a tabela laundries
ALTER TABLE system_users 
ADD CONSTRAINT system_users_laundry_id_fkey 
FOREIGN KEY (laundry_id) REFERENCES laundries(id) ON DELETE SET NULL;

-- Inserir uma lavanderia padrão caso não exista dados na tabela laundries
INSERT INTO laundries (id, name, address, phone, email, working_hours, default_delivery_days)
VALUES ('1', 'Lavanderia Express', 'Rua das Flores, 123 - Centro', '(11) 98765-4321', 'contato@lavanderiaexpress.com', 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 14h', 3)
ON CONFLICT (id) DO NOTHING;
