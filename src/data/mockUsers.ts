
import { User } from '@/types/demand';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@lavanderia.com',
    name: 'Administrador',
    role: 'admin',
    laundryId: '1'
  },
  {
    id: '2',
    email: 'gerente@lavanderia.com',
    name: 'Gerente',
    role: 'manager',
    laundryId: '1'
  },
  {
    id: '3',
    email: 'operador@lavanderia.com',
    name: 'Operador',
    role: 'operator',
    laundryId: '1'
  },
  {
    id: '4',
    email: 'super@lavanderia.com',
    name: 'Super Admin',
    role: 'super_admin',
    laundryId: '1'
  }
];
