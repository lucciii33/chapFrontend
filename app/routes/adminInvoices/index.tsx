import { useEffect } from "react";
import { Link } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";

export default function InvoicesList() {
  const { invoices } = useGlobalContext();

  useEffect(() => {
    invoices.fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Invoices</h2>
      {invoices.invoicesList.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <div className="p-5">
          {invoices.invoicesList.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white  text-black h-auto w-full mt-5 rounded-lg p-4"
            >
              <Link to={`/invoicePdf/${invoice.id}`}>
                <strong>{invoice.invoice_number}</strong> -{" "}
                {invoice.customer_name} - {invoice.total_amount}{" "}
                {invoice.currency}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
