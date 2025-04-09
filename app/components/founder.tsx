import { Link } from "@remix-run/react";
// import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Founders() {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState("2019");

  const years = ["2019", "2022", "2024", "2025"];

  return (
    <div className="bg-white dark:bg-[#fdfdfd] py-0 px-0 h-100%">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar azul */}
        <div className="md:col-span-2 bg-cyan-600 flex flex-col-reverse md:flex-col text-white p-4 shadow md:relative pt-5">
          <div className="flex flex-row justify-center md:justify-start md:flex-col mt-0 md:mt-[100px]">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-md transition ${
                  selectedYear === year
                    ? "bg-white text-cyan-600 font-bold"
                    : ""
                }`}
              >
                - {year}
              </button>
            ))}
          </div>
          <div className=" md:absolute top-5  md:top-80 md:left-0 z-20">
            <h1
              className="text-[30px] md:text-[70px] text-center md:text-start font-bold text-white  p-5 md:whitespace-nowrap"
              style={{ fontFamily: "chapFont" }}
            >
              the Founders
            </h1>
          </div>
        </div>

        {/* Imagen */}
        <div className="order-2 md:order-1 md:col-span-5 -ms-[25px]  -mt-[25px] md:mt-0">
          <div>
            {/* Aquí pones tu imagen */}
            <img
              src="https://images.pexels.com/photos/6793974/pexels-photo-6793974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="algo"
              className="w-[40rem] h-[30rem] shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Texto */}
        <div className="order-1 md:order-2  md:col-span-5 flex flex-col p-[30px] md:p-0 md-pb-0 justify-center items-center">
          <div className="text-center pb-5 md:pb-0">
            <h2
              className="text-[40px] text-black"
              style={{ fontFamily: "chapFont" }}
            >
              {t(`founder.${selectedYear}.title`)}
            </h2>
            <p className="text-black">{t(`founder.${selectedYear}.desc`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
