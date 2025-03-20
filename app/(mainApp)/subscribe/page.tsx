"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cpfCnpj: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    holderName: "",
    postalCode: "",
    addressNumber: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create a customer in ASAAS
      const customerResponse = await axios.post("/api/customer", {
        name: formData.name,
        cpfCnpj: formData.cpfCnpj,
      });

      const customerId = customerResponse.data.id;

      // Step 2: Create a subscription in ASAAS
      const subscriptionResponse = await axios.post("/api/subscription", {
        customerId,
        cardNumber: formData.cardNumber,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        ccv: formData.ccv,
        holderName: formData.holderName,
        cpfCnpj: formData.cpfCnpj,
        postalCode: formData.postalCode,
        addressNumber: formData.addressNumber,
        phone: formData.phone,
      });

      // Redirect to a success page
      router.push("/subscribe/success");
    } catch (error) {
      console.error("Subscription failed:", (error as any).response?.data);
      setError("A subscrição ffalhou:\n" + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-cyan-900 mb-6">
          Assinar Premium
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Details */}
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              Nome
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              CPF/CNPJ
            </label>
            <input
              type="text"
              name="cpfCnpj"
              value={formData.cpfCnpj}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Credit Card Details */}
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              Número do Cartão
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-700">
                Mês de Expiração
              </label>
              <input
                type="text"
                name="expiryMonth"
                value={formData.expiryMonth}
                onChange={handleChange}
                required
                placeholder="MM"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cyan-700">
                Ano de Expiração
              </label>
              <input
                type="text"
                name="expiryYear"
                value={formData.expiryYear}
                onChange={handleChange}
                required
                placeholder="YYYY"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              CVV
            </label>
            <input
              type="text"
              name="ccv"
              value={formData.ccv}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              Nome no Cartão
            </label>
            <input
              type="text"
              name="holderName"
              value={formData.holderName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Additional Fields */}
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              CEP
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              Número do Endereço
            </label>
            <input
              type="text"
              name="addressNumber"
              value={formData.addressNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cyan-700">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
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
      </div>
    </div>
  );
}
