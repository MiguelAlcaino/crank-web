#!/bin/sh

# Write Apple Pay domain association file from environment variable
if [ -n "$APPLE_MERCHANT_ID_DOMAIN_ASSOCIATION" ]; then
  mkdir -p /usr/share/nginx/html/.well-known
  echo "$APPLE_MERCHANT_ID_DOMAIN_ASSOCIATION" > /usr/share/nginx/html/.well-known/apple-developer-merchantid-domain-association.txt
fi

# Start nginx
exec nginx -g "daemon off;"
