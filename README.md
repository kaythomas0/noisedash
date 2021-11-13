# Noisedash

Self-hostable web tool for generating ambient noises.

![Noisedash](./.github/noisedash-screenshot-1.jpg)

# Features

* Generate and customize ambient noises and user-uploadable samples
* Save "noise profiles" so you can easily switch between your created soundscapes
* Fine-tune your noises with audio processing tools like filters, LFOs, and effects
* Upload audio samples (e.g rain, wind, thunder) to combine with your generated noises
* Use admin tools to manage multiple users
* Mobile friendly

# Installation

## Docker

Requires docker and docker-compose

* Download the provided [docker-compose.yml file](https://github.com/KevinThomas0/noisedash/blob/main/docker-compose.yml)
* In the same directory as the docker-compose file, created a folder called `config`, and inside it, put the provided [config file](https://github.com/KevinThomas0/noisedash/blob/main/config/default.json)
* Edit the config file to your preference
* Bring the container up:

``` bash
docker-compose up -d
```

## From Source

Requires node 14 and npm

* Clone the repo:

``` bash
git clone https://github.com/KevinThomas0/noisedash.git
cd noisedash
```

* Edit `config/default.json` to your preference
* Install required packages and build the app:

``` bash
npm install
NODE_ENV=production npm run build
```

* The build files will be put into a directory called `dist`
* Run the server and serve static files:

``` bash
npm run server-prod
```

# Contributing

See [CONTRIBUTING.md](https://github.com/KevinThomas0/noisedash/blob/main/CONTRIBUTING.md)
