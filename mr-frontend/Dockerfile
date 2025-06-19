FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/mr/browser/ /usr/share/nginx/html/

COPY nginx/default.conf /etc/nginx/conf.d/default.conf