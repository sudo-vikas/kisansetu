#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
export PATH="/home/arc/.local/bin:$PATH"

echo "=================================================="
echo "🌾 Starting KisanSetu (किसान सेतु) Platform"
echo "=================================================="

# Start Backend
echo "Starting Backend (FastAPI on http://localhost:8000)..."
cd "$DIR/backend"
PYTHONPATH=. ./venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start Frontend
echo "Starting Frontend (Vite on http://localhost:5173)..."
cd "$DIR/frontend"
npm run dev -- --host &
FRONTEND_PID=$!

echo ""
echo "🚀 KisanSetu is running!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend API & Docs: http://localhost:8000/docs"
echo "=================================================="

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT INT TERM
wait
