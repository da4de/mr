FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
EXPOSE 3001

CMD ["node", "dist/main"]