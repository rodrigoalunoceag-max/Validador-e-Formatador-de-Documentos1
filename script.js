/**
 * Módulo de Formatação e Tratamento de Dados - CPF
 */

export const unmask = (value = '') => String(value).replace(/\D/g, '');

export function formatCPF(value = '') {
  const digits = unmask(value).slice(0, 11);
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return value;
}

export function buildFormattedPayload(rawData, isCpfValid) {
  const cpfDigits = unmask(rawData.cpf).slice(0, 11);
  const formattedCpf = formatCPF(rawData.cpf);

  return {
    meta: {
      timestamp: new Date().toISOString(),
      statusGeral: isCpfValid ? 'APROVADO' : 'REJEITADO'
    },
    cpf: {
      bruto: rawData.cpf,
      limpo: cpfDigits,
      formatado: formattedCpf,
      valido: Boolean(isCpfValid)
    }
  };
}