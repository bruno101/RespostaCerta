export default function isValidCPFCNPJ(cpfCnpj: string): boolean {
  const cleanedCpfCnpj = cpfCnpj.replace(/\D/g, ""); // Remove non-numeric characters
  if (cleanedCpfCnpj.length === 11) {
    // Validate CPF
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanedCpfCnpj.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10) remainder = 0;
    if (remainder !== parseInt(cleanedCpfCnpj.charAt(10))) return false;
  } else if (cleanedCpfCnpj.length === 14) {
    // Validate CNPJ
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * weights1[i];
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cleanedCpfCnpj.charAt(12))) return false;

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanedCpfCnpj.charAt(i)) * weights2[i];
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cleanedCpfCnpj.charAt(13))) return false;
  } else {
    return false;
  }

  return true;
}
