/* eslint-disable jsx-a11y/label-has-associated-control */
import { useGlobalContext } from "../../context/GlobalProvider";
import { useState, useEffect } from "react";
import { ShippingAddressContext } from "../../context/ShippingAddressContext";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import DeleteDialog from "~/components/deleteDialog";
import EditDialogShippinAddress from "~/components/editDialogShippingAddress";

export default function ShippingAddress() {
  const { auth } = useGlobalContext(); // Accede a la info del usuario
  const user = auth.user;
  console.log("user", user);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

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
    if (!user?.id) return; // Si user.id no está disponible, no ejecuta nada

    const fetchAddresses = async () => {
      try {
        const response = await getShippingAddresses(user.id);
        const data = await response.json(); // 🔥 Aquí extraemos el JSON
        console.log("addresses", data); // Debug para ver qué devuelve
        if (data) setAddresses(data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]); // S

  console.log("formData", formData);

  const [addresses, setAddresses] = useState([]);
  console.log("addresses", addresses);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createShippingAddress(user.id, formData); // Enviamos la dirección
    const updatedAddresses = await getShippingAddresses(user.id); // Llamamos de nuevo al GET
    setAddresses(await updatedAddresses.json()); // Aseguramos que guardamos la data correcta
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

  return (
    <div className="p-[120px] flex items-center">
      <div className="">
        <div className="mt-3 border-2 p-5  !border-[#65bcbb] rounded-lg">
          Shipping Address
          <div className="mb-2 mt-3">
            <label className="block text-slate-50">Country</label>
            <input
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <div className="mb-2 w-full">
              <label className="block text-slate-50">State</label>
              <input
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className="mb-2 w-full ms-2">
              <label className="block text-slate-50">City</label>
              <input
                //   type="password"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-2 w-full">
              <label className="block text-slate-50"> Postal code</label>
              <input
                //   type="password"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder=" Postal code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 w-full ms-2 ml-2">
              <label className="block text-slate-50">Street Address</label>
              <input
                //   type="password"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder=" Street Address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2 w-full">
              <label className="block text-slate-50">Apartment</label>
              <input
                //   type="password"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Apartment"
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
              Create Shipping Address
            </button>
          </div>
        </div>
        <div className="mt-3 border-2 p-5 !border-[#65bcbb] rounded-lg">
          <h2 className="text-lg font-bold">Your shipping addresses</h2>

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
                    onChange={() => setSelectedAddress(index)}
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
        <img src="https://files.oaiusercontent.com/file-Qc9kJhU2rmRYFr3R3A8hWW?se=2025-02-12T16%3A47%3A01Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Dea5f3a76-78bc-4546-b6ab-85db3b06c781.webp&sig=ixCsgxFxaMUL7TiZQKNG1%2BAv7wDmEsy1MPfWmlaWBY0%3D" />
      </div>

      <DeleteDialog
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
