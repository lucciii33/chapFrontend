import { useParams } from "@remix-run/react";
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

export default function PetDetail() {
  const { pet, cart, auth, medicalHistory, tag, travelMode } =
    useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { createCart, cartProfile, getCartByUser } = cart;
  const { deletePetTag } = tag;
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

  const [docIdToDelete, setDocIdToDelete] = useState<number | null>(null);
  const [isDeleteDocDialogOpen, setIsDeleteDocDialogOpen] = useState(false);
  const [vaccineIdToDelete, setVaccineIdToDelete] = useState<number | null>(
    null
  );
  const [isDeleteVaccineDialogOpen, setIsDeleteVaccineDialogOpen] =
    useState(false);

  const [petVetInfo, setPetVetInfo] = useState({
    address: "",
    treatment: "",
    notes: "",
    cause: "",
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

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<number | null>(null);

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

  console.log("vaccineDatavaccineData", vaccineData);

  const handleVaccineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setVaccineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateVaccine = async () => {
    if (
      !petByID ||
      !petByID.medical_history ||
      petByID.medical_history.length === 0
    ) {
      setMessage("No hay historial médico asociado para agregar la vacuna.");
      return;
    }

    const medicalHistoryId = petByID.medical_history[0].id;

    setLoading(true);
    try {
      const response = await createVaccine(medicalHistoryId, vaccineData);

      if (response) {
        setMessage("Vacuna creada con éxito.");
        getPetById(Number(petId)); // Recargar datos de la mascota
        setVaccineData({
          name: "",
          vaccine_type: "",
          date_administered: "",
          expiration_date: "",
        }); // Resetear formulario
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

  console.log("petVetInfo", petVetInfo);

  const handleChangeVet = (e) => {
    const { name, value, type, checked, files } = e.target;

    setPetVetInfo((prevInfo) => ({
      ...prevInfo,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file" && files
          ? Array.from(files) // Guardar múltiples archivos como array
          : value,
    }));
  };

  const { petId } = useParams();
  console.log("petByID", petByID);
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
  });

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
        show_travel_mode: petByID.show_travel_mode || false, // ✅
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

  console.log("petttttt", petId);

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
        quantity: 1, // Puedes ajustar según sea necesario
        price: 100, // Ejemplo, ajusta según el precio del tag o la lógica
        subtotal: 100, // Igual al precio inicial
        is_checked_out: false,
      };

      createCart(user.id, cartData)
        .then((response) => {
          if (response) {
            console.log("Item added to cart successfully:", response);
            setMessage("Item added to cart!");
            getCartByUser(user.id);
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

  const handleCreateOrEditMedicalHistory = async () => {
    if (!petByID || !petId || !medicalHistoryData.description.trim()) {
      setMessage("La descripción no puede estar vacía.");
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
      petByID.medical_history.length === 0
    ) {
      setMessage("No hay historial médico para asociar la sesión veterinaria.");
      return;
    }

    const medicalHistoryId = petByID.medical_history[0].id;

    if (!petVetInfo.address.trim() || !petVetInfo.treatment.trim()) {
      setMessage("La dirección y el tratamiento son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await createVetSession(medicalHistoryId, petVetInfo); // Enviar datos sin transformar

      if (response) {
        setMessage("Sesión veterinaria creada con éxito.");
        getPetById(Number(petId)); // Refrescar datos
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
        setMessage("Sesión veterinaria eliminada con éxito.");
        getPetById(Number(petId)); // Recargar datos de la mascota
        setIsDeleteDialogOpen(false);
      } else {
        setMessage("No se pudo eliminar la sesión veterinaria.");
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
      petByID.medical_history.length === 0
    ) {
      setMessage("No hay historial médico asociado.");
      return;
    }

    setLoading(true);
    try {
      const response = await editVetSession(vetId, petVetInfo); // 🚀 DIRECTO, SIN FORM DATA

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
      cost: vetSession.cost ? String(vetSession.cost) : "",
      medical_notes: vetSession.medical_notes || "",
      files: [], // No tocar archivos nuevos aquí
      existingFiles: vetSession.documents || [], // Cargar documentos actuales
      id: vetSession.id, // Guardar el ID de la sesión para editar
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

        // 🔥 Actualizamos la lista para que desaparezca el documento sin recargar la página
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
        // Ya existe → Editamos
        await travelMode.updateTravelMode(petByID.care_profile.id, formData);
      } else {
        // No existe → Creamos
        await travelMode.createTravelMode(formData);
      }

      getPetById(Number(petId));
      setMessage("Travel Mode actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando Travel Mode:", error);
      setMessage("Ocurrió un error al actualizar el Travel Mode.");
    }
  };

  return (
    <div className="">
      <div>
        <button
          className=" border-none py-3 px-4 ms-3 mt-5 bg-teal-500 text-white rounded-lg"
          onClick={() =>
            document.getElementById("my_modal_5_pet_id_alerts").showModal()
          }
        >
          CREATE ALER
        </button>
      </div>
      <div className="mt-2 p-5">
        {message && <div className="alert">{message}</div>}{" "}
        {/* Mostrar mensaje */}
        <h1 className=" text-4xl mb-2" style={{ fontFamily: "chapFont" }}>
          Welcome to {petByID.name} dashbaord
        </h1>
        <form
          method="dialog"
          onSubmit={handleSubmit}
          className="border -2 border-[#65bcbb] rounded-lg p-5"
        >
          <div className="flex justify-between">
            <div>
              {" "}
              <h2 className="text-lg">General info</h2>
            </div>
            <div>
              {" "}
              <span onClick={() => toggleCollapse("generalInfo")}>
                {collapseBox.generalInfo ? (
                  <ChevronUpIcon className="h-6 w-6 text-[#65bcbb]" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-[#65bcbb]" />
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
                  {petInfo.profile_photo && (
                    <img
                      src={petInfo.profile_photo} // Mostrará la foto actual
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
                        document.getElementById("my_modal_3_pet_id").showModal()
                      }
                    />
                  )}
                </div>
              </div>

              <div className="flex">
                <div className="mb-4 w-full">
                  <label>Mom's Name</label>
                  <input
                    type="text"
                    name="mom_name"
                    value={petInfo.mom_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Mom's Name"
                  />
                </div>

                <div className="mb-4 w-full ms-2">
                  <label>Dad's Name</label>
                  <input
                    type="text"
                    name="dad_name"
                    value={petInfo.dad_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Dad's Name"
                  />
                </div>
              </div>

              <div className="flex">
                <div className="mb-4 w-full">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={petInfo.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Pet's Name"
                  />
                </div>

                <div className="mb-4 w-full ms-2">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={petInfo.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Pet's Age"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label>Personality</label>
                <input
                  type="text"
                  name="personality"
                  value={petInfo.personality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Personality"
                />
              </div>

              <div className="mb-4">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={petInfo.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Address"
                />
              </div>

              <div className="flex">
                <div className="mb-4 w-full">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={petInfo.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Phone Number"
                  />
                </div>

                <div className="mb-4 w-full ms-2">
                  <label>Phone Number (Optional)</label>
                  <input
                    type="text"
                    name="phone_number_optional"
                    value={petInfo.phone_number_optional || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Optional Phone Number"
                  />
                </div>
              </div>

              <div className="flex">
                <div className="mb-4 w-full">
                  <label>Pet Color</label>
                  <input
                    type="text"
                    name="pet_color"
                    value={petInfo.pet_color}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Pet's Color"
                  />
                </div>

                <div className="mb-4 w-full ms-2">
                  <label>Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={petInfo.breed}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Breed"
                  />
                </div>
              </div>

              <div className="mb-4 flex">
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
                  <input
                    type="checkbox"
                    name="show_medical_history"
                    checked={petInfo.show_medical_history}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4 flex items-center">
                  <label className="mr-2">Show Travel Mode</label>
                  <input
                    type="checkbox"
                    name="show_travel_mode"
                    checked={petInfo.show_travel_mode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label>Vet Address</label>
                <input
                  type="text"
                  name="vet_address"
                  value={petInfo.vet_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Vet Address"
                />
              </div>

              <div className="mb-4">
                <label>Neighbourhood</label>
                <input
                  type="text"
                  name="neighbourhood"
                  value={petInfo.neighbourhood}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Neighbourhood"
                />
              </div>

              <div className="mb-4">
                <label>Chip Number</label>
                <input
                  type="number"
                  name="chip_number"
                  value={petInfo.chip_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Chip Number"
                />
              </div>

              <div className="modal-action">
                <button
                  className=" border-none py-3 px-4 ms-3 bg-cyan-500 text-white rounded-lg"
                  onClick={handleSubmit}
                >
                  create{" "}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </form>
      </div>

      <div className="px-5">
        <div className="border -2 border-[#65bcbb] rounded-lg p-5">
          <div className="flex justify-between">
            <div>
              {" "}
              <h2 className="text-lg">Crear historial médico</h2>
            </div>
            <div>
              {" "}
              <span onClick={() => toggleCollapse("medicalHistory2")}>
                {collapseBox.medicalHistory2 ? (
                  <ChevronUpIcon className="h-6 w-6 text-[#65bcbb]" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-[#65bcbb]" />
                )}
              </span>
            </div>
          </div>

          {collapseBox.medicalHistory2 ? (
            <div>
              <textarea
                name="description"
                value={medicalHistoryData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Escribe la descripción del historial médico aquí..."
                rows={5}
              />

              <input
                type="text"
                name="current_treatment"
                value={medicalHistoryData.current_treatment}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Tratamiento actual"
              />

              <input
                type="date"
                name="last_doctor_visit"
                value={medicalHistoryData.last_doctor_visit}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
              />

              <input
                type="text"
                name="important_notes"
                value={medicalHistoryData.important_notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Notas importantes"
              />

              <input
                type="text"
                name="allergies"
                value={medicalHistoryData.allergies}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Alergias"
              />

              <input
                type="number"
                name="weight"
                value={medicalHistoryData.weight}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Peso (kg)"
              />

              <input
                type="number"
                name="height"
                value={medicalHistoryData.height}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Altura (cm)"
              />

              <input
                type="text"
                name="chronic_conditions"
                value={medicalHistoryData.chronic_conditions}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Condiciones crónicas"
              />

              <input
                type="text"
                name="medications"
                value={medicalHistoryData.medications}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Medicamentos actuales"
              />

              <input
                type="text"
                name="surgical_history"
                value={medicalHistoryData.surgical_history}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Historial de cirugías"
              />

              <input
                type="text"
                name="vaccination_status"
                value={medicalHistoryData.vaccination_status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Estado de vacunación"
              />

              <input
                type="text"
                name="blood_type"
                value={medicalHistoryData.blood_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Tipo de sangre"
              />

              <input
                type="text"
                name="diet"
                value={medicalHistoryData.diet}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Dieta"
              />

              <input
                type="text"
                name="behavior_notes"
                value={medicalHistoryData.behavior_notes}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg mb-4"
                placeholder="Notas de comportamiento"
              />

              {/* Botón para crear el historial */}
              <div className="flex justify-end">
                {" "}
                <button
                  className="border-none py-3 px-4 bg-blue-500 text-white rounded-lg"
                  onClick={handleCreateOrEditMedicalHistory}
                  disabled={loading}
                >
                  {loading
                    ? "Creando historial médico..."
                    : "Crear Historial Médico"}
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="border -2 border-[#65bcbb] rounded-lg p-5">
          <div className="flex justify-between">
            <div>
              {" "}
              <h2 className="text-lg">Crear visita al veterinario</h2>
            </div>
            <div>
              {" "}
              <span onClick={() => toggleCollapse("vetSession")}>
                {collapseBox.vetSession ? (
                  <ChevronUpIcon className="h-6 w-6 text-[#65bcbb]" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-[#65bcbb]" />
                )}
              </span>
            </div>
          </div>

          {collapseBox.vetSession ? (
            <div>
              <div className="mb-4 w-full">
                <label>address</label>
                <input
                  type="text"
                  name="address"
                  value={petVetInfo.address}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="address"
                />
              </div>

              <div className="mb-4 w-full ms-2">
                <label>treatment</label>
                <input
                  type="text"
                  name="treatment"
                  value={petVetInfo.treatment}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="treatment"
                />
              </div>

              <div className="mb-4 w-full ms-2">
                <label>notes</label>
                <input
                  type="text"
                  name="notes"
                  value={petVetInfo.notes}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="notes"
                />
              </div>

              <div className="mb-4 w-full ms-2">
                <label>cause</label>
                <input
                  type="text"
                  name="cause"
                  value={petVetInfo.cause}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="cause"
                />
              </div>

              <div className="mb-4 w-full ms-2">
                <label>cost</label>
                <input
                  type="text"
                  name="cost"
                  value={petVetInfo.cost}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="cost"
                />
              </div>

              <div className="mb-4 w-full ms-2">
                <label>medical_notes:</label>
                <input
                  type="text"
                  name="medical_notes"
                  value={petVetInfo.medical_notes}
                  onChange={handleChangeVet}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Dad's Name"
                />
              </div>

              <div className="mb-4 w-full">
                <label>Documentos (PDF, imágenes, etc.)</label>
                <input
                  type="file"
                  name="files"
                  multiple
                  onChange={handleChangeVet} // Maneja la carga de archivos
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Botón para crear el historial */}
              <div className="flex justify-end">
                {" "}
                <button
                  className="border-none py-3 px-4 bg-blue-500 text-white rounded-lg"
                  onClick={handleCreateVetSession}
                  // disabled={loading}
                >
                  vet session
                </button>
              </div>

              {petByID?.medical_history?.length > 0 &&
              petByID.medical_history[0].vets.length > 0 ? (
                petByID.medical_history[0].vets.map((vetSession) => (
                  <div
                    key={vetSession.id}
                    className="border p-4 rounded-lg mb-3 shadow-md"
                  >
                    <h3 className="text-md font-semibold">
                      Visita ID: {vetSession.id}
                    </h3>
                    <p>
                      <strong>Dirección:</strong> {vetSession.address}
                    </p>
                    <p>
                      <strong>Tratamiento:</strong> {vetSession.treatment}
                    </p>
                    <p>
                      <strong>Causa:</strong> {vetSession.cause}
                    </p>
                    <p>
                      <strong>Notas:</strong> {vetSession.notes}
                    </p>
                    <p>
                      <strong>Notas Médicas:</strong> {vetSession.medical_notes}
                    </p>
                    <p>
                      <strong>Costo:</strong>{" "}
                      {vetSession.cost ? `$${vetSession.cost}` : "N/A"}
                    </p>
                    <p>
                      <strong>url</strong>{" "}
                      {vetSession?.documents?.map((item, index) => {
                        return (
                          <div key={index}>
                            <p>{item.file_url}</p>
                          </div>
                        );
                      })}
                    </p>
                    <div>
                      <TrashIcon
                        className="h-6 w-6 text-[#65bcbb]"
                        onClick={() => {
                          setVetIdToDelete(vetSession.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      />
                    </div>
                    <button
                      className="border-none py-2 px-4 mt-3 bg-yellow-500 text-white rounded-lg"
                      onClick={() => openEditModal(vetSession)}
                    >
                      Editar sesión
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No hay sesiones veterinarias registradas.
                </p>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="border -2 border-[#65bcbb] rounded-lg p-5">
          <div className="flex justify-between">
            <div>
              {" "}
              <h2 className=" text-lg"> Create Vaccines</h2>
            </div>
            <div>
              {" "}
              <span onClick={() => toggleCollapse("vaccines")}>
                {collapseBox.vaccines ? (
                  <ChevronUpIcon className="h-6 w-6 text-[#65bcbb]" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-[#65bcbb]" />
                )}
              </span>
            </div>
          </div>

          {collapseBox.vaccines ? (
            <div>
              <div className="flex justify-between gap-2">
                <div className="w-full mt-2">
                  <div>
                    <label>name of the vaccine</label>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="name of the vaccine"
                    name="name"
                    value={vaccineData.name}
                    onChange={handleVaccineInputChange}
                  />
                </div>
                <div className="w-full mt-2">
                  <div>
                    <label>vaccine type</label>
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="vaccine type"
                    name="vaccine_type"
                    value={vaccineData.vaccine_type}
                    onChange={handleVaccineInputChange}
                  />
                </div>
              </div>
              <div className="flex justify-between gap-2">
                {" "}
                <div className="w-full mt-2">
                  <div>
                    <label>date_administered</label>
                  </div>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="date_administered"
                    name="date_administered"
                    value={vaccineData.date_administered}
                    onChange={handleVaccineInputChange}
                  />
                </div>
                <div className="w-full mt-2">
                  <div>
                    <label>expiration_date</label>
                  </div>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="expiration_date"
                    name="expiration_date"
                    value={vaccineData.expiration_date}
                    onChange={handleVaccineInputChange}
                  />
                </div>
              </div>
              <button
                className="border-none py-3 px-4 bg-blue-500 text-white rounded-lg"
                onClick={handleCreateVaccine}
                disabled={loading}
              >
                {loading ? "Creando vacuna..." : "Crear Vacuna"}
              </button>

              <div>
                Your vaccines:
                {petByID.medical_history?.length > 0 &&
                petByID.medical_history[0].vaccines?.length > 0 ? (
                  petByID.medical_history[0].vaccines.map((vaccine) => (
                    <div
                      key={vaccine.id}
                      className="border p-4 rounded-lg mb-3 shadow-md"
                    >
                      <p>Nombre: {vaccine.name}</p>
                      <p>Tipo: {vaccine.vaccine_type}</p>
                      <p>
                        Fecha de administración: {vaccine.date_administered}
                      </p>
                      <p>Fecha de expiración: {vaccine.expiration_date}</p>
                      <TrashIcon
                        className="h-6 w-6 text-red-500 cursor-pointer"
                        onClick={() => {
                          setVaccineIdToDelete(vaccine.id);
                          setIsDeleteVaccineDialogOpen(true);
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No hay vacunas registradas.</p>
                )}
              </div>
              <DeleteDialog
                isOpen={isDeleteVaccineDialogOpen}
                onClose={() => setIsDeleteVaccineDialogOpen(false)}
                onConfirm={handleDeleteVaccineFunc}
                itemName={`Vacuna: ${vaccineIdToDelete ?? ""}`}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="p-5">
        <TravelModeForm
          travelModeData={petByID?.care_profile}
          onSubmit={handleCreateOrEditCareProfile}
          petId={petId}
          isCollapsed={collapseBox.travelMode}
          onToggleCollapse={() => toggleCollapse("travelMode")}
        />
      </div>

      <div className="p-3">
        <h1 className="font-bold text-4xl" style={{ fontFamily: "chapFont" }}>
          Your tags:
        </h1>
      </div>

      <div className="flex gap-5 items-center flex-col md:flex-row p-5">
        {petByID?.tags.map((tag) => {
          return (
            <div
              key={tag.id}
              className="border -2 border-[#65bcbb] rounded-lg p-5 w-full md:w-[250px]"
            >
              <div className=" ">
                <img
                  className="w-full md:w-[225px]"
                  src="https://files.oaiusercontent.com/file-KbjTvrX2yEGoKk263cPQUo?se=2025-03-21T14%3A07%3A24Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Deb49cb05-2a39-4000-ac3b-49afab71b857.webp&sig=23bzJlNU90s0s00FPnai60CPDrqSFzBPjbS7eOSUmAs%3D"
                  alt="dd"
                />
                <div className="mt-2">
                  <p>
                    Color:<strong>{tag.color}</strong>{" "}
                  </p>
                  <p className="">
                    Shape: <strong>{tag.shape}</strong>{" "}
                  </p>
                  {/* <p className=""> {tag.material}</p> */}
                </div>
                <div className="mt-4 flex justify-between gap-3 w-full">
                  <button
                    className=" border-none py-3 px-4 bg-teal-700 text-white rounded-lg"
                    onClick={() => addToCart(tag.id)}
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => openDeleteModal(tag.id)}
                    className=" border-none py-3 px-4 bg-teal-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName="este tag"
      />

      {/* //modal here to change image  */}
      <dialog id="my_modal_3_pet_id" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
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
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* //modal here to create or edit medical vet session   */}
      <dialog id="my_modal_4_pet_id" className="modal">
        <div className="modal-box max-w-4xl">
          <h3 className=" text-lg" style={{ fontFamily: "chapFont" }}>
            Editar Sesión Veterinaria
          </h3>

          {/* Inputs para editar */}
          <input
            type="text"
            name="address"
            value={petVetInfo.address}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder="Dirección"
          />

          <input
            type="text"
            name="treatment"
            value={petVetInfo.treatment}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder="Tratamiento"
          />

          <input
            type="text"
            name="cause"
            value={petVetInfo.cause}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder="Causa"
          />

          <input
            type="text"
            name="medical_notes"
            value={petVetInfo.medical_notes}
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-2"
            placeholder="Notas médicas"
          />

          {/* Archivos actuales */}
          <h4 className="font-semibold mt-4">Documentos Actuales:</h4>
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
              <p className="text-gray-500">No hay documentos adjuntos.</p>
            )}
          </div>

          <DeleteDialog
            isOpen={isDeleteDocDialogOpen}
            onClose={() => setIsDeleteDocDialogOpen(false)}
            onConfirm={handleDeleteVetDocument}
            itemName="este documento"
          />

          {/* Subir nuevos archivos */}
          <h4 className="font-semibold mt-4">Agregar Nuevos Documentos:</h4>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleChangeVet}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />

          {/* Botones */}
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleEditVetSession}>
              Guardar Cambios
            </button>
            <form method="dialog">
              <button className="btn">Cerrar</button>
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
          <h3 className="font-bold text-lg">Hello!</h3>
          <ScheduleAlertForm userId={auth.user?.id} />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
