/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Finances() {
  const { auth, pet, finances } = useGlobalContext(); // Accede a la info del usuario
  const { getPets, allPets } = pet;
  const user = auth.user;
  const [allFinances, setAllFinances] = useState([]);
  console.log("allFinances", allFinances);

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token && user) {
      getPets(user.id)
        .then(() => {
          console.log("Mascotas cargadas al refrescar");
        })
        .catch((error) => {
          console.error("Error al cargar mascotas:", error);
        });
    } else {
      console.warn("Token no encontrado o usuario no autenticado");
    }
  }, [user]);
  console.log("allPets", allPets);
  console.log("user MMGBUEVO", user);

  const [expenseData, setExpenseData] = useState({
    user_id: null,
    pet_id: 0,
    expense_date: "",
    amount: 0,
    expense_type: "",
    description: "",
    category: "",
    payment_method: "",
    receipt_photo_url: "dddd",
    recurring: false,
  });

  useEffect(() => {
    if (user && user.id) {
      setExpenseData((prev) => ({
        ...prev,
        user_id: user.id,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      console.log("LLAMANDOOO");
      finances
        .getUserFinances(user.id)
        .then((data) => {
          setAllFinances(data);
          console.log("Mascotas cargadas al refrescar");
        })
        .catch((error) => {
          console.error("Error al cargar mascotas:", error);
        });
    } else {
      console.warn("Token no encontrado o usuario no autenticado");
    }
  }, [user]);

  console.log("expenseData", expenseData);

  const handleChangeFinances = (e) => {
    const { name, value, type, checked } = e.target;
    setExpenseData((prevInfo) => ({
      ...prevInfo,
      [name]:
        name === "pet_id"
          ? Number(value)
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSaveExpense = () => {
    finances.createFinance(expenseData);
  };

  const totalSpentThisMonth = allFinances.reduce((total, expense) => {
    const expenseDate = new Date(expense?.expense_date);
    const now = new Date();

    const isSameMonth =
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear();

    return isSameMonth ? total + Number(expense?.amount) : total;
  }, 0);

  return (
    <div className="p-5">
      <h2 className="my-5">Track your finances</h2>
      <div className="border-2 p-5  !border-[#65bcbb] rounded-lg">
        <select
          name="pet_id"
          className="w-full px-4 py-2 border rounded-lg"
          value={expenseData.pet_id}
          onChange={handleChangeFinances}
        >
          <option value={0}>Selecciona una mascota</option>
          {allPets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 mt-4">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">expense_date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="expense_date"
              name="expense_date"
              value={expenseData.expense_date}
              onChange={handleChangeFinances}
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">expense_type</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="expense_type"
              name="expense_type"
              value={expenseData.expense_type}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">amount</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="amount"
              name="amount"
              value={expenseData.amount}
              onChange={handleChangeFinances}
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">description</label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="description"
              name="description"
              value={expenseData.description}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">category</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="category"
              name="category"
              value={expenseData.category}
              onChange={handleChangeFinances}
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">payment_method</label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="payment_method"
              name="payment_method"
              value={expenseData.payment_method}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex">
          <label className="block text-slate-50">recurring</label>
          <input
            type="checkbox"
            className="px-4 py-2 border rounded-lg"
            placeholder="recurring"
            name="recurring"
            checked={expenseData.recurring}
            onChange={handleChangeFinances}
          />
        </div>
        <div>
          <button
            onClick={handleSaveExpense}
            className="mt-4 px-4 py-2 bg-[#65bcbb] text-white rounded-lg"
          >
            SAVE
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5 mt-5">
        <div>
          <h2>filter</h2>
          <div className="flex items-center mt-4 justify-between gap-2">
            <div className="w-full">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="w-full">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <button className="px-4 py-2 bg-[#65bcbb] text-white rounded-lg">
                SAVE
              </button>
            </div>
          </div>
        </div>
        <table className="table mt-4">
          {/* head */}
          <thead>
            <tr>
              <th>Dog name</th>
              <th>expense_date</th>
              <th>expense_type</th>
              <th>amount</th>
              <th>description</th>
              <th>category</th>
              <th>payment_method</th>
              <th>recurring</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {allFinances.map((finance) => (
              <tr key={finance.id}>
                <td>
                  {allPets.find((pet) => pet.id === finance.pet_id)?.name ||
                    "Desconocido"}
                </td>
                <td>{finance?.expense_date}</td>
                <td>{finance?.expense_type}</td>
                <td>{finance?.amount}</td>
                <td>{finance?.description}</td>
                <td>{finance?.category}</td>
                <td>{finance?.payment_method}</td>
                <td>{finance?.recurring ? "Sí" : "No"}</td>
              </tr>
            ))}
            {/* row 2 */}
          </tbody>
        </table>
        {/* //aqui va el monto total gastado AL MES! */}
        <div>RESUTL HERE:{totalSpentThisMonth}</div>
      </div>
    </div>
  );
}
