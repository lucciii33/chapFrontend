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
            <div key={index} className="border mt-2">
              <p>{item.pet.name}</p>
              <p>{item.tag.color}</p>
              <p>{item.tag.shape}</p>
              <p>{item.tag.material}</p>
              <p>{item.quantity}</p>
              <button>
                <TrashIcon
                  className="h-6 w-6 text-gray-500"
                  onClick={async () => {
                    await deleteCartById(item.id);
                    getCartByUser(user.id);
                  }}
                />
              </button>
              <button
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
          );
        })}
      </div>
      <Link to="/checkout">
        <button>Pay now</button>
      </Link>
    </div>
  );
}
