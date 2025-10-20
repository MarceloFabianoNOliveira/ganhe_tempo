
export const getRoleDisplay = (role: string): string => {
  
  if(role === 'admin') return 'Administrador';
  if(role === 'manager') return 'Gerente';
  if(role === 'operator') return 'Operador';

  //return role === 'admin' ? 'Administrador' : 'Operador';
};

export const getRoleBadgeColor = (role: string): string => {
  if(role === 'admin') return 'bg-blue-100 text-blue-800';
  if(role === 'manager') return 'bg-green-100 text-green-800';
  if(role === 'operator') return 'bg-yellow-100 text-yellow-800';
  
};
