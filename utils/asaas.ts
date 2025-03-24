// utils/asaas.ts
import axios from "axios";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY; // Store your ASAAS API key in .env
const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3";

export const createSubscriptionPlan = async () => {
  const url = `${ASAAS_API_URL}/subscriptions`;

  const data = {
    name: "Premium Plan",
    description: "Unlimited access to simulados and corrections",
    billingType: "CREDIT_CARD",
    cycle: "MONTHLY",
    value: 5.0,
    currency: "BRL",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating subscription plan:",
      (error as any).response?.data
    );
    throw error;
  }
};

// utils/asaas.ts
export const createCustomer = async (
  name: string,
  email: string,
  cpfCnpj: string
) => {
  const url = `${ASAAS_API_URL}/customers`;

  const data = {
    name: name,
    email: email,
    cpfCnpj: cpfCnpj,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
    });
    return response.data.id; // Return the customer ID
  } catch (error) {
    console.error("Error creating customer:", (error as any).response?.data);
    throw error;
  }
};

// utils/asaas.ts
export const createSubscription = async (
  customerId: string,
  planId: string
) => {
  const url = `${ASAAS_API_URL}/subscriptions`;

  const data = {
    customer: customerId,
    billingType: "CREDIT_CARD",
    value: 5.0,
    cycle: "MONTHLY",
    nextDueDate: "2023-12-01", // Replace with the desired due date
    description: "Premium Subscription",
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating subscription:",
      (error as any).response?.data
    );
    throw error;
  }
};
