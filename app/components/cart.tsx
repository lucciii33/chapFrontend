import { Link } from "@remix-run/react";
// import { useState } from "react";
import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function Cart() {
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { getCartByUser, allCarts, deleteCartById, editCartById, actSideBar } =
    cart;
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

  const handleIncrement = async (
    cartId,
    currentQuantity,
    tagId,
    price,
    isCheckedOut
  ) => {
    const newQuantity = currentQuantity + 1;
    const updatedCart = {
      quantity: newQuantity,
      tag_id: tagId,
      price: price, // Mantén el precio original
      subtotal: newQuantity * price, // Calcula el subtotal
      is_checked_out: isCheckedOut, // Mantén el estado actual
    };

    await editCartById(cartId, updatedCart);
    getCartByUser(user.id); // Envía todos los campos necesarios
  };

  return (
    <div className="ms-2">
      <div>
        {allCarts.map((item, index) => {
          return (
            <div key={index} className="border  rounded mt-2  p-3">
              <div>
                <div>
                  <img
                    className=""
                    src="https://s.alicdn.com/@sc04/kf/H623bd864f88641ab95a88756ed36cd903.jpg_720x720q50.jpg"
                    alt="dd"
                  />
                </div>
                <p className="mt-4">
                  Pet for: <strong>{item.pet.name}</strong>
                </p>
                <p>
                  Color: <strong>{item.tag.color}</strong>
                </p>
                <p>
                  Shape: <strong>{item.tag.shape}</strong>
                </p>
                <p>
                  Material: <strong>{item.tag.material}</strong>
                </p>
                <p>
                  Quantity: <strong>{item.quantity}</strong>
                </p>
              </div>
              <div className="mt-3">
                <button className="border-none py-3 px-4 bg-cyan-500 text-white rounded-lg">
                  <TrashIcon
                    className="h-6 w-6 text-gray-500"
                    onClick={async () => {
                      await deleteCartById(item.id);
                      getCartByUser(user.id);
                    }}
                  />
                </button>
                <button
                  className="border-none py-3 px-4 ms-3 bg-cyan-500 text-white rounded-lg"
                  onClick={() =>
                    handleIncrement(
                      item.id,
                      item.quantity,
                      item.tag.id,
                      item.price,
                      item.is_checked_out
                    )
                  }
                >
                  <PlusIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/checkout">
        <button className="border-2 mt-5 w-full border-cyan-500 rounded-full px-6 py-2 bg-transparent">
          Pay now
        </button>
      </Link>
    </div>
  );
}
