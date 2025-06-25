/* eslint-disable jsx-a11y/label-has-associated-control */

import "../../../styles/dashboard.css";
import { useTranslation } from "react-i18next";

export default function TermsAndConditions() {
  const { t } = useTranslation();

  return (
    <div className=" text-white">
      <div className="p-[50px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("terms.title")}
        </h1>

        <p className="text-white mb-6">{t("terms.intro")}</p>

        {/* Sección 1 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section1Title")}
          </h2>
          <p className="text-white">{t("terms.section1Text")}</p>
        </section>

        {/* Sección 2 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section2Title")}
          </h2>
          <p className="text-white mb-2">{t("terms.section2Text")}</p>
          <ul className="list-disc list-inside text-white">
            <li>{t("terms.section2Details.spain")}</li>
            <li>{t("terms.section2Details.usa")}</li>
            <li>{t("terms.section2Details.shipping")}</li>
          </ul>
        </section>

        {/* Sección 3 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section3Title")}
          </h2>
          <p className="text-white">{t("terms.section3Text")}</p>
        </section>

        {/* Sección 4 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section4Title")}
          </h2>
          <p className="text-white">{t("terms.section4Text")}</p>
        </section>

        {/* Sección 5 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section5Title")}
          </h2>
          <p className="text-white">{t("terms.section5Text")}</p>
        </section>

        {/* Sección 6 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section6Title")}
          </h2>
          <p className="text-white">{t("terms.section6Text")}</p>
        </section>

        {/* Sección 7 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section7Title")}
          </h2>
          <p className="text-white">{t("terms.section7Text")}</p>
        </section>

        {/* Sección 8 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("terms.section8Title")}
          </h2>
          <p className="text-white">{t("terms.section8Text")}</p>
        </section>

        <p className="text-sm text-center text-gray-500 mt-10">
          Última actualización: 25 de junio de 2025
        </p>
      </div>
    </div>
  );
}
