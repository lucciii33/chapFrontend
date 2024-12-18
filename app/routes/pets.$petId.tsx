import { useParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import { useGlobalContext } from "../context/GlobalProvider";

export default function PetDetail() {
  const { pet, cart, auth } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { createCart, cartProfile, getCartByUser } = cart;
  const { user } = auth;
  const [message, setMessage] = useState("");

  const { petId } = useParams();
  console.log("petttttt", petId);
  console.log("petByID", petByID);
  console.log("cartProfile", cartProfile);

  const [petInfo, setPetInfo] = useState({
    mom_name: "",
    dad_name: "",
    name: "",
    age: 0,
    personality: "",
    address: "",
    phone_number: 0,
    phone_number_optional: 0,
    profile_photo: "",
    pet_color: "",
    breed: "",
    lost: false,
    vet_address: "",
    neighbourhood: "",
    chip_number: 0,
  });

  // Sincronizar el estado con petByID cuando cambie
  useEffect(() => {
    if (petByID) {
      setPetInfo({
        mom_name: petByID.mom_name || "",
        dad_name: petByID.dad_name || "",
        name: petByID.name || "",
        age: petByID.age || 0,
        personality: petByID.personality || "",
        address: petByID.address || "",
        phone_number: petByID.phone_number || 0,
        phone_number_optional: petByID.phone_number_optional || 0,
        profile_photo: petByID.profile_photo || "",
        pet_color: petByID.pet_color || "",
        breed: petByID.breed || "",
        lost: petByID.lost || false,
        vet_address: petByID.vet_address || "",
        neighbourhood: petByID.neighbourhood || "",
        chip_number: petByID.chip_number || 0,
      });
    }
  }, [petByID]);

  useEffect(() => {
    if (petId) {
      getPetById(Number(petId));
    }
  }, []);

  if (!petByID) {
    return <div>Cargando los detalles de la mascota...</div>;
  }

  console.log("petttttt", petId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPetInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedPet = await editPet(Number(petId), petInfo); // Llamamos a editPet
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

  return (
    <div>
      <div className="mt-2 p-5">
        {message && <div className="alert">{message}</div>}{" "}
        {/* Mostrar mensaje */}
        <form method="dialog" onSubmit={handleSubmit}>
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
                type="number"
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
                type="number"
                name="phone_number_optional"
                value={petInfo.phone_number_optional || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Optional Phone Number"
              />
            </div>
          </div>
          <div className="mb-4">
            <label>Profile Photo</label>
            <input
              type="text"
              name="profile_photo"
              value={petInfo.profile_photo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Profile Photo"
            />
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
        </form>
      </div>
      <div className="p-3">
        <h1 className="font-bold text-xl">Your tags:</h1>
      </div>
      <div className="flex">
        {petByID?.tags.map((tag) => {
          return (
            <div key={tag.id} className="ms-4 border rounded w-[200px] p-3">
              <div className=" ">
                <img
                  className="w-[200px]"
                  src="https://s.alicdn.com/@sc04/kf/H623bd864f88641ab95a88756ed36cd903.jpg_720x720q50.jpg"
                  alt="dd"
                />
                <div className="flex mt-2">
                  <p>{tag.color} - </p>
                  <p className="ms-2">{tag.shape} - </p>
                  <p className="ms-2"> {tag.material}</p>
                </div>
                <div className="mt-4">
                  <button
                    className="border-2 border-cyan-500 rounded-full px-6 py-2 bg-transparent"
                    onClick={() => addToCart(tag.id)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
