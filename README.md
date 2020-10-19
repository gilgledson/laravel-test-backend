# Sobre o projeto #

Projeto de teste de aptidão em laravel e vuejs

# Instalação do backend #

 *  Configurações banco de dados no arquivo .env
 * Instalar dependências do composer
    - composer install
 * instalando laravel passport
    - php artisan passport:install
 * criando o banco de dados
    - php artisan migrate:fresh --seed

# Instalação do frontend

  * instalação de dependencias via npm
    - npm install
  * Configurações .env
    - renomear .env.example para .env
    - no .env alterar BASE_URL_API para a url da api
  * executando projeto
    - npm run dev -- -spa

# informações de login
 
 * Email
    - admin@admin.com
 * Senha
    - 123456