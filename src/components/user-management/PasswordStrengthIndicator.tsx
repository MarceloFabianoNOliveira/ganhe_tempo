
import React from 'react';
import { PasswordValidation } from '@/utils/userValidation';

interface PasswordStrengthIndicatorProps {
  validation: PasswordValidation;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ validation }) => {
  return (
    <div className="space-y-1 text-xs">
      <div className={`flex items-center space-x-2 ${validation.requirements.minLength ? 'text-green-600' : 'text-red-500'}`}>
        <span>{validation.requirements.minLength ? '✓' : '✗'}</span>
        <span>Pelo menos 8 caracteres</span>
      </div>
      <div className={`flex items-center space-x-2 ${validation.requirements.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
        <span>{validation.requirements.hasUppercase ? '✓' : '✗'}</span>
        <span>Pelo menos uma letra maiúscula</span>
      </div>
      <div className={`flex items-center space-x-2 ${validation.requirements.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
        <span>{validation.requirements.hasLowercase ? '✓' : '✗'}</span>
        <span>Pelo menos uma letra minúscula</span>
      </div>
      <div className={`flex items-center space-x-2 ${validation.requirements.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
        <span>{validation.requirements.hasNumbers ? '✓' : '✗'}</span>
        <span>Pelo menos um número</span>
      </div>
      <div className={`flex items-center space-x-2 ${validation.requirements.hasSpecialChar ? 'text-green-600' : 'text-red-500'}`}>
        <span>{validation.requirements.hasSpecialChar ? '✓' : '✗'}</span>
        <span>Pelo menos um caractere especial</span>
      </div>
    </div>
  );
};
