import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useGlobalContext } from "../context/GlobalProvider";
import { ShippingAddressContext } from "../context/ShippingAddressContext";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import DogLoader from "./petLoader";

// Función auxiliar para llamar al backend

const CheckoutForm: React.FC<{
  openShippingModal: () => void;
  setHighlightAddressSection: (value: boolean) => void;
  setAmountInCents: (value: number) => void;
  refreshAddresses: boolean;
  setShippingAddresses: (value: any[]) => void; // ⚡
}> = ({
  openShippingModal,
  setHighlightAddressSection,
  setAmountInCents,
  refreshAddresses,
  setShippingAddresses,
}) => {
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { allCarts } = cart;
  console.log("allCarts", allCarts);

  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { getShippingAddresses } = ShippingAddressContext();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const couponDiscounts: Record<string, number> = {
    FRIENDS10: 10,
    CHAP20: 20,
    LUCKY30: 30,
    ROXY40: 40,
    TAG50: 50,
    FAMILY100: 99,
  };

  useEffect(() => {
    const totalPrice = allCarts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const discountedPrice = totalPrice - (totalPrice * discount) / 100;
    const calculatedAmount = Math.round(discountedPrice * 100);

    setAmountInCents(calculatedAmount);
  }, [allCarts, discount]);

  // 2. Función para manejar el cambio del input
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase(); // Por si lo escriben en minúscula
    setCouponCode(value);

    // Si coincide con el código "TAG20", aplicamos 20% descuento
    const discountValue = couponDiscounts[value] || 0;
    setDiscount(discountValue);
  };

  const [addresses, setAddresses] = useState([]);

  console.log("addresses", addresses);
  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      try {
        const response = await getShippingAddresses(user.id);
        const data = await response.json();
        console.log("addresses", data);
        if (data) {
          setAddresses(data); // Local: todas
          const selectedAddress = data.find((addr) => addr.is_selected);
          if (selectedAddress) {
            setShippingAddresses(selectedAddress); // SOLO la seleccionada
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [user, refreshAddresses]); // S

  const createPaymentIntent = async (
    userId: number,
    amount: number,
    petIds: number[],
    tagIds: number[],
    gpsIds: number[]
  ) => {
    const response = await fetch(`${baseUrl}/stripe/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        amount,
        pet_ids: petIds,
        tag_ids: tagIds,
        gps_ids: gpsIds,
      }),
    });
    const data = await response.json();
    return data.client_secret;
  };

  const createOrder = async () => {
    const selectedAddress = addresses.find((addr) => addr.is_selected);
    if (!selectedAddress) {
      console.error("No se ha seleccionado ninguna dirección");
      return;
    }

    const calculateTotalPrice = (baseTotal, country) => {
      const countryCode = country?.toLowerCase() || "";

      const ivaCountries = ["es", "pt", "it", "fr", "de", "nl", "be", "ie"];
      const ivaRate = 0.21;
      const shippingCost = 10; // en euros

      if (["us", "usa"].includes(countryCode)) {
        return baseTotal + shippingCost;
      }

      if (ivaCountries.includes(countryCode)) {
        return baseTotal + baseTotal * ivaRate;
      }

      return baseTotal;
    };

    // 👉 suma de todos los precios
    const baseTotal = allCarts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // 👉 aplica IVA o envío
    const totalPrice = calculateTotalPrice(baseTotal, selectedAddress?.country);

    // const totalPrice = allCarts.reduce((acc, item) => acc + item.subtotal, 0);

    const orderData = {
      user_id: user.id,
      full_name: user.full_name,
      order_data: allCarts,
      shipping_address: selectedAddress,
      total_price: totalPrice,
    };

    try {
      const response = await fetch(`${baseUrl}/api/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Error al crear la orden");
      }

      const data = await response.json();
      console.log("Orden creada:", data);
    } catch (error) {
      console.error("Error al crear la orden:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isProcessing) return;

    const selectedAddress = addresses.find((addr) => addr.is_selected);
    if (!selectedAddress) {
      showErrorToast(t("checkout.no_address"));
      openShippingModal();
      setHighlightAddressSection(true);
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe no está cargado correctamente");
      return;
    }

    if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
      showErrorToast(t("checkout.incomplete_card"));
      return;
    }

    setIsProcessing(true);

    try {
      const petIds = Array.from(new Set(allCarts.map((item) => item.pet_id)));
      const tagIds = Array.from(
        new Set(
          allCarts.filter((item) => item.tag_id).map((item) => item.tag_id)
        )
      );
      const gpsIds = Array.from(
        new Set(
          allCarts.filter((item) => item.gps_id).map((item) => item.gps_id)
        )
      );

      console.log("petIdspetIds from the front end", petIds);
      const totalPrice = allCarts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const discountedPrice = totalPrice - (totalPrice * discount) / 100;
      const amountInCents = Math.round(discountedPrice * 100);
      const clientSecret = await createPaymentIntent(
        user.id,
        amountInCents,
        petIds,
        tagIds,
        gpsIds
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
          },
        }
      );

      if (error) {
        console.error("Error en el pago:", error.message);
      } else if (paymentIntent?.status === "succeeded") {
        showSuccessToast(t("checkout.success"));
        await createOrder();
        navigate("/ThanksForShopping");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setIsProcessing(false); // ✅ Lo desbloqueamos
    }
  };

  return (
    <div>
      <h2 className="p-2">{t("payment_info.title")}</h2>
      <form onSubmit={handleSubmit} style={{}}>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            width: "100%",
          }}
        >
          {/* <CardElement options={{ style: { base: { fontSize: "16px" } } }} /> */}
          <div className="space-y-4">
            <div
              className={`border p-2 rounded ${
                !cardNumberComplete ? "border-red-500" : "border-gray-300"
              }`}
            >
              {/* {t("subNavbar.extraFeatures.buttonFinances")} */}
              <label className="block text-sm mb-1">
                {t("payment_info.card_number_label")}
              </label>
              <CardNumberElement
                options={{
                  style: { base: { fontSize: "16px" } },
                  showIcon: true,
                }}
                onChange={(e) => setCardNumberComplete(e.complete)}
              />
            </div>

            <div
              className={`border p-2 rounded ${
                !cardExpiryComplete ? "border-red-500" : "border-gray-300"
              }`}
            >
              <label className="block text-sm mb-1">
                {t("payment_info.expiration_label")}
              </label>
              <CardExpiryElement
                options={{ style: { base: { fontSize: "16px" } } }}
                onChange={(e) => setCardExpiryComplete(e.complete)}
              />
            </div>

            <div
              className={`border p-2 rounded ${
                !cardCvcComplete ? "border-red-500" : "border-gray-300"
              }`}
            >
              <label className="block text-sm mb-1">
                {t("payment_info.cvv_label")}
              </label>
              <CardCvcElement
                options={{ style: { base: { fontSize: "16px" } } }}
                onChange={(e) => setCardCvcComplete(e.complete)}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm mb-1">
                {t("payment_info.discount_label")}
              </label>
              <input
                type="text"
                value={couponCode}
                onChange={handleCouponChange}
                placeholder={t("payment_info.discount_placeholder")}
                className="border p-2 w-full rounded"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            style={{ marginTop: 20 }}
            className="btn  bg-teal-500 w-full"
          >
            {isProcessing ? <DogLoader /> : t("payment_info.button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
