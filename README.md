# Run in the local machine
yarn next dev -H 0.0.0.0 -p 3000

# Docker Build and Deploy
docker compose build
docker tag web-portofolio-image mathintosh/portofolioweb:<tag>
docker login // if necessary
docker push mathintosh/portofolioweb:<tag>

