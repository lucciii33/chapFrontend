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

const CheckoutForm: React.FC<{
  openShippingModal: () => void;
  setHighlightAddressSection: (value: boolean) => void;
  setAmountInCents: (value: number) => void;
  refreshAddresses: boolean;
  setShippingAddresses: (value: any[]) => void;
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

  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  const { getShippingAddresses } = ShippingAddressContext();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const couponDiscounts: Record<string, number> = {
    FRIENDS10: 10,
    CHAP20: 20,
    LUCKY30: 30,
    ROXY40: 40,
    TAG50: 50,
    FAMILY95: 95,
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

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().toUpperCase();
    setCouponCode(value);

    const discountValue = couponDiscounts[value] || 0;
    setDiscount(discountValue);
  };

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAddresses = async () => {
      try {
        const response = await getShippingAddresses(user.id);
        const data = await response.json();
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

    const baseTotal = allCarts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const totalPrice = calculateTotalPrice(baseTotal, selectedAddress?.country);

    const orderData = {
      user_id: user.id,
      full_name: user.full_name,
      order_data: allCarts,
      shipping_address: selectedAddress,
      total_price: totalPrice,
      coupon_code: couponCode,
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

  const handleManualPayment = async () => {
    const selectedAddress = addresses.find((addr) => addr.is_selected);
    if (!selectedAddress) {
      showErrorToast("Selecciona una dirección de envío antes de continuar.");
      openShippingModal();
      setHighlightAddressSection(true);
      return;
    }

    if (!referenceNumber.trim()) {
      showErrorToast("Debes ingresar el número de referencia del pago.");
      return;
    }

    const orderData = {
      user_id: user.id,
      full_name: user.full_name,
      order_data: allCarts,
      shipping_address: selectedAddress,
      total_price: allCarts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      coupon_code: couponCode,
      reference_number: referenceNumber,
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

      if (!response.ok) throw new Error("Error al crear la orden manual");

      showSuccessToast("Pago manual registrado correctamente");
      navigate("/ThanksForShopping");
    } catch (error) {
      console.error("Error al crear la orden manual:", error);
      showErrorToast("No se pudo registrar el pago manual");
    }
  };

  return (
    <div>
      <h2 className="p-2">{t("payment_info.title")}</h2>
      {user?.country !== "venezuela" ? (
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
      ) : (
        <div className="p-4 border rounded bg-neutral-900 text-slate-50 text-center">
          <h3 className="text-xl mb-4">Pago Móvil 🇻🇪</h3>
          <p className="text-sm mb-4">
            Ingresa tu número de referencia del pago móvil. Si tienes un cupón,
            úsalo primero para aplicar el descuento antes de confirmar.
          </p>

          <div className="space-y-3">
            {/* ✅ input del cupón (ya conectado al descuento del carrito) */}
            <div>
              <label className="block text-sm mb-1">Cupón de descuento</label>
              <input
                type="text"
                value={couponCode}
                onChange={handleCouponChange}
                placeholder=""
                className="border p-2 w-full rounded text-black"
              />
            </div>

            {/* ✅ input del número de referencia */}
            <div>
              <label className="block text-sm mb-1">Número de referencia</label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder=""
                className="border p-2 w-full rounded text-black"
              />
            </div>

            <button
              className="btn bg-teal-500 w-full mt-4"
              onClick={handleManualPayment}
            >
              Confirmar pago manual
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
