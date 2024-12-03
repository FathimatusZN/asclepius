# Gunakan Node.js sebagai base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh source code ke dalam image
COPY . .

# Expose port sesuai server.js 
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "src/server/server.js"]
