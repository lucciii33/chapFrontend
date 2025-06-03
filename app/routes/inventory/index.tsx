import DeleteDialog from "~/components/deleteDialog";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState, useEffect } from "react";

export default function Inventory() {
  const { inventory } = useGlobalContext();

  const [inventoryCreate, setInventoryCreate] = useState({
    type_tag: "",
    color: "",
    quantity: 0,
    description: "",
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpenDelete, setOpenModalDelete] = useState(false);

  useEffect(() => {
    inventory.getAllInventoryItems();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventoryCreate((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const { type_tag, color, quantity } = inventoryCreate;
    if (!type_tag || !color || quantity <= 0) return;

    if (editingItemId) {
      await inventory.editInventoryItem(editingItemId, {
        quantity,
        description: inventoryCreate.description,
      });
    } else {
      await inventory.createInventoryItem(inventoryCreate);
    }

    setInventoryCreate({
      type_tag: "",
      color: "",
      quantity: 0,
      description: "",
    });

    setEditingItemId(null);
  };

  const selectDeleteId = async (id) => {
    setDeleteId(id);
    setOpenModalDelete(true);
  };

  const handleDeleteInvetoryFunc = async () => {
    const response = await inventory.deleteInventoryItem(deleteId);
    if (response) {
      setOpenModalDelete(false);
    }
  };

  return (
    <div className="p-[40px]">
      <h2 className="text-xl font-bold mb-4 text-teal-600">
        Crear nuevo inventario
      </h2>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="type_tag"
          value={inventoryCreate.type_tag}
          onChange={handleChange}
          placeholder="Tipo (circular, square...)"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="color"
          value={inventoryCreate.color}
          onChange={handleChange}
          placeholder="Color"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="quantity"
          value={inventoryCreate.quantity}
          onChange={handleChange}
          placeholder="Cantidad"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="description"
          value={inventoryCreate.description}
          onChange={handleChange}
          placeholder="Descripción (opcional)"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleSubmit}
          className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600"
        >
          Crear
        </button>
      </div>

      <h3 className="text-lg font-semibold mt-8">Inventario actual</h3>
      <div className="mt-2">
        {inventory.inventoryItems.map((item) => (
          <div
            key={item.id}
            className="mb-1 border p-2 rounded bg-white shadow-sm text-black flex justify-between items-center"
          >
            <div>
              {item.type_tag} - {item.color} — {item.quantity} unidades
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setInventoryCreate({
                    type_tag: item.type_tag,
                    color: item.color,
                    quantity: item.quantity,
                    description: item.description || "",
                  });
                  setEditingItemId(item.id);
                }}
              >
                Editar
              </button>
              <button
                onClick={() => {
                  selectDeleteId(item.id);
                }}
              >
                delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <DeleteDialog
        isOpen={modalOpenDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleDeleteInvetoryFunc}
        itemName={`Inventory`}
      />
    </div>
  );
}
