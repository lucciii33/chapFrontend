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
  t: () => void;
};

export default function EditDialogShippinAddress({
  isOpen,
  onClose,
  onSave,
  initialData,
  t,
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
        <div id="modal-toast-root"></div>
        <h3 className="font-bold text-lg">{t("saved_address.edit_title")}</h3>

        <div className="mt-3">
          <label className="block">{t("saved_address.country_label")}</label>
          <input
            name="country"
            className="input input-bordered w-full"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">{t("saved_address.state_label")}</label>
          <input
            name="state"
            className="input input-bordered w-full"
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">{t("saved_address.city_label")}</label>
          <input
            name="city"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">{t("saved_address.zip_label")}</label>
          <input
            name="postal_code"
            className="input input-bordered w-full"
            value={formData.postal_code}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">{t("saved_address.street_label")}</label>
          <input
            name="street_address"
            className="input input-bordered w-full"
            value={formData.street_address}
            onChange={handleChange}
          />
        </div>

        <div className="mt-3">
          <label className="block">{t("saved_address.apartment_label")}</label>
          <input
            name="apartment"
            className="input input-bordered w-full"
            value={formData.apartment}
            onChange={handleChange}
          />
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            {t("saved_address.button_cancel")}
          </button>
          <button className="btn btn-primary" onClick={() => onSave(formData)}>
            {t("saved_address.button_save")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
