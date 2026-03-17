FROM node:18-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/src ./src
COPY frontend/public ./public

ENV REACT_APP_API_URL=http://localhost:8000

EXPOSE 3000

CMD ["npm", "start"]
