#!/bin/sh
set -e

echo "🚀 Starting User Service..."

# Check if RUN_MIGRATIONS environment variable is set
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📦 Running database migrations..."
  npm run migration:up || {
    echo "❌ Migration failed. Exiting..."
    exit 1
  }
  echo "✅ Migrations completed successfully"
else
  echo "⏭️  Skipping migrations (RUN_MIGRATIONS not set to 'true')"
  echo "💡 To run migrations automatically, set RUN_MIGRATIONS=true"
fi

# Start the application
echo "🎯 Starting application..."
exec node dist/main.js

