import { Link } from "@remix-run/react"; // Importa Link de Remix

type CardProps = {
  pet: {
    id: number;
    name: string;
    age: number;
    personality: string;
    address: string;
    phone_number: number;
    phone_number_optional: number | null;
    profile_photo: string;
    pet_color: string;
    breed: string;
    lost: boolean;
    vet_address: string;
    neighbourhood: string;
    mom_name: string;
    dad_name: string;
    chip_number: number;
    user_id: number;
  };
};
export default function Card({ pet }: CardProps) {
  return (
    <div className="ms-2">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{pet.name}</h2>
          <p>{pet.personality}</p>
          <div className="card-actions justify-end">
            <Link to={`/pets/${pet.id}`}>
              <button className="btn btn-primary">Buy Now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
