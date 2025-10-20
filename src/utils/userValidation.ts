
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
  };
}

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  if (!requirements.minLength) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (!requirements.hasUppercase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!requirements.hasLowercase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!requirements.hasNumbers) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!requirements.hasSpecialChar) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requirements
  };
};
