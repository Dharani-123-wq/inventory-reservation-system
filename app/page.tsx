"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [products, setProducts] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);

  const fetchData = async () => {

    try {

      const productRes =
        await fetch("/api/products");

      const productData =
        await productRes.json();

      if (Array.isArray(productData)) {
        setProducts(productData);
      }

      const reservationRes =
        await fetch("/api/reservations");

      const reservationData =
        await reservationRes.json();

      if (Array.isArray(reservationData)) {
        setReservations(reservationData);
      }

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reserveProduct = async (
    inventoryId: string
  ) => {

    await fetch("/api/reservations", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        inventoryId,
        quantity: 1,
      }),
    });

    fetchData();
  };

  const confirmReservation = async (
    id: string
  ) => {

    await fetch("/api/reservations", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });

    fetchData();
  };

  const releaseReservation = async (
    id: string
  ) => {

    await fetch("/api/reservations", {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });

    fetchData();
  };

  return (

    <div
      style={{
        padding: "30px",
        background: "#f3f4f6",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          color: "#2563eb",
          fontSize: "40px",
          marginBottom: "40px",
        }}
      >
        Inventory Reservation System
      </h1>

      <h2
        style={{
          fontSize: "28px",
          marginBottom: "20px",
        }}
      >
        Products
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >

        {products.map((product) => (

          <div
            key={product.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow:
                "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          >

            <h2>{product.name}</h2>

            <p>{product.description}</p>

            {product.inventories?.map(
              (inventory: any) => (

                <div
                  key={inventory.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginTop: "15px",
                    borderRadius: "8px",
                    background: "#f9fafb",
                  }}
                >

                  <p>
                    <b>Warehouse:</b>{" "}
                    {inventory.warehouse.name}
                  </p>

                  <p>
                    <b>Location:</b>{" "}
                    {
                      inventory.warehouse
                        .location
                    }
                  </p>

                  <p>
                    <b>Total Stock:</b>{" "}
                    {inventory.totalStock}
                  </p>

                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    Reserved Stock:{" "}
                    {inventory.reservedStock}
                  </p>

                  <p
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    Available Stock:{" "}
                    {inventory.totalStock -
                      inventory.reservedStock}
                  </p>

                  <button
                    onClick={() =>
                      reserveProduct(
                        inventory.id
                      )
                    }
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    Reserve Product
                  </button>

                </div>
              )
            )}

          </div>
        ))}

      </div>

      <h2
        style={{
          fontSize: "28px",
          marginTop: "50px",
          marginBottom: "20px",
        }}
      >
        Reservations
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >

        {reservations.map((reservation) => (

          <div
            key={reservation.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow:
                "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          >

            <p>
              <b>Product:</b>{" "}
              {
                reservation.inventory
                  .product.name
              }
            </p>

            <p>
              <b>Warehouse:</b>{" "}
              {
                reservation.inventory
                  .warehouse.name
              }
            </p>

            <p>
              <b>Quantity:</b>{" "}
              {reservation.quantity}
            </p>

            <p>
              <b>Status:</b>{" "}

              <span
                style={{
                  color:
                    reservation.status ===
                    "PENDING"
                      ? "orange"
                      : reservation.status ===
                        "CONFIRMED"
                      ? "green"
                      : "red",

                  fontWeight: "bold",
                }}
              >
                {reservation.status}
              </span>

            </p>

            <p>
              <b>Expires:</b>{" "}
              {new Date(
                reservation.expiresAt
              ).toLocaleString()}
            </p>

            <div
              style={{
                marginTop: "15px",
              }}
            >

              <button
                onClick={() =>
                  confirmReservation(
                    reservation.id
                  )
                }
                style={{
                  background: "green",
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Confirm
              </button>

              <button
                onClick={() =>
                  releaseReservation(
                    reservation.id
                  )
                }
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Release
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}