/* eslint-disable jsx-a11y/label-has-associated-control */
// import { useState } from "react";
// import { Link } from "@remix-run/react";
// import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
// import loginImage from "../../images/imageLogin4.png";
// import { useGlobalContext } from "../../context/GlobalProvider";
// import { useEffect, useState } from "react";
// import Card from "~/components/card";
// import tagImg from "../../images/tag.png";
// import "../../../styles/dashboard.css";
import DeleteDialog from "~/components/deleteDialog";
import { useGlobalContext } from "../../context/GlobalProvider";

import { useState, useEffect } from "react";
import DeleteDialogAdmin from "~/components/deleteDialogAdmin";

export default function AdminDashboard() {
  const { orders } = useGlobalContext(); // Accede a la info del usuario

  const [showOrder, setShowOrder] = useState(false);

  const [allOrders, setAllOrders] = useState([]);
  console.log("allOrders", allOrders);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  console.log("selectedOrderId", selectedOrderId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("pending");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await orders.getAllOrders(); // Llama directamente a la función
        setAllOrders(fetchedOrders); // Guarda las órdenes en el estado local
      } catch (error) {
        console.error("Error al obtener todas las órdenes", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusfunc = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderId) return;

    try {
      const updatedOrder = await orders.updateOrderStatus(
        selectedOrderId,
        newStatus
      );

      // Actualiza el estado local
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? updatedOrder : order
        )
      );

      setIsModalOpen(false);
      setSelectedOrderId(null);
      setNewStatus("pending");
    } catch (error) {
      console.error("Error al actualizar el estado", error);
    }
  };

  const handleDeletefunc = (orderId: number) => {
    console.log("desde context", orderId);

    setSelectedOrderId(orderId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("testtttttt");
    if (!selectedOrderId) return;

    console.log("🚀 Intentando eliminar la orden ID:", selectedOrderId);

    try {
      const result = await orders.deleteOrder(selectedOrderId); // ✅ Aquí debe llamar al contexto

      if (result) {
        console.log("✅ Orden eliminada:", result);
        setAllOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== selectedOrderId)
        );
      } else {
        console.error("⚠️ No se pudo eliminar la orden");
      }

      setIsDeleteModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("💥 Error al eliminar la orden:", error);
    }
  };

  return (
    <div className="p-[40px]">
      <div className="flex">
        <div className="mb-2 mt-3">
          <label className="block text-slate-50">date</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Country"
            name="country"
            type="date"
            // value={formData.country}
            // onChange={handleChange}
          />
        </div>
        <div className="mb-2 mt-3 ms-2">
          <label className="block text-slate-50">By user id</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="user id"
            name="country"
            // value={formData.country}
            // onChange={handleChange}
          />
        </div>

        <div className="mb-2 mt-3 ms-2">
          <label className="block text-slate-50">By country</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="user id"
            name="country"
            // value={formData.country}
            // onChange={handleChange}
          />
        </div>
      </div>
      {allOrders.length === 0 ? (
        <p>No hay órdenes disponibles.</p>
      ) : (
        allOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white h-auto w-full mt-5 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex">
                <p>
                  <strong>Cliente:</strong>
                  {order.full_name}
                </p>
                <p className="ms-2">
                  <strong>Cliente ID:</strong>
                  {order.user_id}
                </p>
                <p className="ms-2">
                  <strong>Fecha:</strong>{" "}
                  {new Date(order.created_at).toLocaleDateString("es-ES", {
                    day: "numeric", // 17
                    month: "short", // febrero
                    year: "numeric", // 2025
                  })}
                </p>
                <p className="ms-2">
                  <strong>Total:</strong> ${order.total_price}
                </p>
              </div>
              <div
                className="cursor-pointer text-blue-500"
                onClick={() =>
                  setShowOrder(showOrder === order.id ? null : order.id)
                }
              >
                {showOrder === order.id ? "Cerrar" : "Ver Orden"}
              </div>
            </div>

            {showOrder === order.id && (
              <div className="mt-4">
                <h3 className="font-semibold">Detalles del pedido:</h3>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                {order.order_data.map((item, index) => (
                  <div key={index} className="p-2 border-b">
                    <p>
                      <strong>Mascota:</strong> {item.pet.name}
                    </p>
                    <p>
                      <strong>Tag:</strong> {item.tag.shape} -{" "}
                      {item.tag.material}
                    </p>
                    <p>
                      <strong>Quantity</strong> ${item.quantity}
                    </p>
                    <p>
                      <strong>Precio:</strong> ${item.price}
                    </p>
                    <img
                      src={item.tag.qr_url_link}
                      alt="QR Code"
                      className="w-20 h-20 mt-2"
                    />
                  </div>
                ))}
              </div>
            )}
            {showOrder === order.id ? (
              <div>
                <button
                  className="btn  bg-teal-500  mt-2 me-2 border-none text-white"
                  onClick={() => handleStatusfunc(order.id)}
                >
                  edit status
                </button>
                <button
                  className="btn  bg-teal-500 mt-2 me-2 border-none"
                  onClick={() => handleDeletefunc(order.id)}
                >
                  delete order
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        ))
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Editar Estado</h2>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="select select-bordered w-full mb-4"
            >
              <option value="pending">Pendiente</option>
              <option value="sent">Enviado</option>
              <option value="delivered">Entregado</option>
              <option value="cancelled">Cancelado</option>
            </select>

            <div className="flex justify-end">
              <button
                className="btn bg-gray-400 text-white me-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="btn bg-teal-500 text-white"
                onClick={handleUpdateStatus}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteDialogAdmin
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="la orden"
      />
    </div>
  );
}
