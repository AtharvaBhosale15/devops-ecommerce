FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY api.js db.js ./
EXPOSE 3001
ENV PORT=3001
CMD ["node", "api.js"]
