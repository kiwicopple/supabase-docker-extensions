FROM --platform=$BUILDPLATFORM node:18.12-alpine3.16 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
LABEL org.opencontainers.image.title="OrioleDB" \
    org.opencontainers.image.description="OrioleDB Extension for Docker Desktop" \
    org.opencontainers.image.vendor="OrioleDB Extension" \
    com.docker.desktop.extension.api.version="0.3.0" \
    com.docker.extension.categories="Databases" \
    com.docker.extension.detailed-description="OrioleDB is a storage extension for PostgreSQL that eliminates the overhead of buffer mapping and provides lock-less page reading. It's designed for modern hardware and cloud infrastructure." \
    com.docker.extension.changelog=""
COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=client-builder /ui/build ui
