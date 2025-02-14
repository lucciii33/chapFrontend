import { useEffect, useState } from "react";

type EditDialogShippinAddressProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
  initialData: {
    country: string;
    state: string;
    city: string;
    postal_code: string;
    street_address: string;
    apartment: string;
  };
};

export default function EditDialogShippinAddress({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditDialogShippinAddressProps) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <dialog id="edit-modal" className="modal" open={isOpen}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Shipping Address</h3>

        <div className="mt-3">
          <label className="block">Country</label>
          <input
            name="country"
            className="input input-bordered w-full"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">State</label>
          <input
            name="state"
            className="input input-bordered w-full"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">City</label>
          <input
            name="city"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">Postal Code</label>
          <input
            name="postal_code"
            className="input input-bordered w-full"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">Street Address</label>
          <input
            name="street_address"
            className="input input-bordered w-full"
            value={formData.street_address}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">Apartment</label>
          <input
            name="apartment"
            className="input input-bordered w-full"
            value={formData.apartment}
            onChange={handleChange}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>
            Save Changes
          </button>
        </div>
      </div>
    </dialog>
  );
}
