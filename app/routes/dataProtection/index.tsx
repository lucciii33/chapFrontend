import "../../../styles/dashboard.css";
import { useTranslation } from "react-i18next";
export default function DataProtection() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row">
      <div className="text-white p-[50px]">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("privacy.title")}
        </h1>
        <p className="text-white mb-6">{t("privacy.intro")}</p>

        {/* Sección 1 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section1Title")}
          </h2>
          <ul className="list-disc list-inside text-white space-y-1">
            <li>{t("privacy.section1List.personal")}</li>
            <li>{t("privacy.section1List.pet")}</li>
            <li>{t("privacy.section1List.usage")}</li>
            <li>{t("privacy.section1List.ip")}</li>
          </ul>
        </section>

        {/* Sección 2 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section2Title")}
          </h2>
          <ul className="list-disc list-inside text-white space-y-1">
            <li>{t("privacy.section2List.order")}</li>
            <li>{t("privacy.section2List.personalize")}</li>
            <li>{t("privacy.section2List.news")}</li>
          </ul>
        </section>

        {/* Sección 3 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section3Title")}
          </h2>
          <p className="text-white">{t("privacy.section3Text")}</p>
        </section>

        {/* Sección 4 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section4Title")}
          </h2>
          <p className="text-white">{t("privacy.section4Text")}</p>
        </section>

        {/* Sección 5 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section5Title")}
          </h2>
          <p className="text-white">{t("privacy.section5Text")}</p>
        </section>

        {/* Sección 6 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section6Title")}
          </h2>
          <p className="text-white">{t("privacy.section6Text")}</p>
        </section>

        {/* Sección 7 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section7Title")}
          </h2>
          <p className="text-white">{t("privacy.section7Text")}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {t("privacy.section8Title")}
          </h2>
          <p className="text-white">{t("privacy.section8Text")}</p>
        </section>

        <p className="text-sm text-center text-gray-500 mt-10">
          Última actualización: 19 de septiembre de 2025
        </p>
      </div>
    </div>
  );
}
