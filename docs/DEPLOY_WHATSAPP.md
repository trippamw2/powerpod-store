# Whatomate Deployment Script for Vultr/Docker
# Run this on a VPS with Docker installed

# 1. Download Whatomate files
curl -LO https://raw.githubusercontent.com/shridarpatil/whatomate/main/docker/docker-compose.yml
curl -LO https://raw.githubusercontent.com/shridarpatil/whatomate/main/config.example.toml  
curl -L https://raw.githubusercontent.com/shridarpatil/whatomate/main/docker/.env.example -o .env

# 2. Copy config
cp config.example.toml config.toml

# 3. Edit config.toml - Set your settings
# Key settings:
# - jwt.secret = generate a strong random string
# - environment = "production"
# - debug = false

# 4. Run Docker
docker compose up -d

# 5. Access at http://YOUR_SERVER_IP:8080
# Login: admin@admin.com / admin

# ---
# To connect to PowerPod:
# Your WhatsApp API URL will be: http://YOUR_SERVER_IP:8080/api
# Add to PowerPod .env:
# VITE_WHATSAPP_API_URL=http://YOUR_SERVER_IP:8080/api
# VITE_WHATSAPP_API_KEY=your-api-key-from-whatomate