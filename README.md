# System Metrics Dashboard

A lightweight web dashboard for the CLANE subject project. It displays CPU, memory (RAM), and disk usage and refreshes the readings automatically.

## Technologies
- HTML, CSS, JavaScript
- Python and Flask
- psutil for system metrics
- Docker for containerized deployment

## Run with Docker (required)

1. Install and start Docker Desktop.
2. Open a terminal in this project folder.
3. Build the image:

   ```bash
   docker build -t system-metrics-dashboard .
   ```

4. Run the container:

   ```bash
   docker run -d --name metrics-dashboard -p 5000:5000 system-metrics-dashboard
   ```

5. Open http://localhost:5000 in your browser.
6. Check the container with:

   ```bash
   docker ps
   ```

## Useful commands

Stop the container:
```bash
docker stop metrics-dashboard
```

Start it again:
```bash
docker start metrics-dashboard
```

Remove it:
```bash
docker rm -f metrics-dashboard
```

## Run locally without Docker (optional)

Install Python, then run:
```bash
pip install -r requirements.txt
python app.py
```
Open http://localhost:5000.

## Important note about Docker metrics
The metrics are collected by `psutil` from the environment visible to the Python process. When the app runs in Docker, readings may reflect the container's visible environment rather than the full Windows host. This is a small educational monitoring demo, not a production monitoring agent.
