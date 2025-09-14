import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type DeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
};

export default function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName = "",
}: DeleteDialogProps) {
  const { t } = useTranslation();

  // useEffect(() => {
  //   if (isOpen) {
  //     document.getElementById("delete-modal")?.showModal();
  //   } else {
  //     document.getElementById("delete-modal")?.close();
  //   }
  // }, [isOpen]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{t("modal.title")}</h3>
        {/* Are you sure you want to delete {itemName}? */}
        <p className="py-4">{t("modal.delete_confirmation")}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            {t("modal.cancel")}
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              onConfirm();
            }}
          >
            {t("modal.confirm")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
