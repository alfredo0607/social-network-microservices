# 🧩 Social Network -- Backend (Microservices)

Backend de una red social desarrollado con **Node.js**, arquitectura de
**microservicios** y **Docker**.

## 🛠️ Tecnologías utilizadas

- Node.js
- Express
- Docker & Docker Compose
- postgresql & prisma (ORM)
- JWT (Autenticación)
- Arquitectura de Microservicios

## 📂 Estructura del Backend

    backend/
    │
    ├── auth-service/
    ├── user-service/
    ├── post-service/
    ├── like-service/
    ├── docker-compose.yml
    └── README.md

## 🚀 Cómo correr el Backend

### 📌 Paso 1: Clonar el repositorio

```bash
git clone https://github.com/alfredo0607/social-network-microservices.git
```

### 📌 Paso 2: Posicionarse en la carpeta backend

```bash
cd social-network-microservices/backend
```

### 📌 Paso 3: Configurar variables de entorno

Crear un archivo `.env` en cada microservicio usando como referencia el
archivo `.env.example`.

Microservicios: - auth-service - user-service - post-service -
like-service

### 📌 Paso 4: Instalar dependencias

```bash
cd auth-service && npm install
cd ../like-service && npm install
cd ../post-service && npm install
cd ../user-service && npm install
```

### 📌 Paso 5: Levantar contenedores con Docker

```bash
docker compose build
docker compose up -d
```

## ✅ Verificación

```bash
docker ps
```

```bash
docker compose logs -f
```

## 👨‍💻 Autor

**Alfredo**\
GitHub: https://github.com/alfredo0607
