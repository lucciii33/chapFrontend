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

    await inventory.createInventoryItem(inventoryCreate);

    setInventoryCreate({
      type_tag: "",
      color: "",
      quantity: 0,
      description: "",
    });
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
      <ul className="mt-2">
        {inventory.inventoryItems.map((item) => (
          <li
            key={item.id}
            className="mb-1 border p-2 rounded bg-white shadow-sm text-black"
          >
            {item.type_tag} - {item.color} — {item.quantity} unidades
          </li>
        ))}
      </ul>
    </div>
  );
}
