#FROM python:3.9.7

#WORKDIR /app
#
#COPY setup.py .
#COPY setup.cfg .
#
#RUN	pip install -e .[dev,test,prod]
#
#COPY . .
#
#EXPOSE 2626
#
#CMD ["./entrypoint.sh"]

FROM jekyll/jekyll:4

FROM ghcr.io/socialgouv/docker/nginx:7.0.0

COPY --from=builder --chown=nginx:nginx /out /usr/share/nginx/html
