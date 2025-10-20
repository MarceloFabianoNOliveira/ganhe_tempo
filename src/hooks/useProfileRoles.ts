
import { useState, useEffect } from 'react';

export const useProfileRoles = () => {
  const [profileRoles, setProfileRoles] = useState<string[]>([]);

  useEffect(() => {
    // Carregar os perfis disponíveis do localStorage ou usar padrões
    const storedRoles = localStorage.getItem('laundry-profile-roles_v2');
    if (storedRoles) {
      setProfileRoles(JSON.parse(storedRoles));
    } else {
      // Perfis padrão
      const defaultRoles = ['admin', 'manager', 'operator'];
      setProfileRoles(defaultRoles);
      localStorage.setItem('laundry-profile-roles_v2', JSON.stringify(defaultRoles));
    }
  }, []);

  console.log("Profile Roles: ", profileRoles);
  return profileRoles;
};
