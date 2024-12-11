import { useState } from "react";
import tagImg from "../images/tag.png";

type PopupProps = {
  petId: number | null;
  onClose: () => void;
};

function Popup({ petId, onClose }: PopupProps) {
  const [tagInfoData, setTagInfoData] = useState({
    shape: "circular",
    name: true,
    continue_later: false,
    material: "metal",
    color: "blue",
  });

  const handleTagChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setTagInfoData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateTag = async () => {
    if (petId !== null) {
      console.log(`Creating tag for pet ID ${petId}`, tagInfoData);
      onClose(); // Close the popup
    } else {
      alert("No pet selected");
    }
  };

  return (
    <dialog open className="modal">
      <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
        <h3 className="font-bold text-lg">Create your tag here</h3>
        <div className="flex mt-3">
          <div className="w-1/2 border-r border-gray-500">
            <div className="me-5">
              <label>Material</label>
              <select
                name="material"
                value={tagInfoData.material}
                onChange={handleTagChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="metal">Metal</option>
                <option value="plastic">Plastic</option>
                <option value="leather">Leather</option>
              </select>
            </div>

            <div className="me-5">
              <label>Shape</label>
              <select
                name="shape"
                value={tagInfoData.shape}
                onChange={handleTagChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="circular">Circular</option>
                <option value="square">Square</option>
                <option value="heart">Heart</option>
              </select>
            </div>

            <div className="me-5">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={tagInfoData.color}
                onChange={handleTagChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Color"
              />
            </div>

            <div className="flex items-center mt-2">
              <label>Name</label>
              <input
                type="checkbox"
                name="name"
                checked={tagInfoData.name}
                onChange={handleTagChange}
                className="ms-2"
              />
            </div>

            <button
              className="btn bg-teal-500 w-full mt-2"
              onClick={handleCreateTag}
            >
              Create Tag
            </button>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <img src={tagImg} alt="Tag Preview" className="w-[250px]" />
          </div>
        </div>
        <button onClick={onClose} className="btn btn-outline mt-4">
          Close
        </button>
      </div>
    </dialog>
  );
}

export default Popup;
