import CheckoutForm from "~/components/CheckoutForm";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import ShippingAddress from "../shippingAddress";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import "../../../styles/dashboard.css";

export default function CheckoutPage() {
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { getCartByUser, allCarts } = cart;
  const [openShippingAddress, setOpenShippingAddress] = useState(false);
  const [highlightAddressSection, setHighlightAddressSection] = useState(false);
  const [amountInCents, setAmountInCents] = useState(0);
  const [refreshAddresses, setRefreshAddresses] = useState(false);
  const [ivaInCents, setIvaInCents] = useState(0);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  console.log("shippingAddresses", shippingAddresses);
  console.log("user", user);
  console.log("allCarts", allCarts);
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
      iva = amountInCents * 0.21; // 21% IVA
    }

    setIvaInCents(Math.round(iva));
  }, [amountInCents, shippingAddresses]);

  return (
    <div className="mt-5 p-5">
      <div className="flex justify-between gap-4 flex-col md:flex-row">
        <div className="w-full md:w-2/3 bg-gray-800 text-white p-4 rounded-md">
          <h2 className="mb-2 text-4xl">Sumarry</h2>
          {allCarts
            ? allCarts.map((cart) => {
                return (
                  <div key={cart.id}>
                    <div className="border-b border-gray-500 flex justify-between items-center mb-2 pb-2">
                      <div>
                        <p>
                          Pet Name: <strong>{cart.pet.name}</strong>
                        </p>
                        <p>
                          Price: <strong>{cart.price}</strong>
                        </p>
                        <p>
                          Quatity: <strong>{cart.quantity}</strong>
                        </p>
                        <p>
                          Tag: <strong>{cart.tag.color} - </strong>
                          <strong>{cart.tag.material} - </strong>
                          <strong>{cart.tag.shape}</strong>
                        </p>
                      </div>
                      <div>
                        <img
                          src="https://s.alicdn.com/@sc04/kf/H623bd864f88641ab95a88756ed36cd903.jpg_720x720q50.jpg"
                          className="w-[100px]"
                          alt="s"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            : "No tienes ningun carrito por ahora"}
          <p className="text-xl pb-4 mt-4 border-b border-gray-700">
            Total a pagar: ${(amountInCents / 100).toFixed(2)} USD
          </p>
          <p className="text-xl pb-4 mt-4 border-b border-gray-700">
            Iva a pagar: ${(ivaInCents / 100).toFixed(2)} USD
          </p>
          <p className="text-2xl pb-4 mt-4 border-b border-gray-700">
            Total con IVA: ${((amountInCents + ivaInCents) / 100).toFixed(2)}{" "}
            USD
          </p>
          <h2 className="mb-2 text-2xl mt-2">Shipping Address</h2>
          <div
            className={`mt-2 border-2 ${
              highlightAddressSection ? "border-red-500" : "border-gray-700"
            } bg-gray-700 rounded-lg p-3 transition-all duration-300`}
          >
            <div className="flex justify-between ">
              <h1 className="text-bold">Create/edit</h1>
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
