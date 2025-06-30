FROM node:22 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npx ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/mr/browser/ /usr/share/nginx/html/

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

CMD ["nginx", "-g", "daemon off;"]
