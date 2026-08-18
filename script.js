/**
 * PROJETO 5: Validador e Formatador de Documentos
 * Módulo Unificado (Aluno A + Aluno B)
 */

// ==========================================
// 1. FUNÇÕES DO ALUNO A
// (Algoritmo de cálculo e validação de CPF)
// ==========================================

/**
 * Valida o CPF calculando os dígitos verificadores (DV1 e DV2)
 * @param {string} cpf 
 * @returns {boolean}
 */
export function validateCPF(cpf = '') {
  const digits = String(cpf).replace(/\D/g, '');

  // O CPF precisa ter 11 dígitos e não ter todos os números iguais
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  // Cálculo do 1º Dígito Verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const dv1 = (remainder === 10 || remainder === 11) ? 0 : remainder;

  if (dv1 !== parseInt(digits.charAt(9), 10)) {
    return false;
  }

  // Cálculo do 2º Dígito Verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const dv2 = (remainder === 10 || remainder === 11) ? 0 : remainder;

  if (dv2 !== parseInt(digits.charAt(10), 10)) {
    return false;
  }

  return true;
}


// ==========================================
// 2. FUNÇÕES DO ALUNO B
// (Máscaras, validações de CEP/Telefone e exibição final)
// ==========================================

/**
 * Remove qualquer caractere que não seja dígito numérico
 * @param {string} value 
 * @returns {string}
 */
export const unmask = (value = '') => String(value).replace(/\D/g, '');

/**
 * Formata CEP no padrão 00000-000
 * @param {string} value 
 * @returns {string}
 */
export function formatCEP(value = '') {
  const digits = unmask(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Valida se o CEP possui 8 dígitos
 * @param {string} value 
 * @returns {boolean}
 */
export function validateCEP(value = '') {
  return unmask(value).length === 8;
}

/**
 * Formata Telefone com DDD dinamicamente (Fixo ou Celular)
 * @param {string} value 
 * @returns {string}
 */
export function formatPhone(value = '') {
  const digits = unmask(value).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Valida se o telefone tem 10 ou 11 dígitos
 * @param {string} value 
 * @returns {boolean}
 */
export function validatePhone(value = '') {
  const len = unmask(value).length;
  return len === 10 || len === 11;
}

/**
 * Constrói o relatório final combinando as validações do Aluno A e do Aluno B
 * @param {Object} rawData 
 * @returns {Object}
 */
export function buildFormattedPayload(rawData) {
  const isCpfValid = validateCPF(rawData.cpf);
  const isPhoneValid = validatePhone(rawData.telefone);
  const isCepValid = validateCEP(rawData.cep);

  const cpfDigits = unmask(rawData.cpf).slice(0, 11);
  const formattedCpf = cpfDigits.length === 11 
    ? cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') 
    : rawData.cpf;

  return {
    meta: {
      timestamp: new Date().toISOString(),
      statusGeral: isCpfValid && isPhoneValid && isCepValid ? 'APROVADO' : 'REJEITADO'
    },
    cpf: {
      bruto: rawData.cpf,
      limpo: cpfDigits,
      formatado: formattedCpf,
      valido: isCpfValid
    },
    telefone: {
      bruto: rawData.telefone,
      limpo: unmask(rawData.telefone),
      formatado: formatPhone(rawData.telefone),
      tipo: unmask(rawData.telefone).length === 11 ? 'Móvel' : 'Fixo',
      valido: isPhoneValid
    },
    cep: {
      bruto: rawData.cep,
      limpo: unmask(rawData.cep),
      formatado: formatCEP(rawData.cep),
      valido: isCepValid
    }
  };
}


// ==========================================
// 3. INTEGRAÇÃO COM A INTERFACE (DOM)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const inputCpf = document.getElementById('cpf');
  const inputTelefone = document.getElementById('telefone');
  const inputCep = document.getElementById('cep');
  const form = document.getElementById('formDados');
  const elementoResultado = document.getElementById('resultado');

  // Máscaras em tempo real
  inputTelefone?.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
  });

  inputCep?.addEventListener('input', (e) => {
    e.target.value = formatCEP(e.target.value);
  });

  // Envio e geração do relatório
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawData = {
      cpf: inputCpf.value,
      telefone: inputTelefone.value,
      cep: inputCep.value
    };

    const payload = buildFormattedPayload(rawData);

    if (elementoResultado) {
      elementoResultado.style.display = 'block';
      elementoResultado.textContent = JSON.stringify(payload, null, 2);
    }
  });
});