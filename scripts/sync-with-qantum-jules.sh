#!/bin/bash
# Sync AETERNAAA with QANTUM-JULES framework
# Synchronizes payment methods, paths, and configurations

set -e

QANTUM_JULES_PATH="${QANTUM_JULES_PATH:-C:/Users/papic/Downloads/RUST-AEGIS/QANTUM-JULES}"
AETERNAAA_PATH="$(pwd)"

echo "🔄 Syncing AETERNAAA with QANTUM-JULES..."
echo "Source: $QANTUM_JULES_PATH"
echo "Target: $AETERNAAA_PATH"

# Sync OmniCore payment gateway improvements
if [ -f "$QANTUM_JULES_PATH/OmniCore/src/economy/PaymentGateway.ts" ]; then
    echo "📦 Syncing PaymentGateway improvements..."
    cp "$QANTUM_JULES_PATH/OmniCore/src/economy/PaymentGateway.ts" "$AETERNAAA_PATH/OmniCore/economy/PaymentGateway.ts" || true
fi

# Sync important soul files
if [ -d "$QANTUM_JULES_PATH/LwaS" ]; then
    echo "🧬 Syncing LwaS soul files..."
    mkdir -p "$AETERNAAA_PATH/LwaS"
    cp -r "$QANTUM_JULES_PATH/LwaS/"* "$AETERNAAA_PATH/LwaS/" 2>/dev/null || true
fi

# Sync OmniCore modules that might be missing
if [ -d "$QANTUM_JULES_PATH/OmniCore/src" ]; then
    echo "🔧 Syncing OmniCore modules..."
    mkdir -p "$AETERNAAA_PATH/OmniCore/src"
    cp -r "$QANTUM_JULES_PATH/OmniCore/src/"* "$AETERNAAA_PATH/OmniCore/src/" 2>/dev/null || true
fi

# Sync nerve-center if exists
if [ -d "$QANTUM_JULES_PATH/nerve-center" ]; then
    echo "🧠 Syncing nerve-center..."
    cp -r "$QANTUM_JULES_PATH/nerve-center" "$AETERNAAA_PATH/" 2>/dev/null || true
fi

echo "✅ Sync complete!"
