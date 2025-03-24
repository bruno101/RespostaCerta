"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import isValidCreditCardNumber from "@/utils/validation/is-valid-credit-card-number";
import isValidCPFCNPJ from "@/utils/validation/is-valid-cpf-cnpj";
import isValidExpirationDate from "@/utils/validation/is-valid-expiration-date";

export default function SubscriptionForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const [invalidDate, setInvalidDate] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    holderName: "",
    postalCode: "",
    addressNumber: "",
    phone: "",
  });

  // Format CPF (xxx.xxx.xxx-xx)
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/(\d{3})(\d)/, "$1.$2") // Add dot after 3 digits
      .replace(/(\d{3})(\d)/, "$1.$2") // Add dot after 6 digits
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Add dash after 9 digits
  };

  // Format Card Number (xxxx xxxx xxxx xxxx)
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/(\d{4})(\d)/, "$1 $2") // Add space after 4 digits
      .replace(/(\d{4})(\d)/, "$1 $2") // Add space after 8 digits
      .replace(/(\d{4})(\d)/, "$1 $2"); // Add space after 12 digits
  };

  // Format CEP (xxxxx-xxx)
  const formatPostalCode = (value: string) => {
    return value
      .replace(/\D/g, "") // Remove non-digits
      .replace(/(\d{5})(\d)/, "$1-$2"); // Add dash after 5 digits
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");

    // Apply formatting based on the length of the cleaned string
    if (cleaned.length <= 2) {
      return cleaned; // No formatting needed for the first 2 digits
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`; // Format as (XX) XXXXX
    } else {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
        7,
        11
      )}`; // Format as (XX) XXXXX-XXXX
    }
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) error = "Nome é obrigatório";
        break;
      case "cpf":
        if (!value) error = "CPF é obrigatório";
        else if (
          !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value) ||
          !isValidCPFCNPJ(value)
        )
          error = "CPF inválido";
        break;
      case "cardNumber":
        if (!value) error = "Número do cartão é obrigatório";
        else if (
          !/^\d{4} \d{4} \d{4} \d{4}$/.test(value) ||
          !isValidCreditCardNumber(value)
        )
          error = "Número do cartão inválido";
        break;
      case "expiryMonth":
        if (!value) error = "Mês de expiração é obrigatório";
        else if (!/^(0?[1-9]|1[0-2])$/.test(value))
          error = "Mês de expiração inválido";
        break;
      case "expiryYear":
        if (!value) error = "Ano de expiração é obrigatório";
        else if (!/^\d{4}$/.test(value)) error = "Ano de expiração inválido";
        break;
      case "ccv":
        if (!value) error = "CVV é obrigatório";
        else if (!/^\d{3,4}$/.test(value)) error = "CVV inválido";
        break;
      case "holderName":
        if (!value) error = "Nome no cartão é obrigatório";
        break;
      case "postalCode":
        if (!value) error = "CEP é obrigatório";
        else if (!/^\d{5}-\d{3}$/.test(value)) error = "CEP inválido";
        break;
      case "addressNumber":
        if (!value) error = "Número do endereço é obrigatório";
        break;
      case "phone":
        if (!value) error = "Telefone é obrigatório";
        else if (!/^\d{10,11}$/.test(value)) error = "Telefone inválido";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Apply formatting based on the field
    if (name === "cpf") {
      formattedValue = formatCPF(value);
    } else if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "postalCode") {
      formattedValue = formatPostalCode(value);
    } else if (name === "phone") {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    // Validate the field only if it has been touched (blurred)
    if (touchedFields[name]) {
      const error = validateField(name, formattedValue);
      setValidationErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (
      (name === "expiryYear" &&
        !isValidExpirationDate(formData.expiryMonth, formattedValue)) ||
      (name === "expiryMonth" &&
        !isValidExpirationDate(formattedValue, formData.expiryYear))
    ) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mark the field as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Validate the field
    const error = validateField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: error }));

    if (
      (name === "expiryYear" || name === "expiryMonth") &&
      !isValidExpirationDate(formData.expiryMonth, formData.expiryYear)
    ) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields before submission
    const errors: Record<string, string> = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);
      if (error) errors[name] = error;
    });
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create a customer in ASAAS
      const customerResponse = await axios.post("/api/customers", {
        name: formData.name,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatting before sending
      });

      const customerId = customerResponse.data.id;

      // Step 2: Create a subscription in ASAAS
      const subscriptionResponse = await axios.post("/api/subscriptions", {
        customerId,
        cardNumber: formData.cardNumber.replace(/\D/g, ""), // Remove formatting before sending
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        ccv: formData.ccv,
        holderName: formData.holderName,
        cpf: formData.cpf.replace(/\D/g, ""), // Remove formatting before sending
        postalCode: formData.postalCode.replace(/\D/g, ""), // Remove formatting before sending
        addressNumber: formData.addressNumber,
        phone: formData.phone,
      });

      // Redirect to a success page
      router.push("/subscribe/success");
    } catch (error) {
      console.error("Subscription failed:", (error as any).response?.data);
      setError("A subscrição falhou:\n" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* User Details */}
        <div>
          <label className="block text-sm font-medium text-cyan-600">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`text-sm w-full p-2 border ${
              touchedFields.name && validationErrors.name
                ? "border-red-500"
                : touchedFields.name && formData.name
                ? "border-green-500"
                : "border-gray-300"
            } rounded-lg`}
          />
          {touchedFields.name && validationErrors.name && (
            <p className="text-red-500 text-sm">{validationErrors.name}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-cyan-600">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder={"xxx.xxx.xxx-xx"}
              maxLength={14} // xxx.xxx.xxx-xx
              className={`tracking-widest text-sm w-full p-2 border ${
                touchedFields.cpf && validationErrors.cpf
                  ? "border-red-500"
                  : touchedFields.cpf && formData.cpf
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.cpf && validationErrors.cpf && (
              <p className="text-red-500 text-sm">{validationErrors.cpf}</p>
            )}
          </div>

          {/* Credit Card Details */}
          <div className="w-full">
            <label className="block text-sm font-medium text-cyan-600">
              Número do Cartão
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={"xxxx xxxx xxxx xxxx"}
              required
              maxLength={19} // xxxx xxxx xxxx xxxx
              className={`text-sm tracking-widest w-full p-2 border ${
                touchedFields.cardNumber && validationErrors.cardNumber
                  ? "border-red-500"
                  : touchedFields.cardNumber && formData.cardNumber
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.cardNumber && validationErrors.cardNumber && (
              <p className="text-red-500 text-sm">
                {validationErrors.cardNumber}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block md:hidden lg:block text-sm font-medium text-cyan-600">
              Mês de Expiração
            </label>
            <label className="hidden md:block lg:hidden text-sm font-medium text-cyan-600">
              Mês de Expir.
            </label>
            <input
              type="text"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="mm"
              className={`text-sm tracking-widest w-full p-2 border ${
                (touchedFields.expiryMonth && validationErrors.expiryMonth) ||
                (touchedFields.expiryMonth &&
                  touchedFields.expiryYear &&
                  invalidDate)
                  ? "border-red-500"
                  : touchedFields.expiryMonth && formData.expiryMonth
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.expiryMonth && validationErrors.expiryMonth && (
              <p className="text-red-500 text-sm">
                {validationErrors.expiryMonth}
              </p>
            )}
            {touchedFields.expiryMonth &&
              touchedFields.expiryYear &&
              invalidDate && (
                <p className="text-red-500 text-sm">Data inválida</p>
              )}
          </div>
          <div>
            <label className="block md:hidden lg:block text-sm font-medium text-cyan-600">
              Ano de Expiração
            </label>
            <label className="hidden md:block lg:hidden text-sm font-medium text-cyan-600">
              Ano de Expir.
            </label>
            <input
              type="text"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="yyyy"
              className={`tracking-widest text-sm w-full p-2 border ${
                (touchedFields.expiryYear && validationErrors.expiryYear) ||
                (touchedFields.expiryMonth &&
                  touchedFields.expiryYear &&
                  invalidDate)
                  ? "border-red-500"
                  : touchedFields.expiryYear && formData.expiryYear
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.expiryYear && validationErrors.expiryYear && (
              <p className="text-red-500 text-sm">
                {validationErrors.expiryYear}
              </p>
            )}
            {touchedFields.expiryMonth &&
              touchedFields.expiryYear &&
              invalidDate && (
                <p className="text-red-500 text-sm">Data inválida</p>
              )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-600">
              CVV
            </label>
            <input
              type="text"
              name="ccv"
              placeholder={"xxx"}
              value={formData.ccv}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`text-sm tracking-widest w-full p-2 border ${
                touchedFields.ccv && validationErrors.ccv
                  ? "border-red-500"
                  : touchedFields.ccv && formData.ccv
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.ccv && validationErrors.ccv && (
              <p className="text-red-500 text-sm">{validationErrors.ccv}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-600">
            Nome no Cartão
          </label>
          <input
            type="text"
            name="holderName"
            value={formData.holderName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`text-sm w-full p-2 border ${
              touchedFields.holderName && validationErrors.holderName
                ? "border-red-500"
                : touchedFields.holderName && formData.holderName
                ? "border-green-500"
                : "border-gray-300"
            } rounded-lg`}
          />
          {touchedFields.holderName && validationErrors.holderName && (
            <p className="text-red-500 text-sm">
              {validationErrors.holderName}
            </p>
          )}
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cyan-600">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="(xx) xxxxx-xxxx"
              required
              className={`w-full text-sm tracking-widest p-2 border ${
                touchedFields.phone && validationErrors.phone
                  ? "border-red-500"
                  : touchedFields.phone && formData.phone
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.phone && validationErrors.phone && (
              <p className="text-red-500 text-sm">{validationErrors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-600">
              CEP
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder={"xxxxx-xx"}
              maxLength={9} // xxxxx-xxx
              className={`w-full tracking-widest text-sm p-2 border ${
                touchedFields.postalCode && validationErrors.postalCode
                  ? "border-red-500"
                  : touchedFields.postalCode && formData.postalCode
                  ? "border-green-500"
                  : "border-gray-300"
              } rounded-lg`}
            />
            {touchedFields.postalCode && validationErrors.postalCode && (
              <p className="text-red-500 text-sm">
                {validationErrors.postalCode}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-600">
            Endereço
          </label>
          <input
            type="text"
            name="addressNumber"
            placeholder="Rua x, nº y - complemento z "
            value={formData.addressNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`text-sm w-full p-2 border ${
              touchedFields.addressNumber && validationErrors.addressNumber
                ? "border-red-500"
                : touchedFields.addressNumber && formData.addressNumber
                ? "border-green-500"
                : "border-gray-300"
            } rounded-lg`}
          />
          {touchedFields.addressNumber && validationErrors.addressNumber && (
            <p className="text-red-500 text-sm">
              {validationErrors.addressNumber}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-all"
        >
          {loading ? "Processando..." : "Assinar por R$5/mês"}
        </button>
      </form>
    </>
  );
}
