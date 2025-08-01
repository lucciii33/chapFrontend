/* eslint-disable jsx-a11y/label-has-associated-control */
import "../../../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeleteDialog from "~/components/deleteDialog";

export default function AdminWaitList() {
  const { t, i18n } = useTranslation();

  const { waitlist } = useGlobalContext();

  const [entries, setEntries] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await waitlist.fetchWaitlist();
      if (result) setEntries(result);
    };
    loadData();
  }, []);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId === null) return;

    const success = await waitlist.deleteWaitlistEntry(selectedId);
    if (success) {
      // puedes usar loadData() si quieres traerlo de nuevo del server
      setEntries((prev) => prev.filter((e) => e.id !== selectedId));
    }
    setIsDialogOpen(false);
    setSelectedId(null);
  };

  return (
    <div className="">
      <div className="p-6 text-black">
        <h1 className="text-xl font-bold mb-4 text-white">Lista de espera</h1>

        {entries.length === 0 ? (
          <p>No hay registros aún.</p>
        ) : (
          <table className="w-full text-left border border-collapse border-slate-300">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-300 px-3 py-2">Nombre</th>
                <th className="border border-slate-300 px-3 py-2">Email</th>
                <th className="border border-slate-300 px-3 py-2">País</th>
                <th className="border border-slate-300 px-3 py-2">Fecha</th>
                <th className="border border-slate-300 px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="text-white">
                  <td className="border border-slate-300 px-3 py-2">
                    {entry.full_name}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {entry.email}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {entry.country}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    <button onClick={() => handleDeleteClick(entry.id)}>
                      <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700 transition" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <DeleteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedId(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName=""
      />
    </div>
  );
}
