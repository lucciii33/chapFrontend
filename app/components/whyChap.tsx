import { Link } from "@remix-run/react";
// import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const features = [
  "Unlimited Access",
  "Export to PDF",
  "Email Support",
  "Mobile Friendly",
];

export default function WhyChap() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          ¿Por qué <span className="text-teal-500">Chap</span>?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Una tag inteligente para perros, simple, rápida y sin complicaciones.
        </p>

        <div className="flex justify-center">
          <ul className="text-left space-y-6">
            {features.map((item, i) => (
              <li key={i} className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-teal-500 mt-1" />
                <span className="text-gray-800 dark:text-white text-lg">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional */}
        <p className="mt-12 text-sm text-gray-400 italic">
          Todo lo que tu perro necesita, en un solo lugar.
        </p>
      </div>
    </section>
  );
}
