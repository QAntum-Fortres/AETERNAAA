# MULTI-STAGE DOCKERFILE FOR AETERNA (RUST SUBSTRATE)
# Optimized for high-density capital extraction

FROM rust:1.80-slim as builder

WORKDIR /usr/src/aeterna
COPY . .

# Build for release
RUN cargo build --release -p lwas_cli

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary
COPY --from=builder /usr/src/aeterna/target/release/lwas_cli /app/lwas_cli

# Copy necessary assets
COPY AETERNA_ANIMA.soul /AETERNA_ANIMA.soul
COPY tokenizer.json /app/tokenizer.json

# Create asset directories
RUN mkdir -p /app/assets/micro_saas

EXPOSE 8890

<<<<<<< HEAD
CMD ["./lwas_cli", "ignite"]
=======
# [ENTERPRISE_PILLAR]: Reliability handled by Cloud Run Orchestration
# HEALTHCHECK removed to support dynamic port scaling

CMD ["/app/lwas_cli"]
>>>>>>> f0a1a5c ( [AETERNA]: Render Blueprint Manifested for lwas_cli singularity.)
