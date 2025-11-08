#!/bin/bash

# Script to kill processes using specified ports
# Usage: ./kill-ports.sh [port1] [port2] ...

for port in "$@"; do
  if [ -z "$port" ]; then
    continue
  fi
  
  echo "Checking port $port..."
  
  # Find processes using the port
  PIDS=$(lsof -ti:$port 2>/dev/null)
  
  if [ -z "$PIDS" ]; then
    echo "Port $port is free"
  else
    echo "Killing processes on port $port: $PIDS"
    for PID in $PIDS; do
      kill -9 $PID 2>/dev/null || true
    done
    echo "Port $port is now free"
  fi
done

