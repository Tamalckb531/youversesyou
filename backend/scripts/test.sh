#!/bin/bash

set -e

TEST_TARGET="$1"

if [ -n "$TEST_TARGET" ] && [ ! -d "tests/$TEST_TARGET" ]; then
    echo "Error: Test directory 'tests/$TEST_TARGET' does not exist."
    exit 1
fi

CONTAINER_NAME="youverseyou-test-postgres"
TEST_DB="testdb"
TEST_USER="postgres"
TEST_PASSWORD="password"
TEST_PORT="5433"

TEST_DATABASE_URL="postgres://${TEST_USER}:${TEST_PASSWORD}@localhost:${TEST_PORT}/${TEST_DB}"

cleanup() {
    echo ""
    echo "Cleaning up test database..."

    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

    echo "Test database removed."
}

trap cleanup EXIT

echo ""
echo "======================================"
echo " Starting test PostgreSQL container"
echo "======================================"
echo ""

# Remove an old container if one somehow exists
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true

docker run \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER="$TEST_USER" \
    -e POSTGRES_PASSWORD="$TEST_PASSWORD" \
    -e POSTGRES_DB="$TEST_DB" \
    -p "$TEST_PORT:5432" \
    -d \
    postgres:16-alpine

echo ""
echo "Waiting for PostgreSQL..."

until docker exec "$CONTAINER_NAME" pg_isready \
    -U "$TEST_USER" \
    -d "$TEST_DB" >/dev/null 2>&1
do
    sleep 1
done

echo "PostgreSQL is ready."

echo ""
echo "======================================"
echo " Pushing Drizzle schema"
echo "======================================"
echo ""

DATABASE_URL="$TEST_DATABASE_URL" \
NODE_ENV=test \
npx drizzle-kit push

echo ""
echo "======================================"
echo " Seeding test database"
echo "======================================"
echo ""

DATABASE_URL="$TEST_DATABASE_URL" \
NODE_ENV=test \
npm run seed

echo ""
echo "======================================"
echo " Running tests"
echo "======================================"
echo ""

if [ -z "$TEST_TARGET" ]; then
    TEST_PATH="tests"
else
    TEST_PATH="tests/$TEST_TARGET"
fi

echo "Running tests from: $TEST_PATH"

DATABASE_URL="$TEST_DATABASE_URL" \
NODE_ENV=test \
npx vitest run "$TEST_PATH"

echo ""
echo "======================================"
echo " All tests passed"
echo "======================================"
echo ""