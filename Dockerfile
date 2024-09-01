# Dockerfile
FROM docker.io/library/node:18-alpine

ENV NODE_ENV development

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de configuración del proyecto (package.json y package-lock.json si lo tienes)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Construir   
CMD [ "npm", "start" ]

EXPOSE 3000
# Exponer el puerto en el que se servirá la aplicación (normalmente 3000 para React)