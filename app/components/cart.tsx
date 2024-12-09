// import { Link } from "@remix-run/react"; // Importa Link de Remix
// import { useState } from "react";
import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalProvider";

// type CardProps = {
//   petObj: {
//     id: number;
//     name: string;
//     age: number;
//     personality: string;
//     address: string;
//     phone_number: number;
//     phone_number_optional: number | null;
//     profile_photo: string;
//     pet_color: string;
//     breed: string;
//     lost: boolean;
//     vet_address: string;
//     neighbourhood: string;
//     mom_name: string;
//     dad_name: string;
//     chip_number: number;
//     user_id: number;
//   };
// };
// { petObj }: CardProps
export default function Cart() {
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
    <div className="ms-2">
      <div>
        {allCarts.map((item, index) => {
          return (
            <div key={index} className="border mt-2">
              <p>{item.pet.name}</p>
              <p>{item.tag.color}</p>
              <p>{item.tag.shape}</p>
              <p>{item.tag.material}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
