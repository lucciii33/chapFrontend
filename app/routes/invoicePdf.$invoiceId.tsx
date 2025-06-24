import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import { useEffect, useState, useRef } from "react";

export default function InvoicePdf() {
  const { invoiceId } = useParams();
  const { invoices } = useGlobalContext();
  const [invoice, setInvoice] = useState<any>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getIt = async () => {
      const data = await invoices.fetchInvoiceById(Number(invoiceId));
      setInvoice(data);
    };
    if (invoiceId) getIt();
  }, [invoiceId]);

  if (!invoice) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div
      className="p-10 bg-white m-3 border border-gray-30 shadow text-black"
      ref={invoiceRef}
    >
      <header className="border-b pb-4 mb-6 text-black">
        <h1 className="text-3xl font-bold">{invoice.business_name}</h1>
        <p className="text-gray-600">{invoice.business_address}</p>
      </header>

      <section className="flex justify-between mb-6 text-black">
        <div>
          <h2 className="text-xl font-semibold">Factura</h2>
          <p>
            <span className="font-semibold">Número:</span>{" "}
            {invoice.invoice_number}
          </p>
          <p>
            <span className="font-semibold">Fecha:</span>{" "}
            {new Date(invoice.created_at).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Cliente</h3>
          <p>{invoice.customer_name}</p>
          <p>{invoice.customer_address}</p>
          <p>{invoice.customer_email}</p>
        </div>
      </section>

      <table className="w-full text-left border-collapse mb-6 text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Base</th>
            <th className="border p-2">IVA</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody className="text-black">
          <tr>
            <td className="border p-2">Servicio/Producto</td>
            <td className="border p-2">
              {invoice.base_amount.toFixed(2)} {invoice.currency.toUpperCase()}
            </td>
            <td className="border p-2">
              {invoice.iva_amount.toFixed(2)} {invoice.currency.toUpperCase()}
            </td>
            <td className="border p-2">
              {invoice.total_amount.toFixed(2)} {invoice.currency.toUpperCase()}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-right text-xl font-bold text-black">
        Total a pagar: {invoice.total_amount.toFixed(2)}{" "}
        {invoice.currency.toUpperCase()}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => invoices.downloadInvoicePdf(Number(invoiceId))}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 transition"
        >
          Descargar PDF (BACKEND)
        </button>
      </div>
    </div>
  );
}
