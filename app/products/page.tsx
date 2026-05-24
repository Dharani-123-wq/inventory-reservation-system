"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {

  const [products, setProducts] =
    useState<any[]>([]);

  const fetchProducts = async () => {

    const res =
      await fetch("/api/products");

    const data = await res.json();

    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
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

    alert("Reservation Created");

    fetchProducts();
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
            color: "#2563eb",
          }}
        >
          Products
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

        {products.map((product) => (

          <div
            key={product.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow:
                "0px 4px 10px rgba(0,0,0,0.1)",
            }}
          >

            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <h3
              style={{
                marginTop: "20px",
              }}
            >
              Inventories
            </h3>

            {product.inventories?.map(
              (inventory: any) => (

                <div
                  key={inventory.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    marginTop: "15px",
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
                      marginTop: "12px",
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
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

    </div>
  );
}