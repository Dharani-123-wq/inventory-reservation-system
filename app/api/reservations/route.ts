import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {

  try {

    // Find expired pending reservations
    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
          status: "PENDING",
        },
      });

    // Release stock safely
    for (const reservation of expiredReservations) {

      const inventory =
        await prisma.inventory.findUnique({
          where: {
            id: reservation.inventoryId,
          },
        });

      if (
        inventory &&
        inventory.reservedStock >=
          reservation.quantity
      ) {

        await prisma.inventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reservedStock: {
              decrement:
                reservation.quantity,
            },
          },
        });
      }

      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: "RELEASED",
        },
      });
    }

    const reservations =
      await prisma.reservation.findMany({
        include: {
          inventory: {
            include: {
              product: true,
              warehouse: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      reservations
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch reservations",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const inventory =
      await prisma.inventory.findUnique({
        where: {
          id: body.inventoryId,
        },
      });

    if (!inventory) {

      return NextResponse.json(
        {
          error: "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    const availableStock =
      inventory.totalStock -
      inventory.reservedStock;

    if (
      availableStock < body.quantity
    ) {

      return NextResponse.json(
        {
          error:
            "Not enough stock available",
        },
        {
          status: 400,
        }
      );
    }

    const reservation =
      await prisma.reservation.create({
        data: {
          inventoryId:
            body.inventoryId,

          quantity: body.quantity,

          expiresAt: new Date(
            Date.now() +
              1 * 60 * 1000
          ),
        },
      });

    await prisma.inventory.update({
      where: {
        id: body.inventoryId,
      },
      data: {
        reservedStock: {
          increment: body.quantity,
        },
      },
    });

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Reservation failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request
) {

  try {

    const body = await req.json();

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: body.id,
        },
      });

    if (!reservation) {

      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    // Prevent double release
    if (
      reservation.status ===
      "RELEASED"
    ) {

      return NextResponse.json({
        message:
          "Already released",
      });
    }

    const inventory =
      await prisma.inventory.findUnique({
        where: {
          id: reservation.inventoryId,
        },
      });

    if (
      inventory &&
      inventory.reservedStock >=
        reservation.quantity
    ) {

      await prisma.inventory.update({
        where: {
          id: reservation.inventoryId,
        },
        data: {
          reservedStock: {
            decrement:
              reservation.quantity,
          },
        },
      });
    }

    await prisma.reservation.update({
      where: {
        id: body.id,
      },
      data: {
        status: "RELEASED",
      },
    });

    return NextResponse.json({
      message:
        "Reservation Released",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Release failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  req: Request
) {

  try {

    const body = await req.json();

    const reservation =
      await prisma.reservation.update({
        where: {
          id: body.id,
        },
        data: {
          status: "CONFIRMED",
        },
      });

    return NextResponse.json(
      reservation
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error:
          "Confirmation failed",
      },
      {
        status: 500,
      }
    );
  }
}