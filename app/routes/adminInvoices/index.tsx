import { useGlobalContext } from "~/context/GlobalProvider";

export default function InvoicesList() {
  const { invoices } = useGlobalContext();

  return (
    <div>
      <h2>Invoices</h2>
      {invoices.invoicesList.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul>
          {invoices.invoicesList.map((invoice) => (
            <li key={invoice.id}>
              <strong>{invoice.invoice_number}</strong> -{" "}
              {invoice.customer_name} - {invoice.total_amount}{" "}
              {invoice.currency}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
