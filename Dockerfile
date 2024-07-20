FROM node:8-stretch
WORKDIR /app
COPY . .
RUN npm install --production
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
RUN npm run build
CMD ["npm", "start"]