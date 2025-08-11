import { Link, useParams, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

import { useGlobalContext } from "../context/GlobalProvider";
import { CameraIcon } from "@heroicons/react/24/solid";
import DeleteDialog from "~/components/deleteDialog";
import ScheduleAlertForm from "~/components/ScheduleAlertForm";
import TravelModeForm from "~/components/travelMode";
import "../../styles/dashboard.css";
import { showErrorToast } from "~/utils/toast";
import Pagination from "~/components/pagination";
import DogLoader from "~/components/petLoader";
import { useTranslation } from "react-i18next";
import TagImagePreview from "~/components/TagImagePreview";

export default function PetDetail() {
  const { t } = useTranslation();
  const { pet, cart, auth, medicalHistory, tag, travelMode, comingFromCard } =
    useGlobalContext();
  const navigate = useNavigate();
  const [highlightMedicalBox, setHighlightMedicalBox] = useState(false);
  const { getPetById, petByID, editPet, deletePetById } = pet;
  const { createCart, cartProfile, getCartByUser } = cart;
  const { deletePetTag } = tag;
  const { comingFromCardButton, setComingFromCardButton } = comingFromCard;
  const {
    createMedicalHistory,
    deleteMedicalHistory,
    editMedicalHistory,
    createVetSession,
    deleteVetSession,
    editVetSession,
    deleteVetDocument,
    editVaccine,
    deleteVetVaccine,
    createVaccine,
  } = medicalHistory;
  const { user } = auth;
  const [message, setMessage] = useState("");
  const [showCamara, setShowCamara] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vetIdToDelete, setVetIdToDelete] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletePetDialogOpen, setIsDeletePetDialogOpen] = useState(false);
  const [vaccineErrors, setVaccineErrors] = useState({});
  const [medicalErrors, setMedicalErrors] = useState({});
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  const [docIdToDelete, setDocIdToDelete] = useState<number | null>(null);
  const [isDeleteDocDialogOpen, setIsDeleteDocDialogOpen] = useState(false);
  const [vaccineIdToDelete, setVaccineIdToDelete] = useState<number | null>(
    null
  );
  const [highlightDateInput, setHighlightDateInput] = useState(false);

  const [isDeleteVaccineDialogOpen, setIsDeleteVaccineDialogOpen] =
    useState(false);

  const [petVetInfo, setPetVetInfo] = useState({
    address: "",
    treatment: "",
    notes: "",
    cause: "",
    date: "",
    medical_notes: "",
    files: [],
  });

  const [collapseBox, setCollapseBox] = useState({
    generalInfo: false,
    medicalHistory2: false,
    vetSession: false,
    vaccines: false,
    travelMode: false,
  });

  const [vaccineData, setVaccineData] = useState({
    name: "",
    vaccine_type: "",
    date_administered: "",
    expiration_date: "",
  });

  useEffect(() => {
    if (comingFromCardButton) {
      const modal = document.getElementById(
        "my_modal_6_pet_id"
      ) as HTMLDialogElement;
      if (modal) {
        modal.showModal();
      }
      setComingFromCardButton(false);
    }
  }, [comingFromCardButton]);

  const validateVaccineData = (data) => {
    const errors = {};

    if (!data.name.trim()) errors.name = true;
    if (!data.date_administered.trim()) errors.date_administered = true;
    if (!data.expiration_date.trim()) errors.expiration_date = true;

    setVaccineErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedVetSessions =
    petByID?.medical_history?.[0]?.vets?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const openDeleteModal = (id: number) => {
    setTagToDelete(id);
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOpen(false);
    setTagToDelete(null);
  };

  const confirmDelete = async () => {
    if (tagToDelete !== null) {
      const success = await deletePetTag(tagToDelete);
      if (success) {
        getPetById(Number(petId));
      }
      closeDeleteModal();
    }
  };

  const handleVaccineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setVaccineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateVaccine = async () => {
    if (!validateVaccineData(vaccineData)) return;

    if (
      !petByID ||
      !petByID.medical_history ||
      petByID.medical_history?.length === 0
    ) {
      showErrorToast(t("context_pet_med.no_medical_history_for_vaccine"));
      return;
    }

    const medicalHistoryId = petByID.medical_history[0].id;

    setLoading(true);
    try {
      const response = await createVaccine(medicalHistoryId, vaccineData);

      if (response) {
        setMessage("Vacuna creada con éxito.");
        getPetById(Number(petId));
        setVaccineData({
          name: "",
          vaccine_type: "",
          date_administered: "",
          expiration_date: "",
        });
      } else {
        setMessage("No se pudo crear la vacuna.");
      }
    } catch (error) {
      console.error("Error creando vacuna:", error);
      setMessage("Ocurrió un error al crear la vacuna.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVet = (e) => {
    const { name, value, type, checked, files } = e.target;

    setPetVetInfo((prevInfo) => ({
      ...prevInfo,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file" && files
          ? Array.from(files)
          : type === "date"
          ? value
          : value,
    }));
  };

  const { petId } = useParams();

  const [medicalHistoryData, setMedicalHistoryData] = useState({
    description: "",
    current_treatment: "",
    last_doctor_visit: null,
    important_notes: "",
    allergies: "",
    weight: null,
    height: null,
    chronic_conditions: "",
    medications: "",
    surgical_history: "",
    vaccination_status: "",
    blood_type: "",
    diet: "",
    behavior_notes: "",
  });

  const [petInfo, setPetInfo] = useState({
    mom_name: "",
    dad_name: "",
    name: "",
    age: 0,
    personality: "",
    address: "",
    phone_number: "",
    phone_number_optional: "",
    profile_photo: null,
    pet_color: "",
    breed: "",
    lost: false,
    vet_address: "",
    neighbourhood: "",
    chip_number: 0,
    show_medical_history: false,
    show_travel_mode: false,
    show_vet_visit: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsOpenSettings(!isMobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (petByID) {
      setPetInfo({
        mom_name: petByID.mom_name || "",
        dad_name: petByID.dad_name || "",
        name: petByID.name || "",
        age: petByID.age || 0,
        personality: petByID.personality || "",
        address: petByID.address || "",
        phone_number: petByID.phone_number || "",
        phone_number_optional: petByID.phone_number_optional || "",
        profile_photo: petByID.profile_photo || null,
        pet_color: petByID.pet_color || "",
        breed: petByID.breed || "",
        lost: petByID.lost || false,
        vet_address: petByID.vet_address || "",
        neighbourhood: petByID.neighbourhood || "",
        chip_number: petByID.chip_number || 0,
        show_medical_history: petByID.show_medical_history || false,
        show_travel_mode: petByID.show_travel_mode || false,
        show_vet_visit: petByID.show_vet_visit || false,
      });
    }
  }, [petByID]);

  useEffect(() => {
    if (petId) {
      getPetById(Number(petId));
    }
  }, []);

  useEffect(() => {
    if (petByID?.medical_history?.length > 0) {
      const existingMedicalHistory = petByID.medical_history[0];
      setMedicalHistoryData({
        description: existingMedicalHistory.description || "",
        current_treatment: existingMedicalHistory.current_treatment || "",
        last_doctor_visit: existingMedicalHistory.last_doctor_visit || null,
        important_notes: existingMedicalHistory.important_notes || "",
        allergies: existingMedicalHistory.allergies || "",
        weight: existingMedicalHistory.weight || null,
        height: existingMedicalHistory.height || null,
        chronic_conditions: existingMedicalHistory.chronic_conditions || "",
        medications: existingMedicalHistory.medications || "",
        surgical_history: existingMedicalHistory.surgical_history || "",
        vaccination_status: existingMedicalHistory.vaccination_status || "",
        blood_type: existingMedicalHistory.blood_type || "",
        diet: existingMedicalHistory.diet || "",
        behavior_notes: existingMedicalHistory.behavior_notes || "",
      });
    } else {
      // Si no hay historial médico, limpiar el formulario
      setMedicalHistoryData({
        description: "",
        current_treatment: "",
        last_doctor_visit: null,
        important_notes: "",
        allergies: "",
        weight: null,
        height: null,
        chronic_conditions: "",
        medications: "",
        surgical_history: "",
        vaccination_status: "",
        blood_type: "",
        diet: "",
        behavior_notes: "",
      });
    }
  }, [petByID]);

  if (!petByID) {
    return <div>Cargando los detalles de la mascota...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    setPetInfo((prevInfo) => ({
      ...prevInfo,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file" && files
          ? files[0] // Si es un archivo, guarda el primero seleccionado
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPet = await editPet(Number(petId), petInfo);
      if (updatedPet) {
        setMessage("Pet details updated successfully!");
      } else {
        setMessage("Failed to update pet details.");
      }
    } catch (error) {
      console.error("Error updating pet:", error);
      setMessage("An error occurred while updating pet details.");
    }
  };

  const addToCart = (tagId: number) => {
    if (petByID && user) {
      const cartData = {
        tag_id: tagId,
        pet_id: petByID.id,
        quantity: 1,
        price: 26.99,
        subtotal: 100,
        is_checked_out: false,
      };

      createCart(user.id, cartData)
        .then((response) => {
          if (response) {
            setMessage("Item added to cart!");
            getCartByUser(user.id);
            const modal = document.getElementById(
              "my_modal_6_pet_id"
            ) as HTMLDialogElement;
            if (modal?.open) {
              modal.close();
            }
          }
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
          setMessage("Failed to add item to cart.");
        });
    } else {
      setMessage("User or Pet information is missing.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setMedicalHistoryData((prevData) => ({
      ...prevData,
      [name]:
        type === "date"
          ? value === ""
            ? null
            : value // Si la fecha está vacía, usa null
          : type === "number"
          ? value === ""
            ? null
            : parseFloat(value)
          : value,
    }));
  };

  const validateMedicalHistoryData = (data) => {
    const errors = {};

    if (!data.description.trim()) errors.description = true;
    setMedicalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrEditMedicalHistory = async () => {
    if (!validateMedicalHistoryData(medicalHistoryData)) return;
    if (!petByID || !petId) {
      setMessage("You need a pet id");
      return;
    }

    setLoading(true);
    try {
      const body = { ...medicalHistoryData };

      let response;
      if (petByID.medical_history?.length > 0) {
        // Si ya existe, edita el historial
        const medicalHistoryId = petByID.medical_history[0].id;
        response = await editMedicalHistory(medicalHistoryId, body);
      } else {
        // Si no existe, crea uno nuevo
        response = await createMedicalHistory(Number(petId), body);
        setHighlightMedicalBox(false);
      }

      if (response) {
        setMessage("¡Historial médico guardado con éxito!");
        getPetById(Number(petId)); // Refrescar los datos del pet
      } else {
        setMessage("No se pudo guardar el historial médico.");
      }
    } catch (error) {
      console.error("Error guardando historial médico:", error);
      setMessage("Ocurrió un error al guardar el historial médico.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVetSession = async () => {
    if (
      !petByID ||
      !petByID.medical_history ||
      petByID.medical_history?.length === 0
    ) {
      showErrorToast(t("medical_history_validation.require_history"));
      setHighlightMedicalBox(true);
      return;
    }

    if (!petVetInfo.date) {
      showErrorToast(t("medical_history_validation.require_date"));
      setHighlightDateInput(true); // para marcar el input en rojo
      return;
    }

    const medicalHistoryId = petByID.medical_history[0].id;

    setHighlightDateInput(false);
    setLoading(true);

    try {
      const response = await createVetSession(medicalHistoryId, petVetInfo);

      if (response) {
        setMessage("Sesión veterinaria creada con éxito.");
        getPetById(Number(petId));
        setPetVetInfo({
          address: "",
          treatment: "",
          notes: "",
          cost: 0,
          cause: "",
          date: "",
          medical_notes: "",
          files: [],
        });
        document.getElementById("my_modal_7_pet_id").showModal();
      } else {
        setMessage("No se pudo crear la sesión veterinaria.");
      }
    } catch (error) {
      console.error("Error creando sesión veterinaria:", error);
      setMessage("Ocurrió un error al crear la sesión veterinaria.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVetSession = async () => {
    if (!vetIdToDelete) return;

    setLoading(true);
    try {
      const response = await deleteVetSession(vetIdToDelete);

      if (response) {
        // setMessage("Sesión veterinaria eliminada con éxito.");
        getPetById(Number(petId)); // Recargar datos de la mascota
        setIsDeleteDialogOpen(false);
      } else {
        // setMessage("No se pudo eliminar la sesión veterinaria.");
      }
    } catch (error) {
      console.error("Error eliminando sesión veterinaria:", error);
      setMessage("Ocurrió un error al eliminar la sesión veterinaria.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditVetSession = async (vetId: number) => {
    if (
      !petByID ||
      !petByID.medical_history ||
      petByID.medical_history?.length === 0
    ) {
      setMessage("No hay historial médico asociado.");
      return;
    }

    setLoading(true);
    try {
      console.log("petVetInfo petVetInfo petVetInfo", petVetInfo);
      const response = await editVetSession(vetId, petVetInfo);

      if (response) {
        setMessage("Sesión veterinaria editada con éxito.");
        getPetById(Number(petId)); // 🔄 Refrescar datos
        document.getElementById("my_modal_4_pet_id").close();
      } else {
        setMessage("No se pudo editar la sesión veterinaria.");
      }
    } catch (error) {
      console.error("Error editando sesión veterinaria:", error);
      setMessage("Ocurrió un error al editar la sesión veterinaria.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (vetSession) => {
    setPetVetInfo({
      address: vetSession.address || "",
      treatment: vetSession.treatment || "",
      notes: vetSession.notes || "",
      cause: vetSession.cause || "",
      cost: vetSession.cost ? String(vetSession.cost) : 0,
      medical_notes: vetSession.medical_notes || "",
      files: [],
      existingFiles: vetSession.documents || [],
      id: vetSession.id,
      date: vetSession.date || null,
    });

    document.getElementById("my_modal_4_pet_id").showModal();
  };

  const handleDeleteVetDocument = async () => {
    setLoading(true);
    try {
      const response = await deleteVetDocument(petVetInfo.id, docIdToDelete);

      if (response) {
        setMessage("Documento eliminado con éxito.");
        setIsDeleteDocDialogOpen(false);
        document.getElementById("my_modal_4_pet_id").close();
        getPetById(Number(petId));

        setPetVetInfo((prevInfo) => ({
          ...prevInfo,
          existingFiles: prevInfo.existingFiles.filter(
            (file) => file.id !== docIdToDelete
          ),
        }));
      } else {
        setMessage("No se pudo eliminar el documento.");
      }
    } catch (error) {
      console.error("Error eliminando documento:", error);
      setMessage("Ocurrió un error al eliminar el documento.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = (section) => {
    setCollapseBox((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSettings = () => {
    setIsOpenSettings((prev) => !prev);
  };

  const handleDeleteVaccineFunc = async () => {
    if (!vaccineIdToDelete) return;

    setLoading(true);
    try {
      const medicalHistoryId = petByID.medical_history[0].id;
      const response = await deleteVetVaccine(
        vaccineIdToDelete,
        medicalHistoryId
      );

      if (response) {
        setMessage("Vacuna eliminada con éxito.");
        getPetById(Number(petId)); // Recargar los datos de la mascota
        setIsDeleteVaccineDialogOpen(false);
      } else {
        setMessage("No se pudo eliminar la vacuna.");
      }
    } catch (error) {
      console.error("Error eliminando vacuna:", error);
      setMessage("Ocurrió un error al eliminar la vacuna.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrEditCareProfile = async (formData) => {
    try {
      if (petByID.care_profile) {
        await travelMode.updateTravelMode(petByID.care_profile.id, formData);
      } else {
        await travelMode.createTravelMode(formData);
      }

      getPetById(Number(petId));
      setMessage("Travel Mode actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando Travel Mode:", error);
      setMessage("Ocurrió un error al actualizar el Travel Mode.");
    }
  };

  const confirmPetDelete = async () => {
    if (petByID.id !== null) {
      const success = await deletePetById(petByID.id);
      if (success) {
        navigate("/dashboard");
      }
    }
  };

  const openPetDeleteModal = () => {
    setIsDeletePetDialogOpen(true);
  };

  return (
    <div className="">
      {petByID ? (
        <div>
          <div className="border-2 md:border-0 bg-gray-800 md:bg-transparent border-gray-700 md:border-transparent rounded-lg md:rounded-none m-5 md:m-0">
            <div className="flex justify-between p-5 md:hidden">
              <div>
                {" "}
                <h2 className="text-lg text-teal-500">
                  {" "}
                  {t("general_pet_id.filter_collapse")}
                </h2>
              </div>
              <div>
                {" "}
                <span onClick={() => toggleSettings()}>
                  {isOpenSettings ? (
                    <ChevronUpIcon className="h-6 w-6 text-teal-500" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-teal-500" />
                  )}
                </span>
              </div>
            </div>
            {isOpenSettings && (
              <div className=" flex justify-between items-center p-4 flex-col md:flex-row">
                <div className="">
                  <button
                    className="w-full md:w-auto border-none py-3 px-4 mt-5 bg-teal-900 text-white rounded-lg"
                    onClick={() =>
                      document
                        .getElementById("my_modal_5_pet_id_alerts")
                        .showModal()
                    }
                  >
                    {t("extraOptions.create_alerts")}
                  </button>
                  <button
                    className="border-none py-3 px-4 ms-0 md:ms-3 mt-5 bg-teal-500 text-white  rounded-lg  w-full md:w-auto"
                    onClick={() =>
                      document.getElementById("my_modal_7_pet_id").showModal()
                    }
                  >
                    {t("extraOptions.medical_visits")}
                  </button>
                  <button
                    className="border-none py-3 px-4 ms-0 md:ms-3 mt-5 bg-teal-500 text-white  rounded-lg  w-full md:w-auto"
                    onClick={() =>
                      document.getElementById("my_modal_8_pet_id").showModal()
                    }
                  >
                    {t("extraOptions.vaccines")}
                  </button>
                  <button className="border-none py-3 px-4 ms-0 md:ms-3 mt-5 bg-teal-500 text-white  rounded-lg  w-full md:w-auto">
                    <Link to={`/emergencyPdf/${petId}`}>
                      <div>{t("extraOptions.lost_flyer")}</div>
                    </Link>
                  </button>
                </div>
                <div className="w-full md:w-auto md:flex md:flex-row">
                  <div>
                    <Link to={`/publicQr/${petId}`}>
                      <button className="w-full md:w-auto border-none py-3 px-4 ms-0 md:ms-3 mt-5 bg-teal-700 text-white rounded-lg inline-block">
                        {" "}
                        {t("extraOptions.qr_view")}
                      </button>
                    </Link>
                  </div>
                  <div>
                    <button
                      className={`w-full md:w-auto border-none py-3 px-4 ms-0 md:ms-3 mt-5 bg-teal-700 text-white rounded-lg inline-block font-semibold transition-all duration-300 ${
                        comingFromCardButton ? "animate-glow" : ""
                      }`}
                      onClick={() => {
                        document
                          .getElementById("my_modal_6_pet_id")
                          .showModal();
                        setTimeout(() => {
                          setComingFromCardButton(false);
                        }, 4000);
                      }}
                    >
                      {t("extraOptions.your_tags")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 p-5">
            {/* {message && <div className="alert">{message}</div>}{" "} */}
            {/* Mostrar mensaje */}
            <h1 className=" text-4xl mb-2" style={{ fontFamily: "chapFont" }}>
              {t("general_pet_id.welcome", { name: petByID.name })}
            </h1>
            <form
              method="dialog"
              onSubmit={handleSubmit}
              className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5"
            >
              <div className="flex justify-between">
                <div>
                  {" "}
                  <h2 className="text-lg text-teal-500">
                    {" "}
                    {t("general_pet_id.general_info")}
                  </h2>
                </div>
                <div>
                  {" "}
                  <span onClick={() => toggleCollapse("generalInfo")}>
                    {collapseBox.generalInfo ? (
                      <ChevronUpIcon className="h-6 w-6 text-teal-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-teal-500" />
                    )}
                  </span>
                </div>
              </div>
              {collapseBox.generalInfo ? (
                <div>
                  <div className="relative flex justify-center">
                    <div
                      className="mb-4"
                      onMouseEnter={() => setShowCamara(true)}
                      onMouseLeave={() => setShowCamara(false)}
                    >
                      {/* <p>Profile Photo</p> */}
                      {petInfo.profile_photo ? (
                        <img
                          src={petInfo.profile_photo}
                          alt="defdefe"
                          className={
                            showCamara
                              ? "w-32 h-32 object-cover rounded-full opacity-80 group-hover:opacity-60 transition-opacity duration-200"
                              : "w-32 h-32 object-cover rounded-full mb-2"
                          }
                        />
                      ) : (
                        <img
                          src="https://chap-blue.s3.us-east-2.amazonaws.com/Group+5350.png"
                          alt="defdefe"
                          className={
                            showCamara
                              ? "w-32 h-32 object-cover rounded-full opacity-80 group-hover:opacity-60 transition-opacity duration-200"
                              : "w-32 h-32 object-cover rounded-full mb-2"
                          }
                        />
                      )}
                      {showCamara && (
                        <CameraIcon
                          className="absolute inset-0 m-auto h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer"
                          onClick={() =>
                            document
                              .getElementById("my_modal_3_pet_id")
                              .showModal()
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-1xl font-bold text-white">
                      {t("tagInfo.description")}
                    </h2>
                    <div className="flex flex-col md:flex-row gap-3 mt-3">
                      <div className="flex items-center">
                        <label className="mr-2">{t("tagInfo.lost")}</label>
                        <input
                          type="checkbox"
                          name="lost"
                          checked={petInfo.lost}
                          onChange={(e) =>
                            setPetInfo((prevInfo) => ({
                              ...prevInfo,
                              lost: e.target.checked,
                            }))
                          }
                          className="radio radio-accent"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="mr-2">
                          {t("tagInfo.medicalHistory")}
                        </label>
                        <input
                          type="checkbox"
                          name="show_medical_history"
                          checked={petInfo.show_medical_history}
                          onChange={handleChange}
                          className="radio radio-accent"
                        />
                      </div>

                      <div className=" flex items-center">
                        <label className="mr-2">
                          {t("tagInfo.travelMode")}
                        </label>
                        <input
                          type="checkbox"
                          name="show_travel_mode"
                          checked={petInfo.show_travel_mode}
                          onChange={handleChange}
                          className="radio radio-accent"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="mr-2">
                          {t("petCreation.step2.settings.showVetVisits")}
                        </label>
                        <input
                          type="checkbox"
                          name="show_vet_visit"
                          checked={petInfo.show_vet_visit}
                          onChange={handleChange}
                          className="radio radio-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("tagInfo.owner1")}</label>
                      <input
                        type="text"
                        name="mom_name"
                        value={petInfo.mom_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.owner1")}
                      />
                    </div>

                    <div className="w-full">
                      <label>{t("tagInfo.owner2")}</label>
                      <input
                        type="text"
                        name="dad_name"
                        value={petInfo.dad_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg mb-4"
                        placeholder={t("tagInfo.owner2")}
                      />
                    </div>
                  </div>

                  <div className=" flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("tagInfo.petName")}</label>
                      <input
                        type="text"
                        name="name"
                        value={petInfo.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.petName")}
                      />
                    </div>

                    <div className="mb-4 w-full">
                      <label>{t("tagInfo.petAge")}</label>
                      <input
                        type="number"
                        name="age"
                        value={petInfo.age}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.petAge")}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("tagInfo.color")}</label>
                      <input
                        type="text"
                        name="pet_color"
                        value={petInfo.pet_color}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.color")}
                      />
                    </div>

                    <div className="mb-4 w-full">
                      <label>{t("tagInfo.breed")}</label>
                      <input
                        type="text"
                        name="breed"
                        value={petInfo.breed}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.breed")}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label>{t("tagInfo.personality")}</label>
                    <input
                      type="text"
                      name="personality"
                      value={petInfo.personality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t("tagInfo.personality")}
                    />
                  </div>

                  <div className="mb-4">
                    <label>{t("tagInfo.address")}</label>
                    <input
                      type="text"
                      name="address"
                      value={petInfo.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t("tagInfo.address")}
                    />
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("tagInfo.phone1")}</label>
                      <input
                        type="text"
                        name="phone_number"
                        value={petInfo.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.phone1")}
                      />
                    </div>

                    <div className="mb-4 w-full">
                      <label>{t("tagInfo.phone2")}</label>
                      <input
                        type="text"
                        name="phone_number_optional"
                        value={petInfo.phone_number_optional || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("tagInfo.phone2")}
                      />
                    </div>
                  </div>

                  {/* <div className="mb-4 flex">
                <div>
                  <label>Lost</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    name="lost"
                    checked={petInfo.lost}
                    onChange={(e) =>
                      setPetInfo((prevInfo) => ({
                        ...prevInfo,
                        lost: e.target.checked,
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <label className="mr-2">Show Medical History</label>
                </div>

                <div className="mb-4 flex items-center">
                  <label className="mr-2">Show Travel Mode</label>
                </div>
              </div> */}

                  <div className="mb-4">
                    <label>{t("tagInfo.vet")}</label>
                    <input
                      type="text"
                      name="vet_address"
                      value={petInfo.vet_address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t("tagInfo.vet")}
                    />
                  </div>

                  <div className="mb-4">
                    <label>{t("tagInfo.neighbourhood")}</label>
                    <input
                      type="text"
                      name="neighbourhood"
                      value={petInfo.neighbourhood}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t("tagInfo.neighbourhood")}
                    />
                  </div>

                  <div className="mb-4">
                    <label>{t("tagInfo.chip")}</label>
                    <input
                      type="number"
                      name="chip_number"
                      value={petInfo.chip_number}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t("tagInfo.chip")}
                    />
                  </div>

                  <div className="modal-action">
                    <button
                      className="btn py-3 px-4 rounded-lg"
                      onClick={() => toggleCollapse("generalInfo")}
                    >
                      {t("tagInfo.buttonClose")}
                    </button>
                    <button
                      className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
                      onClick={handleSubmit}
                    >
                      {t("tagInfo.buttonCreate")}{" "}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </form>
          </div>

          <div className="px-5">
            <div
              className={`border-2 bg-gray-800 rounded-lg p-5 transition-all duration-300 ${
                highlightMedicalBox
                  ? "border-red-500 ring-2 ring-red-500 shadow-md shadow-red-500"
                  : "border-gray-700"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  {" "}
                  <h2 className="text-lg text-teal-500">
                    {t("general_pet_id.create_medical_history")}
                  </h2>
                </div>
                <div>
                  {" "}
                  <span onClick={() => toggleCollapse("medicalHistory2")}>
                    {collapseBox.medicalHistory2 ? (
                      <ChevronUpIcon className="h-6 w-6 text-teal-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-teal-500" />
                    )}
                  </span>
                </div>
              </div>

              {collapseBox.medicalHistory2 ? (
                <div className="relative">
                  {!petByID.pay_show_info && (
                    <div className="absolute inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center pointer-events-auto">
                      <p className="text-white text-center text-lg opacity-70">
                        <h2>{t("expenses.lockedFeature")}</h2>
                      </p>
                    </div>
                  )}
                  <div className="mt-5">
                    <div className="mb-5">
                      <h2 className="text-1xl font-bold text-white">
                        {t("medicalHistoryForm.description")}
                      </h2>
                      {/* <small className="text-sm text-white">
                        como si tienes un tramaention ahora o enfermedades para
                        toda la vida, etc
                      </small> */}
                    </div>
                    <div className="">
                      <label>{t("medicalHistoryForm.descriptionLabel")}</label>
                    </div>
                    <textarea
                      name="description"
                      value={medicalHistoryData.description}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-lg mb-3 ${
                        medicalErrors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={t(
                        "medicalHistoryForm.descriptionPlaceholder"
                      )}
                      rows={5}
                    />
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <div>
                        <label>
                          {t("medicalHistoryForm.currentTreatmentLabel")}
                        </label>
                      </div>
                      <div className="w-full">
                        <input
                          type="text"
                          name="current_treatment"
                          value={medicalHistoryData.current_treatment}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg"
                          placeholder={t(
                            "medicalHistoryForm.currentTreatmentPlaceholder"
                          )}
                        />
                      </div>
                    </div>

                    {/* <div className="w-full">
                  <div>
                    <label>last_doctor_visit</label>
                  </div>
                  <div>
                    <input
                      type="date"
                      name="last_doctor_visit"
                      value={medicalHistoryData.last_doctor_visit}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg mb-3"
                    />
                  </div>
                </div> */}
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row mt-2">
                    <div className="w-full">
                      <div>
                        <label>{t("medicalHistoryForm.important_notes")}</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="important_notes"
                          value={medicalHistoryData.important_notes}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg"
                          placeholder={t("medicalHistoryForm.important_notes")}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div>
                        <label>{t("medicalHistoryForm.allergiesLabel")}</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="allergies"
                          value={medicalHistoryData.allergies}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg mb-3"
                          placeholder={t(
                            "medicalHistoryForm.allergiesPlaceholder"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full">
                      <div>
                        <label>{t("medicalHistoryForm.weightLabel")}</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="weight"
                          value={medicalHistoryData.weight}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg"
                          placeholder={t("medicalHistoryForm.weightLabel")}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div>
                        <label>{t("medicalHistoryForm.heightLabel")}</label>
                      </div>
                      <div>
                        <input
                          type="number"
                          name="height"
                          value={medicalHistoryData.height}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg"
                          placeholder={t("medicalHistoryForm.heightLabel")}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div>
                        <label>{t("medicalHistoryForm.bloodTypeLabel")}</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="blood_type"
                          value={medicalHistoryData.blood_type}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg mb-3"
                          placeholder={t("medicalHistoryForm.bloodTypeLabel")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div>
                <div>
                  <label>chronic_conditions</label>
                </div>
                <div>
                  <input
                    type="text"
                    name="chronic_conditions"
                    value={medicalHistoryData.chronic_conditions}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg mb-3"
                    placeholder="Condiciones crónicas"
                  />
                </div>
              </div> */}

                  <div>
                    <div>
                      <label>
                        {t("medicalHistoryForm.currentMedicationsLabel")}
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="medications"
                        value={medicalHistoryData.medications}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg mb-3"
                        placeholder={t(
                          "medicalHistoryForm.currentMedicationsPlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label>
                        {t("medicalHistoryForm.surgeryHistoryLabel")}
                      </label>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="surgical_history"
                        value={medicalHistoryData.surgical_history}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg mb-3"
                        placeholder={t(
                          "medicalHistoryForm.surgeryHistoryPlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 flex-col md:flex-row">
                    <div className="w-full ">
                      <div>
                        <label>{t("medicalHistoryForm.dietLabel")}</label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="diet"
                          value={medicalHistoryData.diet}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg"
                          placeholder={t("medicalHistoryForm.dietPlaceholder")}
                        />
                      </div>
                    </div>
                    <div className="w-full ">
                      <div>
                        <label>
                          {t("medicalHistoryForm.vaccinationStatusLabel")}
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          name="vaccination_status"
                          value={medicalHistoryData.vaccination_status}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-lg mb-3"
                          placeholder={t(
                            "medicalHistoryForm.vaccinationStatusPlaceholder"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label> {t("medicalHistoryForm.behaviorLabel")}</label>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="behavior_notes"
                        value={medicalHistoryData.behavior_notes}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                        placeholder={t(
                          "medicalHistoryForm.behaviorPlaceholder"
                        )}
                      />
                    </div>
                  </div>

                  {/* Botón para crear el historial */}
                  <div className="flex justify-end mt-4 gap-2">
                    <button
                      className="btn py-3 px-4 rounded-lg"
                      onClick={() => toggleCollapse("medicalHistory2")}
                    >
                      {t("medicalHistoryForm.buttonClose")}
                    </button>{" "}
                    <button
                      className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
                      onClick={handleCreateOrEditMedicalHistory}
                      disabled={loading}
                    >
                      {loading
                        ? t("medicalHistoryForm.buttonCreateLoading")
                        : t("medicalHistoryForm.buttonCreate")}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="px-5 mt-5">
            <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  {" "}
                  <h2 className="text-lg text-teal-500">
                    {t("general_pet_id.create_vet_visits")}
                  </h2>
                </div>
                <div>
                  {" "}
                  <span onClick={() => toggleCollapse("vetSession")}>
                    {collapseBox.vetSession ? (
                      <ChevronUpIcon className="h-6 w-6 text-teal-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-teal-500" />
                    )}
                  </span>
                </div>
              </div>

              {collapseBox.vetSession ? (
                <div className="mt-5 relative">
                  {!petByID.pay_show_info && (
                    <div className="absolute inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center pointer-events-auto">
                      <p className="text-white text-center text-lg opacity-70">
                        <h2>{t("expenses.lockedFeature")}</h2>
                      </p>
                    </div>
                  )}
                  <div className="mb-5">
                    <h2 className="text-1xl font-bold text-white">
                      {t("vetVisitForm.description")}
                    </h2>
                    <small className="text-sm text-white">
                      {t("vetVisitForm.note")}
                    </small>
                  </div>
                  <div className="mb-4 w-full">
                    <label>{t("vetVisitForm.form.clinicAddressLabel")}</label>
                    <input
                      type="text"
                      name="address"
                      value={petVetInfo.address}
                      onChange={handleChangeVet}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder={t(
                        "vetVisitForm.form.clinicAddressPlaceholder"
                      )}
                    />
                  </div>

                  <div className="w-full">
                    <label>{t("vetVisitForm.form.treatmentLabel")}</label>
                    <input
                      type="text"
                      name="treatment"
                      value={petVetInfo.treatment}
                      onChange={handleChangeVet}
                      className="w-full px-4 py-2 border rounded-lg mb-4"
                      placeholder={t("vetVisitForm.form.treatmentPlaceholder")}
                    />
                  </div>

                  <div className="flex gap-3 mb-4 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("vetVisitForm.form.documentsLabel")}</label>
                      <input
                        type="file"
                        name="files"
                        multiple
                        onChange={handleChangeVet} // Maneja la carga de archivos
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div className="w-full">
                      <label>{t("vetVisitForm.form.visitDateLabel")}</label>
                      <input
                        type="date"
                        name="date"
                        value={petVetInfo.date || ""}
                        onChange={(e) => {
                          handleChangeVet(e);
                          setHighlightDateInput(false);
                        }} // Maneja la carga de archivos
                        className={`w-full px-4 py-2 border rounded-lg ${
                          highlightDateInput
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("vetVisitForm.form.notesLabel")}</label>
                      <input
                        type="text"
                        name="notes"
                        value={petVetInfo.notes}
                        onChange={handleChangeVet}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("vetVisitForm.form.notesLabel")}
                      />
                    </div>

                    <div className="w-full">
                      <label>{t("vetVisitForm.form.medicalNotesLabel")}</label>
                      <input
                        type="text"
                        name="medical_notes"
                        value={petVetInfo.medical_notes}
                        onChange={handleChangeVet}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("vetVisitForm.form.medicalNotesLabel")}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4 flex-col md:flex-row">
                    <div className="w-full">
                      <label>{t("vetVisitForm.form.visitReasonLabel")}</label>
                      <input
                        type="text"
                        name="cause"
                        value={petVetInfo.cause}
                        onChange={handleChangeVet}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("vetVisitForm.form.visitReasonLabel")}
                      />
                    </div>

                    <div className="w-full">
                      <label>{t("vetVisitForm.form.costLabel")}</label>
                      <input
                        type="number"
                        name="cost"
                        value={petVetInfo.cost}
                        onChange={handleChangeVet}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("vetVisitForm.form.costLabel")}
                      />
                    </div>
                  </div>

                  {/* Botón para crear el historial */}
                  <div className="flex gap-3 flex-col md:flex-row justify-end mb-4 mt-4">
                    {/* <button
                  className="border-none py-3 px-4  bg-teal-500 text-white  rounded-lg  w-full md:w-auto"
                  onClick={() =>
                    document.getElementById("my_modal_7_pet_id").showModal()
                  }
                >
                  Your vet visits
                </button> */}
                    <button
                      className="btn py-3 px-4 rounded-lg"
                      onClick={() => toggleCollapse("vetSession")}
                    >
                      {t("vetVisitForm.buttonClose")}
                    </button>
                    <button
                      className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
                      onClick={handleCreateVetSession}
                      // disabled={loading}
                    >
                      {t("vetVisitForm.buttonCreate")}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="px-5 mt-5">
            <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  {" "}
                  <h2 className=" text-lg text-teal-500">
                    {" "}
                    {t("general_pet_id.create_vaccines")}
                  </h2>
                </div>
                <div>
                  {" "}
                  <span onClick={() => toggleCollapse("vaccines")}>
                    {collapseBox.vaccines ? (
                      <ChevronUpIcon className="h-6 w-6 text-teal-500" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-teal-500" />
                    )}
                  </span>
                </div>
              </div>

              {collapseBox.vaccines ? (
                <div className="mt-5 relative">
                  {!petByID.pay_show_info && (
                    <div className="absolute inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center pointer-events-auto">
                      <p className="text-white text-center text-lg opacity-70">
                        <h2>{t("expenses.lockedFeature")}</h2>
                      </p>
                    </div>
                  )}
                  <div className="mb-5">
                    <h2 className="text-1xl font-bold text-white">
                      {t("create_vaccine.description")}
                    </h2>
                    {/* <small className="text-sm text-white">
                      venga son solo 4 inputs!! es mas facil que recoger la caca
                      y lo haces!
                    </small> */}
                  </div>
                  <div className="flex justify-between flex-col md:flex-row gap-2">
                    <div className="w-full ">
                      <div>
                        <label>{t("create_vaccine.label.name")}</label>
                      </div>
                      <input
                        type="text"
                        className={`w-full px-4 py-2 border rounded-lg ${
                          vaccineErrors.name
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={t("create_vaccine.label.name")}
                        name="name"
                        value={vaccineData.name}
                        onChange={handleVaccineInputChange}
                      />
                    </div>
                    <div className="w-full mb-2 md:mb-0">
                      <div>
                        <label>{t("create_vaccine.label.type")}</label>
                      </div>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder={t("create_vaccine.label.type")}
                        name="vaccine_type"
                        value={vaccineData.vaccine_type}
                        onChange={handleVaccineInputChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between gap-2 mt-0 md:mt-3">
                    {" "}
                    <div className="w-full">
                      <div>
                        <label>
                          {t("create_vaccine.label.date_administered")}
                        </label>
                      </div>
                      <input
                        type="date"
                        className={`w-full px-4 py-2 border rounded-lg ${
                          vaccineErrors.date_administered
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={t(
                          "create_vaccine.label.date_administered"
                        )}
                        name="date_administered"
                        value={vaccineData.date_administered}
                        onChange={handleVaccineInputChange}
                      />
                    </div>
                    <div className="w-full">
                      <div>
                        <label>
                          {" "}
                          {t("create_vaccine.label.expiration_date")}
                        </label>
                      </div>
                      <input
                        type="date"
                        className={`w-full px-4 py-2 border rounded-lg ${
                          vaccineErrors.expiration_date
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder={t("create_vaccine.label.expiration_date")}
                        name="expiration_date"
                        value={vaccineData.expiration_date}
                        onChange={handleVaccineInputChange}
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3 justify-end">
                    <button
                      className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
                      onClick={handleCreateVaccine}
                      disabled={loading}
                    >
                      {loading
                        ? t("create_vaccine.button.create-loading")
                        : t("create_vaccine.button.create")}
                    </button>
                    <button
                      className="btn py-3 px-4 rounded-lg"
                      onClick={() => toggleCollapse("vaccines")}
                    >
                      {t("create_vaccine.button.close")}
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="p-5">
            <TravelModeForm
              travelModeData={petByID?.care_profile}
              payShowInfo={petByID?.pay_show_info}
              onSubmit={handleCreateOrEditCareProfile}
              petId={petId}
              isCollapsed={collapseBox.travelMode}
              onToggleCollapse={() => toggleCollapse("travelMode")}
              t={t}
            />
          </div>

          <div
            className="px-5 flex items-center mb-[40px] cursor-pointer"
            onClick={openPetDeleteModal}
          >
            <div>{t("general_pet_id.delete_pet")}</div>
            <div className="">
              <TrashIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      ) : (
        <DogLoader />
      )}

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName="este tag"
      />

      <DeleteDialog
        isOpen={isDeleteVaccineDialogOpen}
        onClose={() => setIsDeleteVaccineDialogOpen(false)}
        onConfirm={handleDeleteVaccineFunc}
        itemName={`Vacuna: ${vaccineIdToDelete ?? ""}`}
      />

      <DeleteDialog
        isOpen={isDeletePetDialogOpen}
        onClose={() => setIsDeletePetDialogOpen(false)}
        onConfirm={confirmPetDelete}
        itemName={`the pet ${petByID.name}`}
      />

      {/* //modal here to change image  */}
      <dialog id="my_modal_3_pet_id" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg"> {t("profile_photo.title")}</h3>
          <p className="font-thin text-md"> {t("profile_photo.subtitle")}</p>
          <p className="py-4">
            <input
              type="file"
              name="profile_photo"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">{t("pet_tracker.button")}</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* //modal here to create or edit medical vet session   */}
      <dialog id="my_modal_4_pet_id" className="modal">
        <div className="modal-box max-w-4xl">
          <div className="flex justify-between items-center mt-[30px]">
            <div>
              <h3 className=" text-lg" style={{ fontFamily: "chapFont" }}>
                {t("medical_visits_pet_id.title_edit")}
              </h3>
            </div>
            <div>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_4_pet_id").close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>

          {/* Inputs para editar */}
          <label>{t("vetVisitForm.form.clinicAddressLabel")}</label>
          <input
            type="text"
            name="address"
            value={petVetInfo.address}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.clinicAddressLabel")}
          />

          <label>{t("vetVisitForm.form.treatmentLabel")}</label>
          <input
            type="text"
            name="treatment"
            value={petVetInfo.treatment}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.treatmentLabel")}
          />

          <label>{t("vetVisitForm.form.costLabel")}</label>
          <input
            type="number"
            name="cost"
            value={petVetInfo.cost}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.costLabel")}
          />

          <label>{t("vetVisitForm.form.visitReasonLabel")}</label>
          <input
            type="text"
            name="cause"
            value={petVetInfo.cause}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.visitReasonLabel")}
          />

          <label>{t("vetVisitForm.form.visitDateLabel")}</label>
          <input
            type="date"
            name="date"
            value={petVetInfo.date ? petVetInfo.date : ""}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.visitDateLabel")}
          />

          <label>{t("vetVisitForm.form.medicalNotesLabel")}</label>
          <input
            type="text"
            name="medical_notes"
            value={petVetInfo.medical_notes}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder={t("vetVisitForm.form.medicalNotesLabel")}
          />

          {/* Archivos actuales */}
          <h4 className="font-semibold mt-4">
            {t("medical_visits_pet_id.actual_documents")}.
          </h4>
          <div className="flex flex-wrap gap-2">
            {petVetInfo.existingFiles?.length > 0 ? (
              petVetInfo.existingFiles?.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border p-2 rounded"
                >
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {file.file_url}
                  </a>
                  <button
                    className="text-red-500"
                    onClick={() => {
                      setDocIdToDelete(file.id);
                      setIsDeleteDocDialogOpen(true);
                    }}
                  >
                    🗑
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                {t("medical_visits_pet_id.documents_empty_message")}.
              </p>
            )}
          </div>

          <DeleteDialog
            isOpen={isDeleteDocDialogOpen}
            onClose={() => setIsDeleteDocDialogOpen(false)}
            onConfirm={handleDeleteVetDocument}
            itemName="este documento"
          />

          {/* Subir nuevos archivos */}
          <h4 className="font-semibold mt-4">
            {t("medical_visits_pet_id.new_documents")}:
          </h4>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />

          {/* Botones */}
          <div className="modal-action">
            <button
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
              onClick={handleEditVetSession}
            >
              {t("medical_visits_pet_id.save_button")}
            </button>
            <form method="dialog">
              <button className="btn">
                {t("medical_visits_pet_id.close_button")}
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteVetSession}
        itemName={`Visita ID: ${vetIdToDelete ?? ""}`}
      />

      {/* //modal here to create a   */}
      <dialog id="my_modal_5_pet_id_alerts" className="modal">
        <div className="modal-box">
          <div className="flex justify-between items-center mt-[30px]">
            <div>
              <h3 className="font-bold text-lg">
                {" "}
                {t("create_alerts.subtitle", { target: petByID.name })}
              </h3>
            </div>
            <div>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_5_pet_id_alerts").close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>

          <ScheduleAlertForm userId={auth.user?.id} petId={petByID} t={t} />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">{t("create_alerts.close_button")}</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* //modal here to show tags  */}
      <dialog id="my_modal_6_pet_id" className="modal">
        <div className="modal-box w-full max-w-7xl">
          <div className="flex justify-between items-center mt-[30px]">
            <div>
              <h3 className="font-bold text-lg">
                {" "}
                {t("your_tags.tags_title")}
              </h3>
            </div>
            <div>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_6_pet_id").close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>
          <div className="flex gap-5 items-center flex-col md:flex-row p-5">
            {petByID?.tags?.length > 0 ? (
              petByID?.tags?.map((tag) => {
                return (
                  <div
                    key={tag.id}
                    className="border -2 border-[#65bcbb] rounded-lg p-5 w-full md:w-[250px]"
                  >
                    <div className=" ">
                      <TagImagePreview shape={tag.shape} color={tag.color} />
                      {/* <img
                        className="w-full md:w-[225px]"
                        src="https://chap-blue.s3.us-east-2.amazonaws.com/ChatGPT+Image+Apr+14%2C+2025%2C+04_19_29+PM.png"
                        alt="dd"
                      /> */}
                      <div className="mt-2">
                        <p>
                          {t("your_tags.color")}:<strong>{tag.color}</strong>{" "}
                        </p>
                        <p className="">
                          {t("your_tags.shape")}: <strong>{tag.shape}</strong>{" "}
                        </p>

                        <p className="">
                          {t("your_tags.paid")}{" "}
                          <strong>{tag.is_purchased ? "Sí" : "No"}</strong>
                        </p>
                        {/* <p className=""> {tag.material}</p> */}
                      </div>
                      <div className="mt-4 flex justify-between gap-3 w-full">
                        <button
                          className=" border-none py-3 px-4 bg-teal-700 text-white rounded-lg"
                          onClick={() => addToCart(tag.id)}
                        >
                          {t("your_tags.add_to_cart_button")}
                        </button>
                        <button
                          onClick={() => openDeleteModal(tag.id)}
                          className=" border-none py-3 px-4 bg-teal-500 text-white rounded-lg"
                        >
                          {t("your_tags.delete_button")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p> {t("your_tags.tags_empty_message")}</p>
              </div>
            )}
          </div>
          <div className="modal-action pb-[50px]">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* //modal here to show medical vets  */}
      <dialog id="my_modal_7_pet_id" className="modal">
        <div className="modal-box w-full max-w-7xl">
          <div>
            <div className="flex justify-between items-center mt-[30px]">
              <h3 className="font-bold text-lg">
                {" "}
                {t("medical_visits_pet_id.title")}
              </h3>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_7_pet_id").close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>

          <div className="p-5">
            {petByID?.medical_history?.length > 0 &&
            petByID.medical_history[0].vets?.length > 0 ? (
              paginatedVetSessions?.map((vetSession) => (
                <div
                  key={vetSession.id}
                  className="bg-gray-800 text-white p-6 mb-6 rounded-xl shadow-lg border border-gray-700"
                >
                  <div className="flex flex-col justify-start md:flex-row md:justify-between md:items-center">
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-teal-500">
                        {t("medical_visits_pet_id.title_visit_id")}:{" "}
                        {vetSession.id}
                      </h3>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2 text-teal-500">
                        {t("medical_visits_pet_id.title_date")}:{" "}
                        {vetSession.date}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.address")}
                      </span>{" "}
                      {vetSession.address}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.treatment")}
                      </span>{" "}
                      {vetSession.treatment}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.cause")}
                      </span>{" "}
                      {vetSession.cause}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.notes")}
                      </span>{" "}
                      {vetSession.notes}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.medical_notes")}
                      </span>{" "}
                      {vetSession.medical_notes}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.cost")}
                      </span>{" "}
                      {vetSession.cost ? `$${vetSession.cost}` : "N/A"}
                    </p>
                  </div>

                  {vetSession?.documents?.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-gray-300">
                        {t("medical_visits_pet_id.documents")}:
                      </p>
                      <ul className="list-disc list-inside text-sm text-teal-500">
                        {vetSession?.documents?.map((item, index) => (
                          <li key={index}>
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-teal-500"
                            >
                              {item.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                      onClick={() => openEditModal(vetSession)}
                    >
                      {t("medical_visits_pet_id.edit_button")}
                    </button>

                    <TrashIcon
                      className="h-6 w-6 text-red-400 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        setVetIdToDelete(vetSession.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                {t("medical_visits_pet_id.empty_message")}
              </p>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">
                {" "}
                {t("medical_visits_pet_id.close_button")}
              </button>
            </form>
          </div>
          <div className="pb-[50px]">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(
                (petByID?.medical_history?.[0]?.vets?.length || 0) /
                  itemsPerPage
              )}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </dialog>

      {/* //modal here to vaccines  */}
      <dialog id="my_modal_8_pet_id" className="modal">
        <div className="modal-box w-full max-w-7xl">
          <div className="flex justify-between items-center mt-[30px]">
            <div>
              <h3 className="font-bold text-lg">
                {" "}
                {t("vaccines_pet_id.subtitle")}
              </h3>
            </div>
            <div>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById("my_modal_8_pet_id").close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>

          <div>
            {petByID.medical_history?.length > 0 &&
            petByID?.medical_history[0]?.vaccines?.length > 0 ? (
              petByID?.medical_history[0]?.vaccines?.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="bg-gray-800 text-white p-6 mt-3 rounded-xl mb-4 shadow-lg border border-gray-700"
                >
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("vaccines_pet_id.name")}
                      </span>{" "}
                      {vaccine.name}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("vaccines_pet_id.type")}:
                      </span>{" "}
                      {vaccine.vaccine_type}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("vaccines_pet_id.administered_date")}:
                      </span>{" "}
                      {vaccine.date_administered}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-300">
                        {t("vaccines_pet_id.expiration_date")}:
                      </span>{" "}
                      {vaccine.expiration_date}
                    </p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <TrashIcon
                      className="h-6 w-6 text-red-400 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        setVaccineIdToDelete(vaccine.id);
                        setIsDeleteVaccineDialogOpen(true);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">
                {t("vaccines_pet_id.empty_message")}
              </p>
            )}
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">
                {t("vaccines_pet_id.close_button")}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
