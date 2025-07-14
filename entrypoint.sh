#!/bin/bash
set -e

# -------------------------------------------------------------------------------
# ENTRYPOINT: Runtime UID/GID Switching
# Supports running the container as any user by accepting:
#   - PUID (default: 2000)
#   - PGID (default: 2000)
#   - APP_USER (default: noisedash)
# This script ensures that the writable parts of the filesystem are owned
# by the UID the user specified or provided via environment.
# -------------------------------------------------------------------------------

APP_USER=${APP_USER:-noisedash}
APP_UID=${PUID:-2000}
APP_GID=${PGID:-2000}

if [ "$(id -u)" = "0" ]; then
    echo "[INFO] Running as root. Target UID:GID → $APP_UID:$APP_GID"

    # Reuse existing UID if already assigned in /etc/passwd
    existing_user=$(getent passwd "$APP_UID" | cut -d: -f1)
    if [ -n "$existing_user" ]; then
        echo "[INFO] UID $APP_UID already exists as user '$existing_user'. Using it."
        APP_USER="$existing_user"
    else
        # Ensure group exists
        if ! getent group "$APP_GID" >/dev/null; then
            echo "[INFO] Creating group '$APP_USER' with GID $APP_GID"
            groupadd -g "$APP_GID" "$APP_USER"
        fi

        echo "[INFO] Creating user '$APP_USER' with UID $APP_UID and GID $APP_GID"
        useradd -u "$APP_UID" -g "$APP_GID" -m -s /sbin/nologin "$APP_USER"
    fi

    # Ensure ownership of all writable paths (excluding node_modules)
    echo "[INFO] Fixing ownership of /var/noisedash (excluding node_modules)"
    find /var/noisedash ! -path "/var/noisedash/node_modules*" -exec chown "$APP_UID:$APP_GID" {} +

    echo "[INFO] Dropping privileges to user '$APP_USER'"
    exec gosu "$APP_USER" "$@"
else
    echo "[INFO] Already running as non-root (UID $(id -u)). Skipping user setup."
    exec "$@"
fi
