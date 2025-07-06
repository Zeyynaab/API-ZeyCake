FROM node:20
#dossier pour l'app
WORKDIR /usr/src/app

#fichiers de dependances et installation
COPY package*.json ./
RUN npm install

#copie du reste du code
COPY . .

RUN mkdir -p /data

EXPOSE 3000

CMD ["npm", "src/app.js"]
