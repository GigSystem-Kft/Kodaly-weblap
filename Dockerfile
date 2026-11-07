# Zeneelméleti Műhely – saját Docker Registry számára
# Multi-stage build: Node 24 / Linux; nem használja a Maced node_modules mappáját.
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# A függőségi lockfile-t a korábban hozzáadott mysql2 csomag miatt frissítjük.
RUN npm install --no-audit --no-fund
COPY . .
RUN npm test && npm run lint && npm run build
RUN ./node_modules/.bin/esbuild server.ts --bundle --platform=node --target=node24 --format=esm --packages=external --outfile=server.mjs
RUN npm prune --omit=dev --no-audit --no-fund

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3100 HOST=127.0.0.1
WORKDIR /app
COPY --from=build --chown=node:node /app/server.mjs ./server.mjs
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server-data ./server-data
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
USER node
EXPOSE 3100
HEALTHCHECK --interval=30s --timeout=4s --start-period=15s --retries=3 CMD node -e "fetch('http://127.0.0.1:3100/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
