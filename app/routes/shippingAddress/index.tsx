/* eslint-disable jsx-a11y/label-has-associated-control */
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState, useEffect } from "react";
import { ShippingAddressContext } from "../../context/ShippingAddressContext";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import EditDialogShippinAddress from "~/components/editDialogShippingAddress";
import DeleteDialogAddress from "~/components/deleteDialogAddress";
import CheckoutPage from "../checkout";
import { useTranslation } from "react-i18next";
import { showErrorToast } from "~/utils/toast";

export default function ShippingAddress({
  setRefreshAddresses,
}: {
  setRefreshAddresses: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { auth } = useGlobalContext();
  const user = auth.user;

  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const {
    createShippingAddress,
    getShippingAddresses,
    deleteShippingAddresses,
    editShippingAddress,
  } = ShippingAddressContext();
  const [formData, setFormData] = useState({
    country: "",
    state: "",
    city: "",
    postal_code: "",
    street_address: "",
    apartment: "",
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      try {
        const response = await getShippingAddresses(user.id);
        const data = await response.json();

        if (data) setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const [addresses, setAddresses] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const newErrors: { [key: string]: boolean } = {};

    // ✅ validamos TODOS los campos
    if (!formData.country) newErrors.country = true;
    if (!formData.state) newErrors.state = true;
    if (!formData.city) newErrors.city = true;
    if (!formData.postal_code) newErrors.postal_code = true;
    if (!formData.street_address) newErrors.street_address = true;
    // if (!formData.apartment) newErrors.apartment = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showErrorToast("Por favor completa todos los campos");
      return;
    }

    setErrors({}); // limpiamos errores
    await createShippingAddress(user.id, formData); // Enviamos la dirección
    const updatedAddresses = await getShippingAddresses(user.id); // Llamamos de nuevo al GET
    setAddresses(await updatedAddresses.json()); // Aseguramos que guardamos la data correcta
    setRefreshAddresses((prev) => !prev);
    setFormData({
      country: "",
      state: "",
      city: "",
      postal_code: "",
      street_address: "",
      apartment: "",
    }); // Limpia el formulario
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (addressToDelete !== null) {
      await deleteShippingAddresses(addressToDelete);
      const updatedAddresses = await getShippingAddresses(user.id); // Llamamos de nuevo al GET
      setAddresses(await updatedAddresses.json());
      setIsDeleteDialogOpen(false);
    }
  };

  const [addressToEdit, setAddressToEdit] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = async (updatedData: any) => {
    if (!addressToEdit) return;

    await editShippingAddress(addressToEdit.id, updatedData);
    const updatedAddresses = await getShippingAddresses(user.id);
    setAddresses(await updatedAddresses.json());
    setIsEditDialogOpen(false);
  };

  const selectAddress = async (addressId: number) => {
    try {
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) => ({
          ...addr,
          is_selected: addr.id === addressId,
        }))
      );

      const addressToUpdate = addresses.find((addr) => addr.id === addressId);
      if (!addressToUpdate) {
        console.error("Dirección no encontrada en el estado local.");
        return;
      }

      await editShippingAddress(addressId, {
        ...addressToUpdate,
        is_selected: true,
      });

      const response = await getShippingAddresses(user.id);
      setAddresses(await response.json());
      setRefreshAddresses((prev) => !prev);
    } catch (error) {
      console.error("Error al actualizar la dirección seleccionada:", error);
    }
  };

  return (
    <div className="flex items-center">
      <div className="">
        <div className="mt-3 border-2 p-5  !border-[#65bcbb] rounded-lg">
          {t("shipping_address.title")}
          <div className="mb-2 mt-3">
            <label className="block text-slate-50">
              {t("shipping_address.country_label")}
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">
                {t("shipping_address.country_placeholder")}
              </option>
              <option value="ES">Spain</option>
              <option value="PT">Portugal</option>
              <option value="IT">Italy</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="NL">Netherlands</option>
              <option value="BE">Belgium</option>
              <option value="IE">Ireland</option>
              <option value="UK">United Kingdom</option>
              <option value="USA">United States</option>
              <option value="VE">Venezuela</option>
            </select>
          </div>
          <div className="flex md:justify-between flex-col md:flex-row">
            <div className="mb-2 w-full">
              <label className="block text-slate-50">
                {t("shipping_address.state_label")}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("shipping_address.state_label")}
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2 w-full ms-0 md:ms-2">
              <label className="block text-slate-50">
                {t("shipping_address.city_label")}
              </label>
              <input
                //   type="password"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("shipping_address.city_label")}
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 w-full">
              <label className="block text-slate-50">
                {t("shipping_address.street_label")}
              </label>
              <input
                //   type="password"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.street_address ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("shipping_address.street_label")}
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex md:justify-between gap-0 md:gap-2 flex-col md:flex-row">
            <div className="mb-2 w-full">
              <label className="block text-slate-50">
                {" "}
                {t("shipping_address.zip_label")}
              </label>
              <input
                //   type="password"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.postal_code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("shipping_address.zip_label")}
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 w-full">
              <label className="block text-slate-50">
                {t("shipping_address.apartment_label")}
              </label>
              <input
                //   type="password"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.apartment ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={t("shipping_address.apartment_label")}
                name="apartment"
                value={formData.apartment}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full mt-2">
            <button
              className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg"
              onClick={handleSubmit}
            >
              {t("shipping_address.button_shipping")}
            </button>
          </div>
        </div>
        <div className="mt-3 border-2 p-5 !border-[#65bcbb] rounded-lg">
          <h2 className="text-lg font-bold">{t("saved_address.title")}</h2>

          {addresses.length > 0 ? (
            addresses.map((address, index) => (
              <div
                key={index}
                className={`flex p-5 rounded-lg mt-2 border-2 ${
                  selectedAddress === index
                    ? "border-[#65bcbb]"
                    : "border-gray-300"
                }`}
              >
                <div>
                  <input
                    type="radio"
                    name="radio-4"
                    className="radio radio-accent"
                    checked={address.is_selected}
                    onChange={() => selectAddress(address.id)} // Llama al PUT inmediatamente
                  />
                </div>
                <div className="ms-2 flex justify-between items-center">
                  <div>
                    {address.country}, {address.state}, {address.city},{" "}
                    {address.street_address}, {address.apartment},{" "}
                    {address.postal_code}.
                  </div>
                  <div className="flex">
                    <div>
                      <TrashIcon
                        className="h-6 w-6"
                        onClick={() => {
                          setAddressToDelete(address.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      />
                    </div>
                    <div className="ms-2">
                      <PencilIcon
                        className="h-6 w-6"
                        onClick={() => {
                          setAddressToEdit(address);
                          setIsEditDialogOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No addresses found.</p>
          )}
        </div>
      </div>

      <div className="ms-2">
        {/* <img src="https://files.oaiusercontent.com/file-Qc9kJhU2rmRYFr3R3A8hWW?se=2025-02-12T16%3A47%3A01Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dea5f3a76-78bc-4546-b6ab-85db3b06c781.webp&sig=ixCsgxFxaMUL7TiZQKNG1%2BAv7wDmEsy1MPfWmlaWBY0%3D" /> */}
      </div>

      <DeleteDialogAddress
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName="TESTTTT"
      />

      {addressToEdit && (
        <EditDialogShippinAddress
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleEdit}
          initialData={addressToEdit}
          t={t}
        />
      )}
    </div>
  );
}

// country: str = Field(..., example="USA")
// state: Optional[str] = Field(None, example="California")
// city: str = Field(..., example="Los Angeles")
// postal_code: str = Field(..., example="90001")
// street_address: str = Field(..., example="1234 Sunset Blvd")
// apartment: Optional[str] = Field(None, example="Apt 202")
