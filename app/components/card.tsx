import { Link } from "@remix-run/react"; // Importa Link de Remix
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import tagImg from "../images/tag.png";
import "../../styles/dashboard.css";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import AlertCircle from "./alertCircle";
import UserAlerts from "./userAlerts";
import { useTranslation } from "react-i18next";
import { showInfoToast } from "~/utils/toast";
import GpsModal from "./GpsModal";

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
  const { t, i18n } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cantBuy, setCantBuy] = useState(false);
  const { auth, pet, tag, cart, comingFromCard, inventory } =
    useGlobalContext();
  const { createTag, tagInfo, createGps } = tag;
  const { actSideBar, selectPetIdForTag, selectPetIdNew } = cart;

  const [tagTrackGps, setTagTrackGps] = useState({
    gps: false,
    tag: true,
  });

  const { getInventoryForUser, inventoryItemsUser } = inventory;
  const [stockStatus, setStockStatus] = useState<null | {
    available: boolean;
    quantity: number;
    description: string;
  }>(null);

  useEffect(() => {
    getInventoryForUser();
  }, []);

  const user = auth.user;

  const { deletePetById, getPets } = pet;

  const grabpetIdToDelete = (id: number) => {
    console.log("id", id);
    setSelectPetId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectPetId !== null) {
      await deletePetById(selectPetId);
      await getPets(user.id);
    }
    setIsModalOpen(false);
    setSelectPetId(null);
  };

  const [tagInfoData, setTagInfoData] = useState({
    shape: "circular",
    name: true,
    continue_later: false,
    material: "aluminum",
    color: "blue",
  });

  useEffect(() => {
    if (!inventoryItemsUser?.length) return;

    const match = inventoryItemsUser.find(
      (item) =>
        item.type_tag === tagInfoData.shape && item.color === tagInfoData.color
    );

    console.log("match", match);

    if (match) {
      setStockStatus({
        available: match.quantity > 0,
        quantity: match.quantity,
        description: match.description,
      });
    } else {
      setStockStatus(null);
    }
  }, [tagInfoData.shape, tagInfoData.color, inventoryItemsUser]);

  const tagImages = [
    { shape: "square", color: "purple", imageUrl: "/purpleS.png" },
    { shape: "circular", color: "purple", imageUrl: "/Cpurple.png" },
    { shape: "circular", color: "blue", imageUrl: "/Cblue.png" },
    { shape: "circular", color: "green", imageUrl: "/Cgreen.png" },
    { shape: "circular", color: "black", imageUrl: "/Cblack.png" },
    { shape: "square", color: "black", imageUrl: "/blackS.png" },
    { shape: "square", color: "blue", imageUrl: "/blueS.png" },
    { shape: "square", color: "green", imageUrl: "/greenS.png" },
    { shape: "circular-small", color: "purple", imageUrl: "/SCpurple.png" },
    { shape: "circular-small", color: "blue", imageUrl: "/SCblue.png" },
    { shape: "circular-small", color: "green", imageUrl: "/SCgreen.png" },
    { shape: "circular-small", color: "black", imageUrl: "/SCblack.png" },
  ];

  const selectedImage = tagImages.find(
    (img) =>
      img.shape === tagInfoData.shape.toLowerCase() &&
      img.color === tagInfoData.color.toLowerCase()
  );

  const [selectPetIdTag, setSelectPetIdTag] = useState<number | null>(null);
  const handleBuyTag = (id: number) => {
    document.getElementById("my_modal_2").showModal();
    console.log("ID recibido para comprar tag:", id);
    selectPetIdForTag(id);
  };

  const handleClickCommingFromLink = () => {
    comingFromCard.setComingFromCardButton(true);
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setCantBuy(false);

    setTagInfoData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateTag = async () => {
    if (selectPetIdNew !== null) {
      try {
        if (!stockStatus?.available) {
          setCantBuy(true);
          showInfoToast(
            i18n.language === "es"
              ? "No hay stock disponible para esta chapa."
              : "This tag is currently out of stock."
          );
          return;
        }
        const petId = selectPetIdNew;
        const response = await createTag(petId, tagInfoData);
        if (response) {
          await getPets(user.id);
          setTagTrackGps({ gps: true, tag: false });
          // document.getElementById("my_modal_2").close();
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

  const handleGpsApiCall = async (data: {
    deviceType: string;
    gpsColor: string;
  }) => {
    try {
      if (selectPetIdNew !== null) {
        await createGps({
          pet_id: selectPetIdNew,
          device_type: data.deviceType,
          color: data.gpsColor,
        });
      }

      document.getElementById("my_modal_2").close();
      setTagTrackGps({ gps: false, tag: true });
      setSelectPetIdTag(null);
    } catch (error) {
      console.error("Error en GPS:", error);
    }
  };

  const purchasedCount = petObj?.tags?.filter((tag) => tag.is_purchased).length;

  return (
    <div className="ms-2 ">
      <div
        className=" relative card bg-base-100 w-96 shadow-xl border-[5px] border-[#0e0f11] bg-[#2b2f38] "
        style={{ zIndex: actSideBar ? -10 : "auto" }}
      >
        <div className="absolute bottom-[59%] left-[80%] transform -translate-x-1/2 w-[90%]">
          {petObj?.tags && petObj?.tags.length > 0 && (
            <Link
              to={`/pets/${petObj.id}`}
              onClick={handleClickCommingFromLink}
            >
              <div className="bg-emerald-100 text-emerald-800 rounded-full px-4 py-1 text-xs font-semibold inline-block shadow-sm">
                {purchasedCount > 0
                  ? t("petCard.notifications.purchased", {
                      count: purchasedCount,
                    })
                  : t("petCard.notifications.notPurchased")}
              </div>
            </Link>
          )}
        </div>
        <div className="absolute bottom-[89%] left-[125%] transform -translate-x-1/2 w-[90%]">
          <AlertCircle petObj={petObj} />
        </div>

        <figure>
          <img
            src={
              petObj.profile_photo
                ? petObj.profile_photo
                : "https://chap-blue.s3.us-east-2.amazonaws.com/Group+5350.png"
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
              {/* <button
                className="h-6 w-6 text-teal-500"
                onClick={() => grabpetIdToDelete(petObj.id)}
              >
                <TrashIcon />
              </button> */}
            </div>
          </div>
          <p>
            {t("petCard.personality")}: <strong>{petObj.personality}</strong>
          </p>
          <p>
            {t("petCard.age")}: <strong>{petObj.age}</strong>
          </p>
          <p>
            {t("petCard.color")}: <strong>{petObj.pet_color}</strong>
          </p>
          <p>
            {t("petCard.breed")}: <strong>{petObj.breed}</strong>
          </p>
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
                {t("petCard.buttons.details")}
              </button>
            </Link>

            {/* {petObj?.tags && petObj?.tags.length > 0 ? (
              ""
            ) : ( */}
            <button
              className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full"
              onClick={() => handleBuyTag(petObj.id)}
            >
              {petObj?.tags && petObj.tags.length > 0
                ? t("petCard.buttons.createNewTag")
                : t("petCard.buttons.createTag")}
            </button>
            {/* )} */}
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
        <div className="modal-box w-full max-w-full sm:w-3/4 sm:max-w-4xl h-auto p-6">
          {tagTrackGps.tag && (
            <div>
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="font-bold text-lg">
                    {t("petCreation.create_tag_here")}
                  </h3>
                </div>
                <div>
                  <div
                    className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                    onClick={() =>
                      document.getElementById("my_modal_2").close()
                    }
                  >
                    <div>X</div>
                  </div>
                </div>
              </div>{" "}
              <div>
                <p className="m-2 text-sm">{t("tag_description.text")}</p>
              </div>
              <>
                <div className="flex flex-col md:flex-row mt-3">
                  <div className="w-full md:w-1/2 order-2 md:order-1 md:border-r  border-gray-500 ">
                    <div className="me-5">
                      <div>
                        <label>{t("petCreation.step2.step3.material")}</label>
                      </div>
                      <div>
                        <select
                          name="material"
                          value={tagInfoData.material}
                          onChange={handleTagChange}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="aluminum">
                            {t("petCreation.step2.step3.material_al")}
                          </option>
                          {/* <option value="plastic">Plástico</option>
                      <option value="leather">Cuero</option> */}
                        </select>
                      </div>
                    </div>

                    <div className="me-5">
                      <div>
                        <label>
                          {t("petCreation.step2.step3.shape.label")}
                        </label>
                      </div>
                      <div>
                        <select
                          name="shape"
                          value={tagInfoData.shape}
                          onChange={handleTagChange}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="circular">
                            {" "}
                            {t("petCreation.step2.step3.shape.options.circle")}
                          </option>
                          <option value="circular-small">
                            {" "}
                            {t(
                              "petCreation.step2.step3.shape.options.circular-small"
                            )}
                          </option>
                          <option value="square">
                            {" "}
                            {t(
                              "petCreation.step2.step3.shape.options.rectangle"
                            )}
                          </option>
                        </select>
                        {stockStatus?.description ? (
                          <p className="text-sm text-blue-600 m-0">
                            {
                              i18n.language === "es"
                                ? "Ideal para mascotas pequeñas(Sin border de silicon)" // traducción manual
                                : "Great for small pets (No silicon border)" // valor original de la API
                            }
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>

                    <div className="me-5">
                      <div>
                        <label>
                          {t("petCreation.step2.step3.color.label")}
                        </label>
                      </div>
                      <div>
                        <select
                          name="color"
                          value={tagInfoData.color}
                          onChange={handleTagChange}
                          className={`w-full px-4 py-2 border rounded-lg border-gray-300`}
                        >
                          <option value="purple">
                            {" "}
                            {t("petCreation.step2.step3.color.options.purple")}
                          </option>
                          <option value="black">
                            {t("petCreation.step2.step3.color.options.black")}
                          </option>
                          <option value="blue">
                            {t("petCreation.step2.step3.color.options.blue")}
                          </option>
                          <option value="green">
                            {t("petCreation.step2.step3.color.options.green")}
                          </option>

                          {/* <option value="heart">Heart</option>
                          <option value="bone">Bone</option> */}
                        </select>
                      </div>
                    </div>

                    {/* <div className="flex items-center mt-2">
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
                </div> */}

                    <button
                      className="btn  bg-teal-500 w-[92%] mt-2 me-2"
                      onClick={handleCreateTag}
                    >
                      {t("petCreation.create_tag_here")}
                    </button>
                  </div>
                  <div className="w-full md:w-1/2 order-1 md:order-2 flex mb-4 md:mt-0 justify-center items-center">
                    {selectedImage ? (
                      <img
                        src={selectedImage.imageUrl}
                        alt="Preview"
                        className="w-[250px] h-[250px] object-contain"
                      />
                    ) : (
                      <div className="w-[250px] h-[250px] bg-gray-200 flex items-center justify-center text-gray-500">
                        Sin preview
                      </div>
                    )}
                  </div>
                </div>
                {stockStatus && (
                  <p className="text-sm mt-2">
                    {stockStatus.available
                      ? i18n.language === "es"
                        ? `Disponibles: ${stockStatus.quantity}`
                        : `Available: ${stockStatus.quantity}`
                      : i18n.language === "es"
                      ? "No hay stock disponible"
                      : "Out of stock"}
                  </p>
                )}
                {cantBuy && (
                  <p>
                    {i18n.language === "es"
                      ? `Debes elegir otra chapa, lo sentimos.`
                      : `You need to chose another tag, we are sorry`}
                  </p>
                )}
                <div className="modal-action">
                  <button
                    onClick={() => {
                      document.getElementById("my_modal_2").close();
                      setSelectPetIdTag(null); // Cierra el modal
                    }}
                  >
                    {t("petCreation.step4.buttons.close")}
                  </button>
                </div>
              </>
            </div>
          )}
          {tagTrackGps.gps && (
            <div>
              <div className="flex justify-between items-center">
                <div className="">
                  <h3 className="font-bold text-lg">
                    {t("petCreation.create_gps_here")}
                    crea tu gps aqui
                  </h3>
                </div>
                <div>
                  <div
                    className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                    onClick={() =>
                      document.getElementById("my_modal_2").close()
                    }
                  >
                    <div>X</div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <GpsModal
                  gpsModal={tagTrackGps.gps}
                  setGpsModal={(v) => setTagTrackGps({ gps: v, tag: !v })}
                  handleGpsApiCall={handleGpsApiCall}
                />
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}
