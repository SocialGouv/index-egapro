FROM jekyll/jekyll:4

FROM ghcr.io/socialgouv/docker/nginx:7.0.0

ARG EGAPRO_API_URL

ENV EGAPRO_API_URL=${EGAPRO_API_URL}

# echo "sentry-dsn: 'https://b2f84ee9dc6044abbeb0f417f4335a26@sentry.fabrique.social.gouv.fr/48'" >> _config.yml
# echo "version: `date +"%Y.%m.%d"`" >> _config.yml
# RUN echo "EGAPRO_API_URL: ${EGAPRO_API_URL}" >> _config.yml
# jekyll build --baseurl "/declaration"


COPY --from=builder --chown=nginx:nginx /out /usr/share/nginx/html
