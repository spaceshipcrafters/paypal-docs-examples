#!/bin/bash

ENV_FILE=".env"
SERVICES=("server")

open_in_browser () {
    local SERVICE=$1

    # Get service host port from environment variables
    SERVICE_HOST_PORT=$(env | grep -i "host_port_$SERVICE" | cut -d '=' -f 2)

    # Build service URL
    SERVICE_URL="http://localhost:$SERVICE_HOST_PORT"

    echo "Opening $SERVICE_URL in browser..."

    # Open service in browser (suppress output)
    xdg-open $SERVICE_URL > /dev/null 2>&1 &

    echo "Done"
}

# Load environment variables from .env file
set -o allexport
source $ENV_FILE set

for SERVICE in "${SERVICES[@]}"; do
    open_in_browser $SERVICE
done