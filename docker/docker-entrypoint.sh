#!/bin/sh
set -e

cd /var/www/html || exit 1

# ---------------------------------------------------------------------------
# 0. Render assigns the external port dynamically via $PORT. Substitute it
#    into the nginx config template (the nginx base image's own startup
#    scripts also do this automatically for files in /etc/nginx/templates/,
#    but we do it explicitly here too since this entrypoint fully replaces
#    that image's default entrypoint chain).
# ---------------------------------------------------------------------------
export PORT="${PORT:-10000}"
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/http.d/default.conf

# ---------------------------------------------------------------------------
# 1. Ensure writable Laravel directories exist (matters on first boot with
#    empty named/bind volumes).
# ---------------------------------------------------------------------------
mkdir -p \
  storage/app/public \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

# ---------------------------------------------------------------------------
# 1b. Restore Google Drive OAuth credentials (used by DocumentService).
#     The container filesystem is wiped on every deploy, so these two
#     files can't just live in storage/app/google/ — they're decoded here
#     from base64 env vars set in Render's dashboard on every boot.
# ---------------------------------------------------------------------------
mkdir -p storage/app/google

if [ -n "$GOOGLE_OAUTH_CLIENT_JSON_B64" ]; then
  echo "$GOOGLE_OAUTH_CLIENT_JSON_B64" | base64 -d > storage/app/google/oauth-client.json
fi

if [ -n "$GOOGLE_OAUTH_TOKEN_JSON_B64" ]; then
  echo "$GOOGLE_OAUTH_TOKEN_JSON_B64" | base64 -d > storage/app/google/google-token.json
fi

chown -R www-data:www-data storage/app/google

# ---------------------------------------------------------------------------
# 2. Warm production caches. Only do this once real env vars are present
#    (APP_KEY as a signal), so we don't cache blank/broken config on a
#    misconfigured first boot.
# ---------------------------------------------------------------------------
if [ -n "$APP_KEY" ]; then
  su -s /bin/sh www-data -c "php artisan config:cache --no-ansi" 2>/dev/null || true
  su -s /bin/sh www-data -c "php artisan route:cache  --no-ansi" 2>/dev/null || true
  su -s /bin/sh www-data -c "php artisan view:cache   --no-ansi" 2>/dev/null || true
fi

# ---------------------------------------------------------------------------
# 3. Start both nginx and php-fpm together via supervisord — this replaces
#    the old `exec docker-php-entrypoint "$@"` / `CMD ["php-fpm"]` handoff,
#    since this container now needs to run two processes, not one.
# ---------------------------------------------------------------------------
exec /usr/bin/supervisord -c /etc/supervisord.conf