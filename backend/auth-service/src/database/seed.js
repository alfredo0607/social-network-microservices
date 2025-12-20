import { prisma } from "./db.js";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

export async function seed() {
  console.log("🌱 Iniciando seeding...");

  console.log("🧹 Limpiando datos existentes...");
  await prisma.like.deleteMany();
  await prisma.postImage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("📝 Creando usuarios...");

  const users = [];
  const totalUsers = 15;

  for (let i = 0; i < totalUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet
      .email({
        firstName: firstName,
        lastName: lastName,
      })
      .toLowerCase();

    const password = await bcrypt.hash("Password123!", 10);
    const alias = faker.internet.username({
      firstName: firstName,
      lastName: lastName,
    });

    // Asegurar que el alias sea único añadiendo número si es necesario
    let finalAlias = alias;
    let counter = 1;
    while (users.some((u) => u.alias === finalAlias)) {
      finalAlias = `${alias}${counter}`;
      counter++;
    }

    const birthDate = faker.date.between({
      from: "1970-01-01",
      to: "2005-12-31",
    });

    const user = await prisma.user.create({
      data: {
        email: email,
        password: password,
        name: `${firstName} ${lastName}`,
        alias: finalAlias,
        birthDate: birthDate,
        createdAt: faker.date.past({ years: 2 }),
      },
    });

    users.push(user);
    console.log(`✅ Usuario creado: ${user.name} (${user.alias})`);
  }

  console.log("\n📝 Creando posts...");

  const posts = [];
  const totalPosts = 50;

  // Tipos de mensajes realistas
  const messageTemplates = [
    "Acabo de tener una experiencia increíble en {lugar} 🎉",
    "Reflexionando sobre {tema} hoy... ¿qué opinan?",
    "¡Feliz de compartir este momento con todos ustedes! {emoji}",
    "No puedo creer que {evento} haya sucedido hoy 🤯",
    "Compartiendo algunas fotos de mi viaje a {destino} ✈️",
    "¿Alguien más ha probado {comida}? ¡Está delicioso! 😋",
    "Día productivo trabajando en {proyecto} 💻",
    "Momento de relax después de un largo día 🌅",
    "¡Nuevo logro personal! 🏆 {descripcion}",
    "Pensamientos aleatorios a las {hora}... 💭",
  ];

  // Crear posts
  for (let i = 0; i < totalPosts; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const template =
      messageTemplates[Math.floor(Math.random() * messageTemplates.length)];

    // Reemplazar placeholders en los templates
    let message = template
      .replace("{lugar}", faker.location.city())
      .replace("{tema}", faker.lorem.words(3))
      .replace(
        "{emoji}",
        faker.helpers.arrayElement(["😊", "🎯", "🌟", "💫", "🔥"])
      )
      .replace("{evento}", faker.lorem.words(2))
      .replace("{destino}", faker.location.country())
      .replace("{comida}", faker.food.dish())
      .replace("{proyecto}", faker.company.buzzNoun())
      .replace("{descripcion}", faker.lorem.sentence())
      .replace(
        "{hora}",
        faker.date
          .recent()
          .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );

    // Añadir texto adicional a algunos posts
    if (Math.random() > 0.5) {
      message += "\n\n" + faker.lorem.paragraph();
    }

    const post = await prisma.post.create({
      data: {
        message: message,
        userId: randomUser.id,
        createdAt: faker.date.recent({ days: 90 }),
      },
    });

    posts.push(post);

    // 70% de probabilidad de añadir imágenes al post
    if (Math.random() < 0.7) {
      const totalImages = Math.floor(Math.random() * 4) + 1; // 1-4 imágenes

      for (let j = 0; j < totalImages; j++) {
        const ext = faker.helpers.arrayElement(["jpg", "png", "webp", "jpeg"]);
        const nameClient = `photo_${faker.number.int({
          min: 1,
          max: 1000,
        })}.${ext}`;
        const nameServer = `${faker.string.uuid()}.${ext}`;

        await prisma.postImage.create({
          data: {
            nameServer: nameServer,
            nameClient: nameClient,
            ext: ext,
            size: faker.number.int({ min: 1024, max: 10485760 }), // 1KB a 10MB
            postId: post.id,
            createdAt: post.createdAt,
          },
        });
      }

      console.log(
        `📸 Post ${post.id} creado con ${totalImages} imagen(es) por @${randomUser.alias}`
      );
    } else {
      console.log(
        `📝 Post ${post.id} creado (sin imágenes) por @${randomUser.alias}`
      );
    }
  }

  console.log("\n❤️ Creando likes...");
  // Crear likes de manera aleatoria
  let totalLikesCreated = 0;

  for (const post of posts) {
    // Número aleatorio de likes por post (0 a 15)
    const totalLikesForPost = Math.floor(Math.random() * 16);

    if (totalLikesForPost > 0) {
      // Mezclar usuarios para obtener una selección aleatoria
      const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

      for (let i = 0; i < totalLikesForPost && i < shuffledUsers.length; i++) {
        try {
          await prisma.like.create({
            data: {
              userId: shuffledUsers[i].id,
              postId: post.id,
              createdAt: faker.date.between({
                from: post.createdAt,
                to: new Date(),
              }),
            },
          });
          totalLikesCreated++;
        } catch (error) {
          // Ignorar error de like duplicado (usuario ya dio like)
          if (!error.message.includes("Unique constraint")) {
            console.error("Error creando like:", error.message);
          }
        }
      }

      console.log(`❤️ Post ${post.id} recibió ${totalLikesForPost} like(s)`);
    }
  }

  // Crear algunos posts destacados con muchos likes
  console.log("\n🏆 Creando posts destacados...");
  const featuredPosts = [];
  const numFeaturedPosts = Math.min(5, posts.length);

  // Seleccionar posts aleatorios para destacar
  for (let i = 0; i < numFeaturedPosts; i++) {
    let randomPost;
    do {
      randomPost = posts[Math.floor(Math.random() * posts.length)];
    } while (featuredPosts.includes(randomPost));

    featuredPosts.push(randomPost);

    // Añadir likes masivos a posts destacados
    const minLikes = Math.min(20, users.length);
    const maxLikes = users.length;
    const targetLikes =
      Math.floor(Math.random() * (maxLikes - minLikes + 1)) + minLikes;

    // Mezclar usuarios
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const usersToLike = shuffledUsers.slice(0, targetLikes);

    let likesAdded = 0;
    for (const user of usersToLike) {
      try {
        await prisma.like.create({
          data: {
            userId: user.id,
            postId: randomPost.id,
            createdAt: faker.date.between({
              from: randomPost.createdAt,
              to: new Date(),
            }),
          },
        });
        likesAdded++;
        totalLikesCreated++;
      } catch (error) {
        // Ignorar likes duplicados
      }
    }

    console.log(
      `🌟 Post ${randomPost.id} ahora tiene ${likesAdded} likes adicionales`
    );
  }

  console.log("\n🎉 Seeding completado exitosamente!");
  console.log("📊 Resumen:");
  console.log(`   👥 Usuarios: ${users.length}`);
  console.log(`   📝 Posts: ${posts.length}`);

  const totalImages = await prisma.postImage.count();
  console.log(`   📸 Imágenes: ${totalImages}`);

  console.log(`   ❤️ Likes totales: ${totalLikesCreated}`);

  // Mostrar estadísticas adicionales
  const userWithMostPosts = await prisma.user.findFirst({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      posts: {
        _count: "desc",
      },
    },
  });

  console.log(
    `\n🏆 Usuario más activo: @${userWithMostPosts.alias} con ${userWithMostPosts._count.posts} posts`
  );

  const postWithMostLikes = await prisma.post.findFirst({
    include: {
      _count: {
        select: { likes: true },
      },
      user: true,
    },
    orderBy: {
      likes: {
        _count: "desc",
      },
    },
  });

  console.log(
    `🔥 Post más popular: ID ${postWithMostLikes.id} por @${postWithMostLikes.user.alias} con ${postWithMostLikes._count.likes} likes`
  );
}
