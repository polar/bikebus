#!/bin/bash

# shellcheck disable=SC1090
source ~/.nvm/nvm.sh
nvm use 23

# Handler for INT signal
trap 'echo "Received INT signal, exiting..."; exit 0' INT

# Command to run (replace with your actual command)
COMMAND="npm run dev"

while true; do
    echo "Starting command: $COMMAND"
    $COMMAND
    EXIT_CODE=$?
    echo "Command exited with code: $EXIT_CODE"
    echo "Restarting in 2 seconds..."
    sleep 2
done