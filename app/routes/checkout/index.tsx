import CheckoutForm from "~/components/CheckoutForm";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useEffect } from "react";
import { Link } from "@remix-run/react";

export default function CheckoutPage() {
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { getCartByUser, allCarts } = cart;
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

  return (
    <div className="mt-5 p-5">
      <div className="flex justify-between gap-4">
        <div className="w-2/3">
          <CheckoutForm />
        </div>
        <div className="w-2/3 bg-gray-800 text-white p-4 rounded-md">
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
                          <strong>{cart.tag.material}</strong>
                        </p>
                      </div>
                      <div>
                        <img
                          src="https://s.alicdn.com/@sc04/kf/H623bd864f88641ab95a88756ed36cd903.jpg_720x720q50.jpg"
                          className="w-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            : "No tienes ningun carrito por ahora"}
          <Link to="/shippingAddress">Revisa tu address here</Link>
        </div>
      </div>
    </div>
  );
}
