// Helper function to validate credit card number using Luhn algorithm
export default function isValidCreditCardNumber(cardNumber: string): boolean {
  const cleanedCardNumber = cardNumber.replace(/\D/g, ""); // Remove non-numeric characters
  if (
    !cleanedCardNumber ||
    cleanedCardNumber.length < 13 ||
    cleanedCardNumber.length > 19
  ) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < cleanedCardNumber.length; i++) {
    let digit = parseInt(cleanedCardNumber.charAt(i), 10);
    if ((cleanedCardNumber.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  return sum % 10 === 0;
}
