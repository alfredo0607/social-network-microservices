# 🧪 Prueba Técnica – Desarrollador Full Stack

## Red Social con Microservicios

## 👤 Datos del Candidato

- **Nombre:** Alfredo
- **Rol:** Desarrollador Full Stack
- **Repositorio GitHub:** [https://github.com/alfredo0607](https://github.com/alfredo0607)
- **Proyecto:** Social Network – Full Stack (Node.js & React)

---

## 📌 Descripción de la Prueba

Esta prueba técnica consiste en el desarrollo de una **red social** utilizando una **arquitectura de microservicios**, donde los usuarios pueden autenticarse, visualizar publicaciones, crear nuevas publicaciones, dar likes y ver su perfil.

El proyecto fue desarrollado cumpliendo los requisitos funcionales y técnicos definidos en la prueba, utilizando buenas prácticas de desarrollo, contenedores Docker y separación clara entre frontend y backend.

---

## 🎯 Objetivo

Desarrollar una aplicación full stack que permita:

- Autenticación de usuarios
- Visualización y creación de publicaciones
- Interacción mediante likes
- Consulta del perfil del usuario autenticado

---

## 🧩 Alcance Funcional Implementado

### 🔐 Autenticación

- Login de usuario mediante **JWT**
- Validación de credenciales (usuario y contraseña)

### 👤 Perfil de Usuario

- Visualización de:

  - Nombres
  - Apellidos
  - Fecha de nacimiento
  - Alias

### 📝 Publicaciones

- Listar publicaciones de otros usuarios
- Crear nuevas publicaciones
- Cada publicación contiene:

  - Mensaje
  - Usuario
  - Fecha de publicación

- Dar like a publicaciones
- Visualizar total de likes por publicación

---

## 🛠️ Arquitectura y Tecnologías

### Backend

- Node.js
- Express.js
- Arquitectura de Microservicios
- JWT para autenticación
- Docker y Docker Compose
- Variables de entorno por microservicio
- Seeder de usuarios y publicaciones iniciales

**Microservicios:**

- Auth Service
- User Service
- Post Service
- Like Service

---

### Base de Datos

- PostgreSQL
- ORM para manejo de entidades y relaciones
- Script de carga inicial (seeders)

---

### Frontend

- React
- Manejo de estado global
- Consumo de API REST
- Pantallas implementadas:

  - Login
  - Perfil de Usuario
  - Publicaciones
  - Crear Publicación

---

## 🐳 Contenedores

- Todos los microservicios están dockerizados
- Docker Compose levanta:

  - Base de datos
  - Microservicios
  - Servicios necesarios para el funcionamiento del sistema

---

## 📦 Entregables

- ✅ Repositorio en GitHub con frontend y backend
- ✅ Backend con arquitectura de microservicios
- ✅ Docker Compose funcional
- ✅ Script de base de datos con usuarios de prueba
- ✅ Documentación mediante README
- ✅ Proyecto listo para ejecución local

---

## 🧠 Extras Considerados

- Buen manejo de errores
- Separación de responsabilidades
- Código escalable y mantenible
- Uso de variables de entorno
- Preparado para futuras mejoras (Swagger, tests, TypeScript)

---

## 🚀 Conclusión

Este proyecto demuestra la implementación de una solución **Full Stack moderna**, aplicando conceptos de **microservicios**, **contenedores**, **autenticación segura** y **desarrollo frontend con React**, cumpliendo los requerimientos planteados en la prueba técnica.

---

Si quieres, en el próximo mensaje puedo:

- 📥 Generarte esto como **README descargable**
- 📄 Convertirlo en **PDF**
- ✍️ Ajustarlo con el **nombre de la empresa**
- 🎥 Agregar una sección para el **video demostrativo**
- 🇺🇸 Traducirlo a inglés

Dime qué formato necesitas y te lo dejo listo 💪
