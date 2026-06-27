#!/bin/sh

set -e

host="$1"
port="$2"
timeout="${3:-30}"

if [ -z "$host" ] || [ -z "$port" ]; then
    echo "Usage: $0 <host> <port> [timeout]"
    exit 1
fi

echo "Waiting for $host:$port..."

for i in $(seq 1 "$timeout"); do
    if node -e "require('net').createConnection($port,'$host').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))" 2>/dev/null; then
        echo "$host:$port is ready after ${i}s"
        exit 0
    fi
    sleep 1
done

echo "Failed to connect to $host:$port after $timeout seconds"
exit 1
