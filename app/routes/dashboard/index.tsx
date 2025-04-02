/* eslint-disable jsx-a11y/label-has-associated-control */

import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import Card from "~/components/card";
import "../../../styles/dashboard.css";
import { Link } from "@remix-run/react";

export default function Dashboard() {
  const { auth, pet, tag, cart } = useGlobalContext(); // Accede a la info del usuario
  const user = auth.user;
  const { createPet, getPets, allPets, petProfile } = pet;
  const { createTag, tagInfo } = tag;
  const { createCart, cartProfile, getCartByUser } = cart;
  const [tagInfoData, setTagInfoData] = useState({
    shape: "circular", // Valor por defecto
    name: true,
    continue_later: false,
    material: "wood", // Valor por defecto
    color: "blue", // Puede ser vacío si se espera llenar
  });

  const [petInfo, setPetInfo] = useState({
    name: "",
    age: 0, // Asegúrate de que sea un número
    personality: "",
    address: "",
    phone_number: "", // Esto puede ser string, pero no deberías cambiarlo a número si no es necesario
    phone_number_optional: "",
    profile_photo: undefined,
    pet_color: "",
    breed: "",
    lost: false,
    vet_address: "",
    neighbourhood: "",
    mom_name: "",
    dad_name: "",
    chip_number: 0, // Similar a phone_number, si es número debe estar bien definido
    show_medical_history: false,
    show_travel_mode: false,
  });

  console.log("petInfopetInfopetInfo", petInfo);
  const [petInfoModal, setPetInfoModal] = useState(true);
  const [petChapModal, setPetChapModal] = useState(false);
  const [addTocardOrBuy, setAddTocardOrBuy] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target;
    setPetInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "file" ? files?.[0] : e.target.value, // Maneja archivos correctamente
    }));
  };

  const firstTwoLater = () => {
    const result = user ? user.full_name.slice(0, 2) : null;
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      const petData = { ...petInfo, user_id: user.id };
      const response = await createPet(user.id, petData);
      if (response) {
        alert("Mascota creada con éxito");
        setPetChapModal(!petChapModal);
        setPetInfoModal(!petInfoModal);
        getPets(user.id);
      } else {
        alert("Hubo un error al crear la mascota");
      }
    }
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
    if (petProfile && typeof petProfile) {
      try {
        const petId = petProfile.id;
        const response = await createTag(petId, tagInfoData); // Usamos el estado `tagInfo` directamente
        if (response) {
          alert("¡Chapa creada con éxito!");
          setPetChapModal(false);
          setAddTocardOrBuy(true);
          // document.getElementById("my_modal_1").close();
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

  const addToCart = async () => {
    if (tagInfo && user && petProfile) {
      const cartData = {
        tag_id: tagInfo.id,
        pet_id: petProfile.id,
        quantity: 1, // Puedes ajustar según sea necesario
        price: 100, // Ejemplo, ajusta según el precio del tag o la lógica
        subtotal: 100, // Igual al precio inicial
        is_checked_out: false,
      };

      await createCart(user.id, cartData)
        .then((response) => {
          if (response) {
            console.log("Item added to cart successfully:", response);
            getCartByUser(user.id);
          }
        })
        .catch((error) => {
          console.error("Error adding item to cart:", error);
        });
    } else {
      console.log("else");
    }
  };

  return (
    <div>
      <div className="flex justify-between mt-4 align-middle p-3">
        <div className="">
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

        <div className="flex gap-2">
          <div>
            <button
              className="btn  bg-teal-500"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Crea tu Mascota aqui
            </button>
          </div>
          {allPets ? (
            <div>
              <Link to={`/finances`}>
                <button className="btn  bg-teal-500">
                  Track your finances
                </button>
              </Link>
            </div>
          ) : (
            ""
          )}
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
            <div className="flex items-center justify-center">
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  petInfoModal
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                1
              </div>
              <div className="box-line w-16 h-1 bg-gray-300"></div>
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  petChapModal
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                2
              </div>
              <div className="box-line w-16 h-1 bg-gray-300"></div>
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  addTocardOrBuy
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                3
              </div>
            </div>
            {petInfoModal && (
              <h3 className="font-bold text-lg">Agrega Tu Macota aqui</h3>
            )}
            {petChapModal && (
              <h3 className="font-bold text-lg">Crea Tu chapa aqui</h3>
            )}
            {addTocardOrBuy && (
              <h3 className="font-bold text-lg">Buy Now or add to card</h3>
            )}
            {petInfoModal && (
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
                  <div className="mb-4">
                    <label>Profile Photo</label>
                    <input
                      type="file"
                      name="profile_photo"
                      // value={petInfo.profile_photo}
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

                    <div className="mb-4 flex items-center">
                      <label className="mr-2">Show Medical History</label>
                      <input
                        type="checkbox"
                        name="show_medical_history"
                        checked={petInfo.show_medical_history} // Conectado al estado
                        onChange={(e) =>
                          setPetInfo((prevInfo) => ({
                            ...prevInfo,
                            show_medical_history: e.target.checked, // Actualiza el estado con el valor del checkbox
                          }))
                        }
                      />
                    </div>

                    <div className="mb-4 flex items-center">
                      <label className="mr-2">Show Travel Mode</label>
                      <input
                        type="checkbox"
                        name="show_travel_mode"
                        checked={petInfo.show_travel_mode}
                        onChange={(e) =>
                          setPetInfo((prevInfo) => ({
                            ...prevInfo,
                            show_travel_mode: e.target.checked,
                          }))
                        }
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
                    <button onClick={handleSubmit}>create </button>
                  </div>
                </form>
              </div>
            )}
            {petChapModal && (
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
                          <option value="wood">Wood</option>
                          <option value="aluminum">Aluminum</option>
                          <option value="acrylic">Acrylic</option>
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
                          <option value="square">Square</option>
                          <option value="heart">Heart</option>
                          <option value="bone">Bone</option>
                        </select>
                      </div>
                    </div>

                    {tagInfoData.material === "acrylic" && (
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
                    )}

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
                    {tagInfoData.shape === "circular" && (
                      <div className="w-[250px] h-[250px] bg-gray-300 rounded-full"></div>
                    )}
                    {tagInfoData.shape === "square" && (
                      <div className="w-[250px] h-[250px] bg-gray-300"></div>
                    )}
                    {tagInfoData.shape === "heart" && (
                      <div className="w-[250px] h-[250px] bg-gray-300 heart-shape"></div>
                    )}
                    {tagInfoData.shape === "bone" && (
                      <div className="bone-shape">
                        <div className="bottom-circle-left"></div>
                        <div className="bottom-circle-right"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-action">
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_1").close(); // Cierra el modal
                    }}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
            {addTocardOrBuy && (
              <div className="font-bold text-lg">
                Buy Now or add to card
                <div className="modal-action">
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_1").close(); // Cierra el modal
                    }}
                  >
                    Close
                  </button>

                  <button onClick={() => addToCart(tag.id)}>add to cart</button>
                  <button> pay now</button>
                </div>
              </div>
            )}
          </div>
        </dialog>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {allPets.map((pet) => {
          return (
            <div key={pet.id} className="flex">
              <Card petObj={pet} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
