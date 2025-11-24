FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.template.html /etc/nginx/templates/index.template.html
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV API_BASE_URL=http://localhost:8000

EXPOSE 80

CMD ["/entrypoint.sh"]

