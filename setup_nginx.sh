#!/bin/bash

# --- SCRIPT DE CONFIGURAÇÃO DINÂMICA DO NGINX (VERSÃO CORRIGIDA) ---

set -e # Encerra o script imediatamente se um comando falhar

# Obtém o nome da pasta do projeto
PROJECT_NAME=${PWD##*/}

# Obtém o caminho absoluto do diretório atual
PROJECT_DIR=$(pwd)

# Verifica se a pasta 'dist' existe
if [ ! -d "$PROJECT_DIR/dist" ]; then
    echo "Erro: A pasta 'dist' não foi encontrada."
    echo "Por favor, execute 'npm run build' antes de rodar este script."
    exit 1
fi

# Tenta obter o IP Público. Se falhar, usa um placeholder.
PUBLIC_IP=$(curl -s --connect-timeout 5 http://169.254.169.254/latest/meta-data/public-ipv4)

if [ -z "$PUBLIC_IP" ]; then
    echo "Aviso: Não foi possível obter o IP público automaticamente. Usando '_' como placeholder."
    echo "Você pode precisar editar o server_name manualmente depois."
    PUBLIC_IP="_"
fi

echo "Configurando Nginx para o projeto '$PROJECT_NAME' no IP: $PUBLIC_IP"

# Define o caminho para o novo arquivo de configuração
NGINX_CONFIG_FILE="/etc/nginx/sites-available/$PROJECT_NAME"

# Cria a configuração do Nginx
sudo tee "$NGINX_CONFIG_FILE" > /dev/null <<EOF
server {
    listen 80;
    server_name $PUBLIC_IP;

    root "$PROJECT_DIR/dist";
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

if [ ! -L "/etc/nginx/sites-enabled/$PROJECT_NAME" ]; then
    echo "Ativando o site..."
    sudo ln -s "$NGINX_CONFIG_FILE" /etc/nginx/sites-enabled/
fi

if [ -L "/etc/nginx/sites-enabled/default" ]; then
    echo "Removendo a configuração padrão do Nginx..."
    sudo rm /etc/nginx/sites-enabled/default
fi

if sudo nginx -t; then
    echo "Configuração do Nginx válida. A reiniciar o serviço..."
    sudo systemctl restart nginx
    echo "------"
    if [ "$PUBLIC_IP" != "_" ]; then
        echo "✅ Sucesso! O seu projeto deve estar disponível em: http://$PUBLIC_IP"
    else
        echo "✅ Sucesso! O Nginx foi reiniciado. Acesse pelo IP público da sua instância."
    fi
    echo "------"
else
    echo "------"
    echo "❌ Erro: Teste de configuração do Nginx falhou."
    echo "Verifique o arquivo: $NGINX_CONFIG_FILE e o log de erros do Nginx com 'sudo journalctl -u nginx'."
    echo "------"
fi