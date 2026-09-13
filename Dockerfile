# syntax=docker/dockerfile:1

# ── Stage: composer deps (shared by app + frontend build) ────────────────
FROM composer:2 AS vendor
WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist \
    --no-autoloader

# ── Stage: frontend build (Vite/React) ────────────────────────────────────
# Needs PHP because @laravel/vite-plugin-wayfinder shells out to
# `php artisan wayfinder:generate` mid-build to generate typed route
# helpers (dashboard(), login(), etc. used across resources/js).
FROM node:20-alpine AS frontend

RUN apk add --no-cache php83 php83-cli php83-mbstring php83-xml php83-tokenizer \
    php83-pdo php83-phar php83-openssl php83-curl php83-ctype php83-dom php83-fileinfo \
    php83-session php83-simplexml php83-iconv \
    && ln -sf /usr/bin/php83 /usr/bin/php

WORKDIR /app
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=vendor /var/www/html/vendor ./vendor
COPY package*.json ./
RUN npm ci
COPY . .
RUN composer dump-autoload --optimize

# artisan needs an APP_KEY to boot, even just to run wayfinder:generate.
# Build-time only — thrown away with this stage, never ships in the image.
RUN cp .env.example .env 2>/dev/null || true \
    && php artisan key:generate --force --no-interaction

# Split out from `npm run build` so its real stdout/stderr prints directly
# in the build log. The Vite plugin normally shells out to this same
# command internally and wraps any failure as an opaque
# "RolldownError: Error generating types: Error: Command failed: ..."
# with no underlying message — running it as its own step here bypasses
# that wrapper so the actual PHP exception is visible.
RUN php artisan wayfinder:generate --with-form
RUN npm run build

# ── Stage: app (PHP-FPM) ───────────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS app

RUN apk add --no-cache \
    postgresql-dev libzip-dev zip unzip git curl icu-dev oniguruma-dev \
    nginx supervisor \
    && docker-php-ext-install pdo pdo_pgsql zip intl mbstring bcmath opcache

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=vendor /var/www/html/vendor ./vendor
COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN composer dump-autoload --optimize --no-interaction

# Production PHP settings
COPY docker/php.ini /usr/local/etc/php/conf.d/99-production.ini

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]

# ── Stage: nginx ────────────────────────────────────────────────────────
FROM nginx:alpine AS nginx

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/html/public /var/www/html/public

EXPOSE 80