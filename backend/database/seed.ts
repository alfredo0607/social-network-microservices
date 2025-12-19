import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Limpieza (opcional pero recomendado en seed)
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  const users = [];

  for (let i = 1; i <= 20; i++) {
    users.push({
      email: `user${i}@test.com`,
      password: passwordHash,
      name: `Usuario ${i}`,
      alias: `user${i}`,
      birthDate: new Date(`199${i % 10}-01-01`),
    });
  }

  // Crear usuarios
  await prisma.user.createMany({
    data: users,
  });

  const allUsers = await prisma.user.findMany();

  // Crear una publicación por usuario
  for (const user of allUsers) {
    await prisma.post.create({
      data: {
        message: `Hola, esta es la publicación de ${user.alias}`,
        userId: user.id,
      },
    });
  }

  const posts = await prisma.post.findMany();

  // Crear likes (usuarios dando like a publicaciones de otros)
  for (const post of posts) {
    const randomUsers = allUsers
      .filter((u) => u.id !== post.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3); // 3 likes por post

    for (const user of randomUsers) {
      await prisma.like.create({
        data: {
          userId: user.id,
          postId: post.id,
        },
      });
    }
  }

  console.log("✅ Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
