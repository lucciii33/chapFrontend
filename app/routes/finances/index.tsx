/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import Pagination from "../../components/pagination";
import DeleteDialog from "~/components/deleteDialog";
import { TrashIcon } from "@heroicons/react/24/solid";
import { formatDate } from "../../utils/dateFormat";
import "../../../styles/dashboard.css";
import { useTranslation } from "react-i18next";

export default function Finances() {
  const { auth, pet, finances } = useGlobalContext();
  const { getPets, allPets } = pet;
  const { t } = useTranslation();

  console.log("allPetsallPets", allPets);
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
    if (name === "pet_id") {
      const selectedPet = allPets.find((pet) => pet.id === Number(value));
      const hasPurchasedTag = selectedPet?.tags?.some(
        (tag) => tag.is_purchased
      );

      if (!hasPurchasedTag) {
        document.getElementById("purchase_aler_2").showModal();
      }
    }
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
    const selectedPet = allPets.find((pet) => pet.id === expenseData.pet_id);
    const hasPurchasedTag = selectedPet?.tags?.some((tag) => tag.is_purchased);

    if (!hasPurchasedTag) {
      document.getElementById("purchase_aler_2").showModal();
      return;
    }
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
        {t("expenses.title")}
      </h2>
      <div className="border-2 p-5  !border-[#65bcbb] rounded-lg">
        <label className="block text-slate-50">{t("expenses.yourPets")}</label>
        <select
          name="pet_id"
          className="w-full px-4 py-2 border rounded-lg"
          value={expenseData.pet_id}
          onChange={handleChangeFinances}
        >
          <option value={0}>{t("expenses.selectPet")}</option>
          {allPets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 flex-col md:flex-row mt-4">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">
              {t("expenses.expenseDate")}
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("expenses.expenseDate")}
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
            <label className="block text-slate-50">
              {t("expenses.amount")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("expenses.amount")}
              name="amount"
              value={expenseData.amount}
              onChange={handleChangeFinances}
            />
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">
              {t("expenses.description")}
            </label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("expenses.description")}
              name="description"
              value={expenseData.description}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-col md:flex-row ">
          <div className="mb-2 w-full">
            <label className="block text-slate-50">
              {t("expenses.category")}
            </label>
            <select
              name="category"
              value={expenseData.category}
              onChange={handleChangeFinances}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">{t("expenses.selectCategory")}</option>
              <option value="Salud">
                {t("expenses.categoryOptions.health")}
              </option>
              <option value="Comida">
                {t("expenses.categoryOptions.food")}
              </option>
              <option value="Entretenimiento">
                {t("expenses.categoryOptions.entertainment")}
              </option>
              <option value="Aseo">
                {t("expenses.categoryOptions.grooming")}
              </option>
              <option value="Seguro">
                {t("expenses.categoryOptions.insurance")}
              </option>
              <option value="Transporte">
                {t("expenses.categoryOptions.transportation")}
              </option>
              <option value="Entrenamiento">
                {t("expenses.categoryOptions.training")}
              </option>
              <option value="Otros">
                {t("expenses.categoryOptions.other")}
              </option>
            </select>
          </div>
          <div className="mb-2 w-full">
            <label className="block text-slate-50">
              {t("expenses.paymentMethod")}
            </label>
            <input
              //   type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("expenses.paymentMethod")}
              name="payment_method"
              value={expenseData.payment_method}
              onChange={handleChangeFinances}
            />
          </div>
        </div>
        <div className="flex">
          <label className="block text-slate-50">
            {t("expenses.recurring")}
          </label>
          <input
            type="checkbox"
            className="radio radio-accent ms-3"
            placeholder={t("expenses.recurring")}
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
            {t("expenses.saveButton")}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-5 mt-5">
        <div>
          <h2> {t("expenses.filters")}</h2>
          <div className="flex flex-col md:flex-row items-center mt-4 justify-between gap-2">
            <div className="w-full">
              <label>{t("expenses.expense_label_from")}</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                name="start_date"
                value={filterData.start_date}
                onChange={handleChangeFilterDate}
              />
            </div>
            <div className="w-full">
              <label>{t("expenses.expense_label_To")}</label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded-lg"
                value={filterData.end_date}
                name="end_date"
                onChange={handleChangeFilterDate}
              />
            </div>
            <div className="w-full">
              <label>{t("expenses.expense_label_dogs")}</label>
              <select
                value={selectedPetId}
                onChange={(e) => setSelectedPetId(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value={0}>{t("expenses.expense_label_select")}</option>
                {allPets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <button
                className="w-full md:w-auto px-4 py-2 bg-[#65bcbb] text-white rounded-lg"
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
              <th>{t("expenses.tableHeaders.name")}</th>
              <th>{t("expenses.tableHeaders.expenseDate")}</th>
              {/* <th>Expense type</th> */}
              <th>{t("expenses.tableHeaders.amount")}</th>
              <th>{t("expenses.tableHeaders.description")}</th>
              <th>{t("expenses.tableHeaders.category")}</th>
              <th>{t("expenses.tableHeaders.paymentMethod")}</th>
              <th>{t("expenses.tableHeaders.recurring")}</th>
              <th>{t("expenses.tableHeaders.action")}</th>
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
        <div>
          {t("expenses.totalExpense")}: {totalSpentFiltered}
        </div>
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

      <dialog id="purchase_aler_2" className="modal">
        <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
          <h2>{t("expenses.lockedFeature")}</h2>
          <button
            className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => {
              document.getElementById("purchase_aler_2").close();
            }}
          >
            {t("expenses.buttonClose")}
          </button>
        </div>
      </dialog>
    </div>
  );
}
