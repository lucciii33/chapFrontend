import { useEffect } from "react";

type DeleteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
};

export default function DeleteDialogAdmin({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
}: DeleteDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.getElementById("delete-modal-admin")?.showModal();
    } else {
      document.getElementById("delete-modal-admin")?.close();
    }
  }, [isOpen]);

  return (
    <dialog id="delete-modal-admin" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm Deletion</h3>
        <p className="py-4">Are you sure you want to delete {itemName}?</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={() => {
              onConfirm();
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </dialog>
  );
}
