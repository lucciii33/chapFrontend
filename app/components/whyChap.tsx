import { Link } from "@remix-run/react";
// import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

const features = [
  "whyChap.featureOne",
  "whyChap.featureTwo",
  "whyChap.featureTree",
  "whyChap.featureFour",
  "whyChap.featureFive",
  "whyChap.featureSix",
  "whyChap.featureSeven",
];

export default function WhyChap() {
  const { t } = useTranslation();
  return (
    <section
      className="bg-white dark:bg-gray-900 py-16 px-6 md:px-12"
      id="why-chap"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          <span className="text-teal-500"> {t("whyChap.title")}</span>
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          {t("whyChap.subTitle")}
        </p>

        <div className="flex justify-center">
          <ul className="text-left space-y-6">
            {features.map((item, i) => (
              <li key={i} className="flex items-start gap-3 max-w-full">
                <CheckCircleIcon className="w-6 h-6 text-teal-500 flex-shrink-0 mt-1" />
                <p className="text-gray-800 dark:text-white text-base leading-snug break-words">
                  {t(item)}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-5">
          <Link to="register">
            <button className=" border-none py-3 px-4 mt-5 bg-cyan-950 text-white rounded-lg">
              {t("register")}
            </button>
          </Link>
        </div>

        {/* Optional */}
        <p className="mt-9 text-sm text-gray-400 italic">
          {t("whyChap.smalText")}
        </p>
      </div>
    </section>
  );
}
