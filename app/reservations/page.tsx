"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReservationsPage() {

  const [reservations, setReservations] =
    useState<any[]>([]);

  const fetchReservations =
    async () => {

      const res =
        await fetch("/api/reservations");

      const data = await res.json();

      setReservations(data);
    };

  useEffect(() => {
    fetchReservations();
  }, []);

  const confirmReservation =
    async (id: string) => {

      await fetch("/api/reservations", {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({ id }),
      });

      fetchReservations();
    };

  const releaseReservation =
    async (id: string) => {

      await fetch("/api/reservations", {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({ id }),
      });

      fetchReservations();
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            fontSize: "40px",
            color: "green",
          }}
        >
          Reservations
        </h1>

        <Link href="/">
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Back Home
          </button>
        </Link>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >

        {reservations.map(
          (reservation) => (

            <div
              key={reservation.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow:
                  "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            >

              <h2>
                {
                  reservation.inventory
                    .product.name
                }
              </h2>

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

              <p
                style={{
                  fontWeight: "bold",
                  color:
                    reservation.status ===
                    "PENDING"
                      ? "orange"
                      : reservation.status ===
                        "CONFIRMED"
                      ? "green"
                      : "red",
                }}
              >
                Status:{" "}
                {reservation.status}
              </p>

              <p>
                <b>Expires:</b>{" "}
                {new Date(
                  reservation.expiresAt
                ).toLocaleString()}
              </p>

              {reservation.status ===
                "PENDING" && (

                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "10px",
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
                      padding:
                        "10px 16px",
                      borderRadius:
                        "8px",
                      cursor: "pointer",
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
                      padding:
                        "10px 16px",
                      borderRadius:
                        "8px",
                      cursor: "pointer",
                    }}
                  >
                    Release
                  </button>

                </div>
              )}

              {reservation.status ===
                "CONFIRMED" && (

                <p
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Reservation Confirmed
                </p>
              )}

              {reservation.status ===
                "RELEASED" && (

                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginTop: "15px",
                  }}
                >
                  Reservation Released
                </p>
              )}

            </div>
          )
        )}

      </div>

    </div>
  );
}