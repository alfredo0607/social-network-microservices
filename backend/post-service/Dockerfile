# Imagen base
FROM node:22-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y lock primero (mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del proyecto
COPY . .

# Variable de entorno por defecto
ENV NODE_ENV=production

# Exponer el puerto (debe coincidir con process.env.PORT)
EXPOSE 3003

# Comando para iniciar el servidor
CMD ["node", "src/index.js"]
