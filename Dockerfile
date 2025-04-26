# Use a lightweight web server image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the HTML file
COPY public/index.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# The default command for nginx is to start the server