/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useState } from "react";
// import { Link } from "@remix-run/react";
// import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
// import loginImage from "../../images/imageLogin4.png";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState } from "react";

export default function Dashboard() {
  const { auth } = useGlobalContext(); // Accede a la info del usuario
  const user = auth.user;
  const [petInfo, setPetInfo] = useState({
    name: "",
    age: "",
    personality: "",
    address: "",
    phone_number: "",
    phone_number_optional: null,
    profile_photo: "",
    pet_color: "",
    breed: "",
    lost: false,
    vet_address: "",
    neighbourhood: "",
    mom_name: "",
    dad_name: "",
    chip_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPetInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const firstTwoLater = () => {
    const result = user ? user.full_name.slice(0, 2) : null;
    return result;
  };
  return (
    <div className="flex justify-between p-3">
      <div>
        {user ? (
          <div className="flex items-center">
            <div>
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12 rounded-full">
                  <span className="text-1xl">{firstTwoLater()}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="ms-2">Hola, {user.full_name}!</p>
            </div>
          </div>
        ) : (
          // Renderiza el nombre si el usuario está logueado
          <p>Por favor, inicia sesión.</p> // Mensaje si el usuario no está logueado
        )}
      </div>

      <div>
        <button
          className="btn  bg-teal-500"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          Crea tu Mascota aqui
        </button>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
          <h3 className="font-bold text-lg">Agrega Tu Macota aqui</h3>
          <div className="mt-2">
            <form method="dialog">
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
                    type="tel"
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
                    type="tel"
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
                <button className="btn">Close</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
