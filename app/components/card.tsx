import { Link } from "@remix-run/react"; // Importa Link de Remix
import { useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";

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
  const { auth, pet } = useGlobalContext(); // Accede a la info del usuario
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

  return (
    <div className="ms-2">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{petObj.name}</h2>
          <p>{petObj.personality}</p>
          <div className="card-actions justify-end">
            <Link to={`/pets/${petObj.id}`}>
              <button className="btn btn-primary">Pet's Details</button>
            </Link>
          </div>

          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => grabpetIdToDelete(petObj.id)}
            >
              Delete Pet
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
    </div>
  );
}
