# Dockerfile
FROM docker.io/library/node:18-alpine

ENV NODE_ENV development
ENV PORT 3003

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración del proyecto (package.json y package-lock.json si lo tienes)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto 3003
EXPOSE 3003

# Comando para iniciar la aplicación
CMD ["npm", "start"]