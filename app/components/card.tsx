import { Link } from "@remix-run/react"; // Importa Link de Remix
import { useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import tagImg from "../images/tag.png";
import "../../styles/dashboard.css";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

type CardProps = {
  petObj: {
    id: number;
    name: string;
    age: number;
    personality: string;
    address: string;
    phone_number: number;
    phone_number_optional: number | null;
    profile_photo: string;
    pet_color: string;
    breed: string;
    lost: boolean;
    vet_address: string;
    neighbourhood: string;
    mom_name: string;
    dad_name: string;
    chip_number: number;
    user_id: number;
  };
};
export default function Card({ petObj }: CardProps) {
  const [selectPetId, setSelectPetId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("selectPetId", selectPetId);
  const { auth, pet, tag, cart } = useGlobalContext();
  const { createTag, tagInfo } = tag;
  const { actSideBar, selectPetIdForTag, selectPetIdNew } = cart;
  console.log("selectPetIdNew", selectPetIdNew);
  // Accede a la info del usuario
  const user = auth.user;

  const { deletePetById, getPets } = pet;

  const grabpetIdToDelete = (id: number) => {
    console.log("id", id);
    setSelectPetId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectPetId !== null) {
      await deletePetById(selectPetId); // Lógica para eliminar la mascota
      await getPets(user.id); // Refresca la lista de mascotas
    }
    setIsModalOpen(false); // Cierra el modal
    setSelectPetId(null); // Limpia el estado
  };

  const [tagInfoData, setTagInfoData] = useState({
    shape: "circular",
    name: true,
    continue_later: false,
    material: "metal",
    color: "blue",
  });

  const [selectPetIdTag, setSelectPetIdTag] = useState<number | null>(null);
  console.log("setSelectPetIdTag", selectPetIdTag);
  const handleBuyTag = (id: number) => {
    document.getElementById("my_modal_2").showModal();
    console.log("ID recibido para comprar tag:", id);
    selectPetIdForTag(id); // Cambia el estado
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setTagInfoData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Si es checkbox, usa `checked`, si no, usa `value`
    }));
  };

  const handleCreateTag = async () => {
    if (selectPetIdNew !== null) {
      try {
        const petId = selectPetIdNew;
        const response = await createTag(petId, tagInfoData); // Usamos el estado `tagInfo` directamente
        if (response) {
          alert("¡Chapa creada con éxito!");
          document.getElementById("my_modal_2").close();
        } else {
          alert("Hubo un error al crear la chapa");
        }
      } catch (error) {
        console.error("Error al crear la chapa:", error);
        alert("Error al conectar con el servidor.");
      }
    } else {
      alert("El perfil de la mascota no tiene un ID válido.");
    }
  };

  return (
    <div className="ms-2 ">
      <div
        className=" relative card bg-base-100 w-96 shadow-xl border-[5px] border-[#65bcbb]"
        style={{ zIndex: actSideBar ? -10 : "auto" }}
      >
        <div className="absolute bottom-[88%] left-[64%] transform -translate-x-1/2 w-[90%]">
          <Link to={`/trackerPet/${petObj.id}`}>
            <button className=" bg-white text-emerald-800 shadow-md rounded-md px-2 py-2 w-full flex justify-center items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              ¡Trackea aquí tu perro!
            </button>
          </Link>
        </div>

        <figure>
          <img
            src={
              petObj.profile_photo
                ? petObj.profile_photo
                : "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            }
            alt="Shoes"
            className="w-full h-64 object-cover"
          />
        </figure>
        <div className="card-body">
          <div className="flex justify-between">
            <div>
              <h2
                className="card-title text-[22px]"
                style={{ fontFamily: "chapFont" }}
              >
                {petObj.name}
              </h2>
            </div>

            <div className="card-actions justify-end ms-2">
              <button
                className="h-6 w-6 text-cyan-500"
                onClick={() => grabpetIdToDelete(petObj.id)}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          <p>{petObj.personality}</p>
          <p>{petObj.age}</p>
          {/* <div className="flex flex-col w-full">
            <div className=" ">
              <Link to={`/pets/${petObj.id}`}>
                <button className="btn btn-primary">Pet's Details</button>
              </Link>
            </div>

            <div className="mt-2 w-full">
              <button
                className="btn btn-primary"
                onClick={() => handleBuyTag(petObj.id)}
              >
                Buy A tag
              </button>
            </div>
          </div> */}
          <div className="flex flex-col gap-2 mt-2">
            <Link to={`/pets/${petObj.id}`}>
              <button className=" border-none py-3 px-4  bg-teal-500 text-white rounded-lg w-full">
                Pet's Details
              </button>
            </Link>

            <button
              className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full"
              onClick={() => handleBuyTag(petObj.id)}
            >
              Buy A tag
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the pet{" "}
              <span className="font-semibold">{petObj.name}</span>?
            </p>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
          <h3 className="font-bold text-lg">Crea Tu chapa aqui</h3>

          <>
            <div className="flex mt-3">
              <div className="w-1/2 border-r border-gray-500 ">
                <div className="me-5">
                  <div>
                    <label>Material</label>
                  </div>
                  <div>
                    <select
                      name="material"
                      value={tagInfoData.material}
                      onChange={handleTagChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="metal">Metal</option>
                      <option value="plastic">Plástico</option>
                      <option value="leather">Cuero</option>
                    </select>
                  </div>
                </div>

                <div className="me-5">
                  <div>
                    <label>Shape</label>
                  </div>
                  <div>
                    <select
                      name="shape"
                      value={tagInfoData.shape}
                      onChange={handleTagChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="circular">Circular</option>
                      <option value="square">Cuadrado</option>
                      <option value="heart">Corazón</option>
                    </select>
                  </div>
                </div>

                <div className="me-5">
                  <div>
                    <label>Color</label>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="color"
                      value={tagInfoData.color}
                      onChange={handleTagChange}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Color"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <div>
                    <label>Name</label>
                  </div>
                  <div className="ms-2">
                    <input
                      type="checkbox"
                      name="name"
                      checked={tagInfoData.name}
                      onChange={handleTagChange}
                    />
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <div>
                    <label>Continue Later</label>
                  </div>
                  <div className="ms-2">
                    <input
                      type="checkbox"
                      name="continue_later"
                      checked={tagInfoData.continue_later}
                      onChange={handleTagChange}
                    />
                  </div>
                </div>

                <button
                  className="btn  bg-teal-500 w-[92%] mt-2 me-2"
                  onClick={handleCreateTag}
                >
                  Crea tu chapa aqui
                </button>
              </div>
              <div className="w-1/2 flex justify-center items-center">
                <img src={tagImg} alt="tag" className="w-[250px]" />
              </div>
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  document.getElementById("my_modal_2").close();
                  setSelectPetIdTag(null); // Cierra el modal
                }}
              >
                Close
              </button>
            </div>
          </>
        </div>
      </dialog>
    </div>
  );
}
