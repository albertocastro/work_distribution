docker rmi -f node
docker build --no-cache -t node .
docker-compose down -d
docker-compose up -d