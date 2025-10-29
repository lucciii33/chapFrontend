import CheckoutForm from "~/components/CheckoutForm";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import ShippingAddress from "../shippingAddress";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import "../../../styles/dashboard.css";
import TagImagePreview from "~/components/TagImagePreview";
import { useTranslation } from "react-i18next";

export default function CheckoutPage() {
  const { auth, cart } = useGlobalContext();
  const { t } = useTranslation();

  const { user } = auth;

  const { getCartByUser, allCarts } = cart;
  const [openShippingAddress, setOpenShippingAddress] = useState(false);
  const [highlightAddressSection, setHighlightAddressSection] = useState(false);
  const [amountInCents, setAmountInCents] = useState(0);
  const [refreshAddresses, setRefreshAddresses] = useState(false);
  const [ivaInCents, setIvaInCents] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const getCartByUserFunc = () => {
    if (user) {
      getCartByUser(user.id);
    }
  };
  useEffect(() => {
    getCartByUserFunc();
  }, [user]);

  const openShippingAddressFunc = () => {
    setOpenShippingAddress(!openShippingAddress);
  };

  useEffect(() => {
    if (highlightAddressSection) {
      const timer = setTimeout(() => setHighlightAddressSection(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightAddressSection]);

  useEffect(() => {
    const EU_COUNTRIES = ["ES", "PT", "IT", "FR", "DE", "NL", "BE", "IE", "UK"];

    let iva = 0;

    if (shippingAddresses && EU_COUNTRIES.includes(shippingAddresses.country)) {
      iva = amountInCents * 0.21;
    }

    setIvaInCents(Math.round(iva));

    if (shippingAddresses && shippingAddresses.country === "USA") {
      setShippingCost(1000);
    } else {
      setShippingCost(0);
    }
  }, [amountInCents, shippingAddresses]);

  return (
    <div className="mt-5 p-5">
      <div className="flex justify-between gap-4 flex-col md:flex-row">
        <div className="w-full md:w-2/3 bg-gray-800 text-white p-4 rounded-md">
          <h2 className="mb-2 text-4xl">
            {" "}
            {t("checkout_page.title_checkout")}
          </h2>
          {allCarts
            ? allCarts.map((cart) => {
                return (
                  <div key={cart.id}>
                    {cart?.tag && (
                      <div className="border-b border-gray-500 flex justify-between items-center mb-2 pb-2">
                        <div>
                          <p>
                            {t("checkout_page.pet_name")}:{" "}
                            <strong>{cart.pet.name}</strong>
                          </p>
                          <p>
                            {t("checkout_page.price")}:{" "}
                            <strong>{cart.price}</strong>
                          </p>
                          <p>
                            {t("checkout_page.quantity")}:{" "}
                            <strong>{cart.quantity}</strong>
                          </p>
                          <p>
                            {t("checkout_page.tag_details")}:{" "}
                            <strong>{cart.tag.color} - </strong>
                            <strong>{cart.tag.material} - </strong>
                            <strong>{cart.tag.shape}</strong>
                          </p>
                        </div>
                        <div>
                          <TagImagePreview
                            shape={cart.tag.shape}
                            color={cart.tag.color}
                            width={100}
                            height={100}
                          />
                        </div>
                      </div>
                    )}
                    {cart?.gps && (
                      <div className="border-b border-gray-500 flex justify-between items-center mb-2 pb-2">
                        <div>
                          <p>
                            {t("checkout_page.pet_name")}:{" "}
                            <strong>{cart.pet.name}</strong>
                          </p>
                          <p>
                            {t("checkout_page.price")}:{" "}
                            <strong>{cart.price}</strong>
                          </p>
                          <p>
                            {t("checkout_page.quantity")}:{" "}
                            <strong>{cart.quantity}</strong>
                          </p>
                          <p>
                            {t("checkout_page.gps_details")}:{" "}
                            <strong>{cart.gps.device_type}</strong> -{" "}
                            <strong>{cart.gps.color}</strong>
                          </p>
                        </div>
                        <div>
                          <img
                            src={
                              cart.gps.device_type === "android"
                                ? "/android.jpg"
                                : "/iphone.png"
                            }
                            alt={cart.gps.device_type}
                            className="w-[100px] h-[100px] object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            : "No tienes ningun carrito por ahora"}
          <p className="text-xl pb-4 mt-4 border-b border-gray-700">
            {t("checkout_page.total_price")}: $
            {(amountInCents / 100).toFixed(2)} USD
          </p>
          {ivaInCents > 0 && (
            <p className="text-xl pb-4 mt-4 border-b border-gray-700">
              {t("checkout_page.tax_price")}: ${(ivaInCents / 100).toFixed(2)}{" "}
              USD
            </p>
          )}

          {shippingCost > 0 && (
            <p className="text-xl pb-4 mt-4 border-b border-gray-700">
              {t("checkout_page.shipping_price")}: $
              {(shippingCost / 100).toFixed(2)} USD
            </p>
          )}
          {/* <p className="text-xl pb-4 mt-4 border-b border-gray-700">
            {t("checkout_page.tax_price")}: ${(ivaInCents / 100).toFixed(2)} USD
          </p> */}

          {/* <p className="text-2xl pb-4 mt-4 border-b border-gray-700">
            {t("checkout_page.total_with_tax")}: $
            {((amountInCents + ivaInCents) / 100).toFixed(2)}{" "}
          </p> */}
          {ivaInCents > 0 && (
            <p className="text-xl pb-4 mt-4 border-b border-gray-700">
              {t("checkout_page.total_with_tax")}: $
              {((amountInCents + ivaInCents) / 100).toFixed(2)} USD
            </p>
          )}
          {shippingCost > 0 && (
            <p className="text-xl pb-4 mt-4 border-b border-gray-700">
              {t("checkout_page.total_with_shipping")}: $
              {((amountInCents + shippingCost) / 100).toFixed(2)} USD
            </p>
          )}
          <h2 className="mb-2 text-2xl mt-2">{t("shipping_address.title")}</h2>
          <div
            className={`mt-2 border-2 ${
              highlightAddressSection ? "border-red-500" : "border-gray-700"
            } bg-gray-700 rounded-lg p-3 transition-all duration-300`}
          >
            <div className="flex justify-between ">
              <h1 className="text-bold">{t("shipping_address.subtitle")}</h1>
              {openShippingAddress ? (
                <ChevronUpIcon
                  className="h-6 w-6 text-teal-500"
                  onClick={openShippingAddressFunc}
                />
              ) : (
                <ChevronDownIcon
                  className="h-6 w-6 text-teal-500"
                  onClick={openShippingAddressFunc}
                />
              )}
            </div>
            {openShippingAddress ? (
              <ShippingAddress setRefreshAddresses={setRefreshAddresses} />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <CheckoutForm
            openShippingModal={() => setOpenShippingAddress(true)}
            setHighlightAddressSection={setHighlightAddressSection}
            setAmountInCents={setAmountInCents}
            refreshAddresses={refreshAddresses}
            setShippingAddresses={setShippingAddresses} // ⚡ CLARO
          />
        </div>
      </div>
    </div>
  );
}
