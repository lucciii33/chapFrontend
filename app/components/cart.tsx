import { Link } from "@remix-run/react";
// import { useState } from "react";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import DeleteDialog from "./deleteDialog";
import { MinusIcon } from "@heroicons/react/24/outline";
import TagImagePreview from "./TagImagePreview";

export default function Cart() {
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const {
    getCartByUser,
    allCarts,
    deleteCartById,
    editCartById,
    actSideBar,
    closeSideBar,
  } = cart;
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
      price: price,
      subtotal: newQuantity * price,
      is_checked_out: isCheckedOut,
    };

    await editCartById(cartId, updatedCart);
    getCartByUser(user.id);
  };

  const handleDecrement = async (
    cartId,
    currentQuantity,
    tagId,
    price,
    isCheckedOut
  ) => {
    if (currentQuantity <= 1) return;

    const newQuantity = currentQuantity - 1;
    const updatedCart = {
      quantity: newQuantity,
      tag_id: tagId,
      price: price,
      subtotal: newQuantity * price,
      is_checked_out: isCheckedOut,
    };

    await editCartById(cartId, updatedCart);
    getCartByUser(user.id);
  };

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cartItemToDelete, setCartItemToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (cartItemToDelete !== null) {
      await deleteCartById(cartItemToDelete);
      await getCartByUser(user.id);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="ms-2">
      <div>
        <div
          className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
          onClick={() => closeSideBar()}
        >
          <div>X</div>
        </div>
        {allCarts.map((item, index) => {
          return (
            <div key={index} className="border  rounded mt-2  p-3">
              <div>
                <div>
                  <TagImagePreview
                    shape={item.tag.shape}
                    color={item.tag.color}
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
              <div className="mt-3 flex">
                <button
                  className="border-none w-full flex justify-center items-center py-3 px-4 me-3 bg-teal-500 text-white rounded-lg"
                  onClick={() =>
                    handleDecrement(
                      item.id,
                      item.quantity,
                      item.tag.id,
                      item.price,
                      item.is_checked_out
                    )
                  }
                >
                  <MinusIcon className="h-6 w-6 text-white" />
                </button>

                <button className="border-none w-full flex justify-center items-center py-3 px-4 bg-teal-500 text-white rounded-lg">
                  <TrashIcon
                    className="h-6 w-6 text-white"
                    // onClick={async () => {
                    //   await deleteCartById(item.id);
                    //   getCartByUser(user.id);
                    // }}
                    onClick={() => {
                      setCartItemToDelete(item.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  />
                </button>
                <button
                  className="border-none  w-full flex justify-center items-center py-3 px-4 ms-3 bg-teal-500 text-white rounded-lg"
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
                  <PlusIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <Link to="/checkout" onClick={() => closeSideBar()}>
        <button className="w-full border-none py-3 px-4 mt-5 bg-teal-500 text-white rounded-lg">
          Pay now
        </button>
      </Link>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName="this cart item"
      />
    </div>
  );
}
