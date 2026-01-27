#!/bin/bash
# SSL Certificate Setup Script with Let's Encrypt for AETERNAAA
# This script sets up SSL certificates using Certbot

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 AETERNAAA SSL Certificate Setup${NC}"
echo "=================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install certbot
install_certbot() {
    echo -e "${YELLOW}📦 Installing Certbot...${NC}"
    
    if command_exists apt-get; then
        # Ubuntu/Debian
        apt-get update
        apt-get install -y certbot python3-certbot-nginx
    elif command_exists yum; then
        # CentOS/RHEL
        yum install -y epel-release
        yum install -y certbot python3-certbot-nginx
    elif command_exists dnf; then
        # Fedora
        dnf install -y certbot python3-certbot-nginx
    else
        echo -e "${RED}❌ Unsupported package manager. Please install certbot manually.${NC}"
        exit 1
    fi
}

# Function to create SSL directories
create_ssl_dirs() {
    echo -e "${YELLOW}📁 Creating SSL directories...${NC}"
    mkdir -p /etc/nginx/ssl
    mkdir -p /var/www/certbot
    chmod 755 /var/www/certbot
}

# Function to generate self-signed certificates (for testing)
generate_self_signed() {
    local domain=$1
    echo -e "${YELLOW}🔐 Generating self-signed certificate for $domain...${NC}"
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/privkey.pem \
        -out /etc/nginx/ssl/fullchain.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$domain"
    
    # Create chain file (same as fullchain for self-signed)
    cp /etc/nginx/ssl/fullchain.pem /etc/nginx/ssl/chain.pem
    
    echo -e "${GREEN}✅ Self-signed certificate generated${NC}"
}

# Function to get Let's Encrypt certificate
get_letsencrypt_cert() {
    local domain=$1
    local email=$2
    
    echo -e "${YELLOW}🌐 Obtaining Let's Encrypt certificate for $domain...${NC}"
    
    # Stop nginx temporarily
    systemctl stop nginx || docker-compose stop nginx || true
    
    # Get certificate using standalone mode
    certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email "$email" \
        -d "$domain" \
        --rsa-key-size 4096 \
        --force-renewal
    
    # Copy certificates to nginx ssl directory
    cp "/etc/letsencrypt/live/$domain/fullchain.pem" /etc/nginx/ssl/
    cp "/etc/letsencrypt/live/$domain/privkey.pem" /etc/nginx/ssl/
    cp "/etc/letsencrypt/live/$domain/chain.pem" /etc/nginx/ssl/
    
    # Set proper permissions
    chmod 644 /etc/nginx/ssl/fullchain.pem
    chmod 600 /etc/nginx/ssl/privkey.pem
    chmod 644 /etc/nginx/ssl/chain.pem
    
    echo -e "${GREEN}✅ Let's Encrypt certificate obtained${NC}"
}

# Function to setup auto-renewal
setup_auto_renewal() {
    echo -e "${YELLOW}⏰ Setting up certificate auto-renewal...${NC}"
    
    # Create renewal script
    cat > /usr/local/bin/renew-certs.sh << 'EOF'
#!/bin/bash
# Certificate renewal script

# Attempt to renew certificates
certbot renew --quiet --no-self-upgrade

# Check if renewal was successful
if [ $? -eq 0 ]; then
    # Copy renewed certificates
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" /etc/nginx/ssl/
        cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" /etc/nginx/ssl/
        cp "/etc/letsencrypt/live/$DOMAIN/chain.pem" /etc/nginx/ssl/
        
        # Reload nginx
        if command -v systemctl >/dev/null 2>&1; then
            systemctl reload nginx
        elif command -v docker-compose >/dev/null 2>&1; then
            docker-compose restart nginx
        fi
        
        echo "✅ Certificates renewed and nginx reloaded"
    fi
fi
EOF
    
    chmod +x /usr/local/bin/renew-certs.sh
    
    # Add to crontab (run twice daily)
    (crontab -l 2>/dev/null; echo "0 */12 * * * /usr/local/bin/renew-certs.sh >> /var/log/certbot-renewal.log 2>&1") | crontab -
    
    echo -e "${GREEN}✅ Auto-renewal configured${NC}"
}

# Function to create nginx test config (minimal)
create_test_config() {
    local domain=$1
    
    cat > /etc/nginx/sites-available/ssl-test << EOF
server {
    listen 80;
    server_name $domain;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files \$uri =404;
    }
    
    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name $domain;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    location / {
        return 200 'SSL is working!';
        add_header Content-Type text/plain;
    }
}
EOF
    
    ln -sf /etc/nginx/sites-available/ssl-test /etc/nginx/sites-enabled/
}

# Function to test nginx configuration
test_nginx_config() {
    echo -e "${YELLOW}🧪 Testing nginx configuration...${NC}"
    
    if nginx -t; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
        return 0
    else
        echo -e "${RED}❌ Nginx configuration is invalid${NC}"
        return 1
    fi
}

# Main setup function
main() {
    echo ""
    echo -e "${BLUE}Select SSL setup option:${NC}"
    echo "1) Let's Encrypt (Production - requires valid domain)"
    echo "2) Self-signed certificate (Development/Testing)"
    echo "3) Skip SSL setup (use existing certificates)"
    echo ""
    read -p "Enter choice [1-3]: " choice
    
    case $choice in
        1)
            echo ""
            read -p "Enter your domain name (e.g., api.yourdomain.com): " domain
            read -p "Enter your email address: " email
            
            if [ -z "$domain" ] || [ -z "$email" ]; then
                echo -e "${RED}❌ Domain and email are required${NC}"
                exit 1
            fi
            
            # Validate domain format
            if [[ ! $domain =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
                echo -e "${RED}❌ Invalid domain format${NC}"
                exit 1
            fi
            
            create_ssl_dirs
            
            # Check if certbot is installed
            if ! command_exists certbot; then
                install_certbot
            fi
            
            get_letsencrypt_cert "$domain" "$email"
            setup_auto_renewal
            export DOMAIN="$domain"  # For renewal script
            ;;
            
        2)
            echo ""
            read -p "Enter domain name for certificate (e.g., localhost): " domain
            domain=${domain:-localhost}
            
            create_ssl_dirs
            generate_self_signed "$domain"
            ;;
            
        3)
            echo -e "${YELLOW}⏭️  Skipping SSL setup${NC}"
            ;;
            
        *)
            echo -e "${RED}❌ Invalid choice${NC}"
            exit 1
            ;;
    esac
    
    # Create test nginx config if requested
    if [ "$choice" -eq 1 ] || [ "$choice" -eq 2 ]; then
        echo ""
        read -p "Create test nginx configuration? [y/N]: " create_test
        if [[ $create_test =~ ^[Yy]$ ]]; then
            create_test_config "$domain"
            test_nginx_config
        fi
    fi
    
    echo ""
    echo -e "${GREEN}🎉 SSL setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Update your docker-compose.yml to mount SSL certificates"
    echo "2. Update nginx.conf with your actual domain name"
    echo "3. Configure DNS to point to your server"
    echo "4. Test SSL configuration: https://www.ssllabs.com/ssltest/"
    echo ""
    echo -e "${YELLOW}SSL Certificate files:${NC}"
    echo "  - Certificate: /etc/nginx/ssl/fullchain.pem"
    echo "  - Private Key: /etc/nginx/ssl/privkey.pem"
    echo "  - Chain: /etc/nginx/ssl/chain.pem"
}

# Run main function
main "$@"