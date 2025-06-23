import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import { useEffect, useState } from "react";

export default function InvoicePdf() {
  const { invoiceId } = useParams();
  const { invoices } = useGlobalContext();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const getIt = async () => {
      const data = await invoices.fetchInvoiceById(Number(invoiceId));
      setInvoice(data);
    };
    if (invoiceId) getIt();
  }, [invoiceId]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <h1>Factura: {invoice?.invoice_number}</h1>
      <p>Cliente: {invoice?.customer_name}</p>
      <p>
        Total: {invoice?.total_amount} {invoice?.currency}
      </p>
      <button onClick={() => window.print()}>Imprimir / PDF</button>
    </div>
  );
}
