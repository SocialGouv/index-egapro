#!/bin/bash
set -e

[ ! -d /app/egapro.egg-info ] && ln -s /egapro.egg-info /app/egapro.egg-info

./init.py

exec gunicorn egapro.views:app -b 0.0.0.0:2626 --access-logfile=- --log-file=- --timeout 600 --worker-class roll.worker.Worker