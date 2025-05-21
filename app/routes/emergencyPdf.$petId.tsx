import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext"; // Ajusta el path correcto aquí
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../styles/dashboard.css";

export default function PetTracker() {
  const { createPetTrack, getPetTrack, deletePetTrack, editPetTrack } =
    PetTrackerContext();
  const { pet } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { petId } = useParams();
  console.log("emegrency formmmmmm", petByID);

  useEffect(() => {
    if (petId) {
      getPetById(petId);
    }
  }, []);

  if (!petByID) {
    return (
      <div className="p-5 text-center">Cargando datos de la mascota...</div>
    );
  }
  const {
    name,
    breed,
    age,
    pet_color,
    profile_photo,
    personality,
    address,
    phone_number,
    phone_number_optional,
    dad_name,
    mom_name,
    owner,
    care_profile,
    tags,
  } = petByID;

  const downloadAsPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}-lost-pet-form.pdf`);
  };
  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold text-center text-teal-500 mb-4">
        Lost Pet Emergency Poster
      </h1>
      <p className="text-center text-lg text-white max-w-xl mx-auto">
        Use this page to generate a missing pet poster. You can download it as a
        PDF or share it directly on social media to help find your furry friend
        faster.
      </p>
      <button onClick={downloadAsPDF} className=" text-teal-500 mt-3 mb-3">
        Download as PDF
      </button>
      <div id="pdf-content">
        <div className="w-full h-64 bg-red-600 flex justify-center items-center flex-col">
          <div className="">
            <h1 className="text-4xl text-center md:text-8xl font-extrabold text-white mb-2">
              MISSING PET
            </h1>
            <p className="text-lg text-center font-light text-white">
              A cry for help for our furry friend
            </p>
          </div>
        </div>
        <div className="w-full h-auto bg-white flex flex-col md:flex-row justify-center p-5">
          <div>
            <img className="h-[500px]" src={profile_photo} alt="pet-photo" />
          </div>
          <div className="text-start ms-5">
            <h1 className="text-red-600 text-8xl">{name}</h1>
            <p className="text-black text-lg">
              Bread: <strong>{breed}</strong>
            </p>
            <p className="text-black text-lg">
              {" "}
              age: <strong>{age}</strong>
            </p>
            <p className="text-black text-lg">
              {" "}
              Pet color: <strong>{pet_color}</strong>
            </p>
            <p className="text-black text-lg max-w-[300px]">
              personality: <strong>{personality}</strong>
            </p>
            <div className="bg-red-600 w-100 h-2 mt-3 mb-3"></div>
            <h1 className="text-red-600 text-6xl">Owners</h1>
            <p className="text-black text-lg">
              owner 1: <strong>{dad_name}</strong>
            </p>
            <p className="text-black text-lg">
              {" "}
              owner 2 <strong>{mom_name}</strong>
            </p>
            <p className="text-black text-lg">
              {" "}
              Phone number: <strong>{phone_number}</strong>
            </p>
          </div>
        </div>
        <div className="w-full h-64 bg-red-600 flex justify-center items-center flex-col">
          <div className="">
            <p className="text-lg font-light text-white text-center">
              Call or text with any information
            </p>
            <h1 className="text-4xl md:text-8xl font-extrabold text-white mb-2 text-center">
              <strong>{phone_number}</strong>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
