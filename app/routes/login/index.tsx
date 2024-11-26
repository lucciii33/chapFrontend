import loginImage from "../../images/imageLogin4.png";

export default function Login() {
  return (
    <div className="flex ">
      {/* Imagen a la izquierda */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Login"
          className="min-w-full h-screen object-cover"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-1/2 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-lg px-4 ">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 text-slate-50">Login</h1>
          </div>

          {/* Aquí puedes agregar tus campos de formulario */}
          <div className="mb-4">
            <label className="block text-slate-50">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Email</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Edad</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">Edad</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
            />
          </div>
          <div className="w-full">
            <button className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
