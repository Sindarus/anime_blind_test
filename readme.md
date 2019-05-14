# Anime Blind Test

# Installation
```bash
# Install dependancies
sudo apt install python3 python3-pip virtualenv

# Create virtualenv for this project
virtualenv venv -p python3
# Activate the newly created virtualenv
. venv/bin/activate
# Install required python modules
pip install -r requirements-src.txt
```

# Launching the development server
```bash
./start_server.sh
```

# Docker support
```bash
# Build image
docker build -t anime-blind-test .

# Run server
docker run -d --rm -p 5000:5000 anime-blind-test 
```
