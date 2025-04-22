/* eslint-disable jsx-a11y/label-has-associated-control */

import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import Card from "~/components/card";
import "../../../styles/dashboard.css";
import { Link } from "@remix-run/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "@remix-run/react";

import {
  ShoppingCartIcon,
  SparklesIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";
import { showErrorToast } from "~/utils/toast";

export default function Dashboard() {
  const { auth, pet, tag, cart } = useGlobalContext();
  const user = auth.user;
  const { createPet, getPets, allPets, petProfile } = pet;
  const { createTag, tagInfo } = tag;
  const { createCart, cartProfile, getCartByUser } = cart;
  const [tagInfoData, setTagInfoData] = useState({
    shape: "circular",
    name: true,
    continue_later: false,
    material: "aluminum",
    color: "",
  });

  const [petInfo, setPetInfo] = useState({
    name: "",
    age: 0,
    personality: "",
    address: "",
    phone_number: "",
    phone_number_optional: "",
    profile_photo: undefined,
    pet_color: "",
    breed: "",
    lost: false,
    vet_address: "",
    neighbourhood: "",
    mom_name: "",
    dad_name: "",
    chip_number: 0,
    show_medical_history: false,
    show_travel_mode: false,
  });

  const [welcomeModal, setWelcomeModal] = useState(true);
  const [petInfoModal, setPetInfoModal] = useState(false);
  const [petChapModal, setPetChapModal] = useState(false);
  const [addTocardOrBuy, setAddTocardOrBuy] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsTag, setErrorsTag] = useState({});

  const navigate = useNavigate();

  const tagImages = [
    {
      shape: "square",
      color: "purple",
      imageUrl: "/purpleSqure.png",
    },
    {
      shape: "circular",
      color: "purple",
      imageUrl: "/circlePurple.png",
    },
    {
      shape: "square",
      color: "black",
      imageUrl: "/blackSqure.png",
    },
    // {
    //   shape: "circular",
    //   color: "black",
    //   imageUrl: "/blackSqure.png",
    // },
  ];

  const selectedImage = tagImages.find(
    (img) =>
      img.shape === tagInfoData.shape.toLowerCase() &&
      img.color === tagInfoData.color.toLowerCase()
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, files } = e.target;
    setPetInfo((prevInfo) => ({
      ...prevInfo,
      [name]: type === "file" ? files?.[0] : e.target.value,
    }));
  };

  const firstTwoLater = () => {
    const result = user ? user.full_name.slice(0, 2) : null;
    return result;
  };

  const validatePetInfo = (info) => {
    const newErrors = {};

    if (!info.name.trim()) newErrors.name = true;
    if (!info.mom_name.trim()) newErrors.mom_name = true;
    if (!info.dad_name.trim()) newErrors.dad_name = true;
    if (!info.personality.trim()) newErrors.personality = true;
    if (info.age <= 0) newErrors.age = true;
    if (!info.phone_number.trim()) newErrors.phone_number = true;
    if (!info.pet_color.trim()) newErrors.pet_color = true;
    if (!info.breed.trim()) newErrors.breed = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const validateTagInfo = (info) => {
    const newErrors = {};

    if (!info.shape.trim()) newErrors.shape = true;
    if (!info.material.trim()) newErrors.material = true;
    if (!info.color.trim()) newErrors.color = true;

    setErrorsTag(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePetInfo(petInfo)) return;

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
    if (!validateTagInfo(tagInfoData)) return;
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
        quantity: 1,
        price: 100,
        subtotal: 100,
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

  const handlePetSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`/trackerPet/${selectedId}`);
    }
  };

  return (
    <div>
      <div className="mt-4 p-3">
        <div className="">
          {user ? (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div>
                  <div className="placeholder ">
                    <div className="bg-neutral text-neutral-content flex justify-center items-center h-12 w-12 rounded-full">
                      <div>
                        <span
                          className="text-1xl"
                          style={{ fontFamily: "chapFont" }}
                        >
                          {firstTwoLater()}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p
                    className="text-2xl font-semibold text-white ms-2"
                    style={{ fontFamily: "chapFont" }}
                  >
                    Hola, {user.full_name}!
                  </p>
                </div>
              </div>
              <div>
                {allPets.length > 0 ? (
                  <div className="tooltip" data-tip="Crea Tu mascota">
                    <div
                      className="h-10 w-10 rounded-full flex justify-center items-center bg-teal-500"
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                    >
                      <PlusIcon className="w-6 h-6" />
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            // Renderiza el nombre si el usuario está logueado
            <p>Por favor, inicia sesión.</p> // Mensaje si el usuario no está logueado
          )}
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
            <div className="flex items-center justify-center">
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  welcomeModal
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                1
              </div>
              <div className="box-line w-16 h-1 bg-gray-300"></div>
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  petInfoModal
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                2
              </div>
              <div className="box-line w-16 h-1 bg-gray-300"></div>
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  petChapModal
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                3
              </div>
              <div className="box-line w-16 h-1 bg-gray-300"></div>
              <div
                className={`box-ball w-10 h-10 flex justify-center items-center rounded-full ${
                  addTocardOrBuy
                    ? "bg-teal-500 text-white"
                    : "bg-gray-300 text-black"
                } font-bold`}
              >
                4
              </div>
            </div>
            {welcomeModal && (
              <div className="mb-6 mt-5">
                <div className="flex items-center gap-1 mt-5">
                  <h2
                    className="text-2xl font-bold text-teal-500"
                    style={{ fontFamily: "chapFont" }}
                  >
                    ¡Bienvenido {user?.full_name || ""}!{" "}
                  </h2>
                  <div>
                    <span>
                      {" "}
                      <SparklesIcon className="text-teal-500 h-6 w-6" />
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-md">
                  ¿Estás listo para cuidar y trackear a tu mascota?
                  <br />
                  Crea su perfil, diseña su chapa, cómprala y disfruta de todas
                  las funcionalidades.
                </p>
                <button
                  onClick={() => {
                    setWelcomeModal(false); // Oculta la bienvenida
                    setPetInfoModal(true); // Muestra el form de mascota
                  }}
                  className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
                >
                  Crear Mascota
                </button>
              </div>
            )}
            {petInfoModal && (
              <div className="mt-2">
                <div className="flex items-center gap-1 mt-5">
                  <h2
                    className="text-2xl font-bold text-teal-500"
                    style={{ fontFamily: "chapFont" }}
                  >
                    ¡Pon la informacion!
                  </h2>
                  <div>
                    <span>
                      {" "}
                      <DocumentTextIcon className="text-teal-500 h-6 w-6" />
                    </span>
                  </div>
                </div>
                <p className="mt-0 text-md">
                  mientras mas informacion coloques mejor, asi ayudaremos a
                  completar tu dahbord mas rapido
                </p>
                <form method="dialog" className="mt-5">
                  <div>
                    <h2 className="text-1xl font-bold text-white">
                      Con estos settings podras cambiar como se vialuiza tu
                      chapa, no te procupes por ellos ahora:
                    </h2>
                    <div className="mb-4 flex flex-col md:flex-row gap-3 mt-3">
                      <div className="mb-4 flex items-center">
                        <label className="mr-2">Lost</label>
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
                          className="radio radio-accent"
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
                          className="radio radio-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 w-full">
                      <label>Mom's Name</label>
                      <input
                        type="text"
                        name="mom_name"
                        value={petInfo.mom_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.mom_name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Mom's Name"
                      />
                    </div>

                    <div className="mb-4 w-full ms-0 md:ms-2">
                      <label>Dad's Name</label>
                      <input
                        type="text"
                        name="dad_name"
                        value={petInfo.dad_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.dad_name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Dad's Name"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 w-full">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={petInfo.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Pet's Name"
                      />
                    </div>

                    <div className="mb-4 w-full ms-0 md:ms-2">
                      <label>Age</label>
                      <input
                        type="number"
                        name="age"
                        value={petInfo.age}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.age ? "border-red-500" : "border-gray-300"
                        }`}
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
                      className={`w-full px-4 py-2 border rounded-lg ${
                        errors.personality
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
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

                  <div className="flex flex-col md:flex-row">
                    <div className="mb-4 w-full">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        name="phone_number"
                        value={petInfo.phone_number}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.phone_number
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Phone Number"
                      />
                    </div>

                    <div className="mb-4 w-full ms-0 md:ms-2">
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

                  <div className="flex flew-row md:flex-col">
                    <div className="mb-4 w-full">
                      <label>Pet Color</label>
                      <input
                        type="text"
                        name="pet_color"
                        value={petInfo.pet_color}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.pet_color
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Pet's Color"
                      />
                    </div>

                    <div className="mb-4 w-full ms-0 md:ms-2">
                      <label>Breed</label>
                      <input
                        type="text"
                        name="breed"
                        value={petInfo.breed}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg ${
                          errors.breed ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Breed"
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
                    <button
                      className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
                      onClick={handleSubmit}
                    >
                      create{" "}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {petChapModal && (
              <>
                <div className="flex items-center gap-1 mt-5">
                  <h2
                    className="text-2xl font-bold text-teal-700"
                    style={{ fontFamily: "chapFont" }}
                  >
                    ¡Crea la chapa!
                  </h2>
                  <div>
                    <span>
                      {" "}
                      <WrenchScrewdriverIcon className="text-teal-700 h-6 w-6" />
                    </span>
                  </div>
                </div>
                <p className="mt-0 text-md">
                  puedes comprarla ahora o mas tarde pero ajuro necesitas tener
                  la chapa para comenzar, animate!
                </p>
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
                          className={`w-full px-4 py-2 border rounded-lg ${
                            errorsTag.material
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {/* <option value="wood">Wood</option> */}
                          <option value="aluminum">Aluminum</option>
                          {/* <option value="acrylic">Acrylic</option> */}
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
                          className={`w-full px-4 py-2 border rounded-lg ${
                            errorsTag.shape
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="circular">Circular</option>
                          <option value="square">Square</option>
                          {/* <option value="heart">Heart</option>
                          <option value="bone">Bone</option> */}
                        </select>
                      </div>
                    </div>

                    <div className="me-5">
                      <div>
                        <label>Color</label>
                      </div>
                      <div>
                        <select
                          name="color"
                          value={tagInfoData.color}
                          onChange={handleTagChange}
                          className={`w-full px-4 py-2 border rounded-lg ${
                            errorsTag.color
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="purple">Purple</option>
                          <option value="black">Black</option>
                          <option value="blue">Blue</option>
                          <option value="green">Green</option>

                          {/* <option value="heart">Heart</option>
                          <option value="bone">Bone</option> */}
                        </select>
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

                    {/* <div className="flex items-center mt-2">
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
                    </div> */}

                    <button
                      className="btn  bg-teal-500 w-[92%] mt-2 me-2"
                      onClick={handleCreateTag}
                    >
                      Crea tu chapa aqui
                    </button>
                  </div>
                  <div className="w-1/2 flex justify-center items-center">
                    {selectedImage ? (
                      <img
                        src={selectedImage.imageUrl}
                        alt="Tag preview"
                        className="w-[250px] h-[250px] object-contain"
                      />
                    ) : (
                      <div className="w-[250px] h-[250px] bg-gray-200 flex items-center justify-center text-gray-500">
                        Sin preview
                      </div>
                    )}
                    {/* {tagInfoData.shape === "circular" && (
                      <div className="w-[250px] h-[250px] bg-gray-300 rounded-full"></div>
                    )}
                    {tagInfoData.shape === "square" && (
                      <div className="w-[250px] h-[250px] bg-gray-300"></div>
                    )} */}
                    {/* {tagInfoData.shape === "heart" && (
                      <div className="w-[250px] h-[250px] bg-gray-300 heart-shape"></div>
                    )}
                    {tagInfoData.shape === "bone" && (
                      <div className="bone-shape">
                        <div className="bottom-circle-left"></div>
                        <div className="bottom-circle-right"></div>
                      </div>
                    )} */}
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
                <div className="flex items-center gap-1 mt-5">
                  <h2
                    className="text-2xl font-bold text-teal-500"
                    style={{ fontFamily: "chapFont" }}
                  >
                    A solo un paso! {user?.full_name || ""}!
                  </h2>
                  <div>
                    <span>
                      {" "}
                      <CheckCircleIcon className="text-teal-500 h-6 w-6" />
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-md">
                  estas a solo un paso de pomprar la chapa,si quieres seguir
                  epxlorando o creando mas mascotas y chapas solo guardala en tu
                  carrito.
                </p>
                <small className="text-grey-500">
                  estas a solo un paso de pomprar la chapa,si quieres seguir
                  epxlorando o creando mas mascotas y chapas solo guardala en tu
                  carrito.
                </small>
                <div>
                  <small
                    className="text-xs text-gray-500 cursor-pointer"
                    onClick={() => {
                      document.getElementById("my_modal_1").close(); // Cierra el modal
                    }}
                  >
                    Continue Exploring
                  </small>
                </div>

                <div className="modal-action">
                  <button
                    className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
                    onClick={() => addToCart(tag.id)}
                  >
                    <ShoppingCartIcon className="h-6 w-6 text-white" />
                  </button>
                  <button className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600">
                    {" "}
                    pay now
                  </button>
                  <button
                    className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
                    onClick={() => {
                      document.getElementById("my_modal_1").close(); // Cierra el modal
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>
      </div>
      <div className="px-5">
        <div className="border-2 border-teal-500 p-4 rounded-md">
          <div className="flex items-center">
            <h2
              style={{ fontFamily: "chapFont" }}
              className="text-2xl font-semibold text-teal-500"
            >
              Extra features
            </h2>
            <div>
              <span>
                {" "}
                <SparklesIcon className="text-teal-500 h-6 w-6" />
              </span>
            </div>
          </div>
          <p className="m-0">
            loremp iptusm je dha jdjhfe test and aditional test loremp ipsuom{" "}
          </p>
          <div className="flex flex-col md:flex-row gap-2 mt-4">
            {allPets.length > 0 ? (
              <div>
                <Link to={`/finances`}>
                  <button className="btn  bg-teal-500 w-full md:w-auto">
                    Track your finances
                  </button>
                </Link>
              </div>
            ) : (
              ""
            )}
            {allPets.length > 0 && (
              <select
                onChange={handlePetSelect}
                className="btn bg-teal-500 text-white px-4 py-2 w-full md:w-auto rounded-md shadow-md cursor-pointer"
              >
                <option value="">Diario de tu mascota</option>
                {allPets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* <div className="flex flex-wrap justify-center gap-4 mt-4">
        {allPets.map((pet) => {
          return (
            <div key={pet.id} className="flex">
              <Card petObj={pet} />
            </div>
          );
        })}
      </div> */}
      <div className="flex justify-center items-center  min-h-[80vh] ">
        {allPets.length === 0 ? (
          <div className="text-center text-black bg-slate-100 w-[500px] max-w-full p-6 shadow-md border border-slate-200 rounded-2xl">
            <h2
              style={{ fontFamily: "chapFont" }}
              className="text-2xl font-semibold text-teal-500 mb-2"
            >
              ¡Crea tu primera Mascota!
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              A partir de aquí podrás cuidar, disfrutar y mejorar a tus
              mascotas.
            </p>
            <button
              className="btn bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition duration-300 border-none"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              Crear Mascota
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {allPets.map((pet) => (
              <div key={pet.id} className="flex">
                <Card petObj={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
