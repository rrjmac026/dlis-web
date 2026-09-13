#!/bin/sh
set -e

cd /var/www/html || exit 1

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
# 2. Warm production caches. Env vars are injected by docker-compose
#    (env_file), so check APP_KEY as a signal that real config is present
#    before caching — avoids caching blank/broken config on a misconfigured
#    first boot.
# ---------------------------------------------------------------------------
if [ -n "$APP_KEY" ]; then
  su -s /bin/sh www-data -c "php artisan config:cache --no-ansi" 2>/dev/null || true
  su -s /bin/sh www-data -c "php artisan route:cache  --no-ansi" 2>/dev/null || true
  su -s /bin/sh www-data -c "php artisan view:cache   --no-ansi" 2>/dev/null || true
fi

exec docker-php-entrypoint "$@"