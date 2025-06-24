import { useState, useEffect } from "react";

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_address: string;
  business_name: string;
  business_address: string;
  base_amount: number;
  iva_amount: number;
  total_amount: number;
  currency: string;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export const useInvoiceAdminContext = () => {
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const fetchInvoices = async () => {
    console.log("LLAMANDOOOO");
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/api/invoices`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setInvoicesList(data);
    } catch (err: any) {
      setError(err.message || "Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceById = async (invoiceId: number) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_URL}/api/invoices/${invoiceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data as Invoice;
  };

  const downloadInvoicePdf = async (invoiceId: number) => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    // ⚡ HACES FETCH porque necesitas HEADER
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_URL}/api/invoices/${invoiceId}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Factura_${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return {
    invoicesList,
    loading,
    error,
    fetchInvoices,
    fetchInvoiceById,
    downloadInvoicePdf,
  };
};
