# Sử dụng Node.js LTS
FROM node:20

# Tạo thư mục app
WORKDIR /app

# Copy code và cài đặt dependencies
COPY package*.json ./
RUN npm install

COPY . .

# Mặc định backend chạy ở port 5000 (hoặc sửa theo code của bạn)
EXPOSE 3000

# Khởi động server
CMD ["npm", "start"]
