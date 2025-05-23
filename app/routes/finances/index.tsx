/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import Pagination from "../../components/pagination";
import DeleteDialog from "~/components/deleteDialog";
import { TrashIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../utils/dateFormat";
import "../../../styles/dashboard.css";

export default function Finances() {
  const { auth, pet, finances } = useGlobalContext();
  const { getPets, allPets } = pet;
  const user = auth.user;
  const [allFinances, setAllFinances] = useState([]);
  const [filteredFinances, setFilteredFinances] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;

  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentFinances = filteredFinances.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFinances.length / itemsPerPage);

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

  const [filterData, setFilterData] = useState({
    start_date: "",
    end_date: "",
  });

  const [isDeleteFinancesDialogOpen, setIsDeleteFinancesDialogOpen] =
    useState(false);

  const [selectFinancesId, setSelectFinancesId] = useState(null);

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
          // setFilteredFinances(data);
          console.log("Mascotas cargadas al refrescar");
        })
        .catch((error) => {
          console.error("Error al cargar mascotas:", error);
        });
    } else {
      console.warn("Token no encontrado o usuario no autenticado");
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      refreshFinances();
    }
  }, [user]);

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

  const handleChangeFilterDate = (e) => {
    const { name, value } = e.target;
    setFilterData((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSaveExpense = async () => {
    try {
      const response = await finances.createFinance(expenseData);
      if (response) {
        await refreshFinances();

        setExpenseData({
          user_id: user.id,
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

        // Opcional: feedback visual
        console.log("Gasto guardado correctamente");
      }
    } catch (error) {
      console.error("Error al guardar el gasto:", error);
      // Aquí podrías mostrar un toast o alerta
    }
  };

  const filterDates = () => {
    const { start_date, end_date } = filterData;

    let filtered = allFinances;

    // Primero filtramos por fecha si el usuario eligió fecha
    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      filtered = filtered.filter((finance) => {
        const expenseDate = new Date(finance.expense_date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
    }

    // Luego filtramos por mascota si el usuario seleccionó una mascota específica
    if (selectedPetId !== 0) {
      filtered = filtered.filter((finance) => finance.pet_id === selectedPetId);
    }

    // Finalmente, seteamos los datos filtrados
    setFilteredFinances(filtered);
  };

  const totalSpentFiltered = filteredFinances.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const filterCurrentMonth = (data) => {
    const now = new Date();
    return data.filter((finance) => {
      const expenseDate = new Date(finance.expense_date);
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    });
  };

  const refreshFinances = async () => {
    if (user && user.id) {
      const data = await finances.getUserFinances(user.id);
      setAllFinances(data);
      setFilteredFinances(filterCurrentMonth(data));
    }
  };

  const openDeleteDialog = (id) => {
    setIsDeleteFinancesDialogOpen(true);
    setSelectFinancesId(id);
  };

  const handleDeleteFinanceFunc = async () => {
    const response = await finances.deleteFinance(selectFinancesId);
    if (response) {
      await closeDeleteModal();
      await refreshFinances();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteFinancesDialogOpen(false);
    setSelectFinancesId(null);
  };
  return (
    <div className="p-5">
      <h2
        className="my-5 text-2xl lg:text-4xl font-bold text-white"
        style={{ fontFamily: "chapFont" }}
      >
        Track your finances
      </h2>
      <div className="border-2 p-5  !border-[#65bcbb] rounded-lg">
        <label className="block text-slate-50">Tus mascotas</label>
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

        <div className="flex gap-2 flex-col md:flex-row mt-4">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">Fecha del gasto</label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Fecha del gasto"
              name="expense_date"
              value={expenseData.expense_date}
              onChange={handleChangeFinances}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          {/* <div className="mb-2 w-full">
            <label className="block text-slate-50">expense_type</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="expense_type"
              name="expense_type"
              value={expenseData.expense_type}
              onChange={handleChangeFinances}
            />
          </div> */}
        </div>
        <div className="flex gap-2 flex-col md:flex-row ">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">Monto</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Monto"
              name="amount"
              value={expenseData.amount}
              onChange={handleChangeFinances}
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">Descripción</label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Descripción"
              name="description"
              value={expenseData.description}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-col md:flex-row ">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">Categoría</label>
            <select
              name="category"
              value={expenseData.category}
              onChange={handleChangeFinances}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Selecciona una categoría</option>
              <option value="Salud">Salud</option>
              <option value="Comida">Comida</option>
              <option value="Entretenimiento">Entretenimiento</option>
              <option value="Aseo">Aseo</option>
              <option value="Seguro">Seguro</option>
              <option value="Transporte">Transporte</option>
              <option value="Entrenamiento">Entrenamiento</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">Método de pago</label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="payment method"
              name="payment_method"
              value={expenseData.payment_method}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex">
          <label className="block text-slate-50">Recurrente</label>
          <input
            type="checkbox"
            className="radio radio-accent ms-3"
            placeholder="recurring"
            name="recurring"
            checked={expenseData.recurring}
            onChange={handleChangeFinances}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveExpense}
            className="border-none py-3 px-4 ms-0 mt-5 bg-teal-500 text-white  rounded-lg  w-full md:w-auto"
          >
            GUARDAR
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5 mt-5">
        <div>
          <h2>Filtro</h2>
          <div className="flex items-center mt-4 justify-between gap-2">
            <div className="w-full">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                name="start_date"
                value={filterData.start_date}
                onChange={handleChangeFilterDate}
              />
            </div>
            <div className="w-full">
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={filterData.end_date}
                name="end_date"
                onChange={handleChangeFilterDate}
              />
            </div>
            <div className="w-full">
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value={0}>Todas las mascotas</option>
                {allPets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                className="px-4 py-2 bg-[#65bcbb] text-white rounded-lg"
                onClick={filterDates}
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>
        <table className="table mt-4">
          {/* head */}
          <thead>
            <tr>
              <th>Dog name</th>
              <th>Expense date</th>
              {/* <th>Expense type</th> */}
              <th>Amount</th>
              <th>Description</th>
              <th>Category</th>
              <th>Payment method</th>
              <th>Recurring</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {currentFinances.map((finance) => (
              <tr key={finance.id}>
                <td>
                  {allPets.find((pet) => pet.id === finance.pet_id)?.name ||
                    "Desconocido"}
                </td>
                <td>{formatDate(finance?.expense_date)}</td>
                {/* <td>{finance?.expense_type}</td> */}
                <td>{finance?.amount}</td>
                <td>{finance?.description}</td>
                <td>{finance?.category}</td>
                <td>{finance?.payment_method}</td>
                <td>{finance?.recurring ? "Sí" : "No"}</td>
                <td>
                  <TrashIcon
                    className="h-6 w-6 text-red-500"
                    onClick={() => openDeleteDialog(finance.id)}
                  />
                </td>
              </tr>
            ))}
            {/* row 2 */}
          </tbody>
        </table>
        {/* //aqui va el monto total gastado AL MES! */}
        <div>GASTO TOTAL:{totalSpentFiltered}</div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <DeleteDialog
        isOpen={isDeleteFinancesDialogOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteFinanceFunc}
        itemName={`finance`}
      />
    </div>
  );
}
