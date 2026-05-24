import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const warehouse = await prisma.warehouse.create({
    data: {
      name: "Main Warehouse",
      location: "Chennai",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "Gaming Laptop",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Phone",
      description: "Smart Phone",
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse.id,
      totalStock: 20,
      reservedStock: 5,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product2.id,
      warehouseId: warehouse.id,
      totalStock: 30,
      reservedStock: 10,
    },
  });

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });