from flask import Flask, jsonify, render_template
import psutil
import platform
import time
from datetime import datetime, timezone

app = Flask(__name__)
STARTED_AT = time.time()

@app.route("/")
def dashboard():
    return render_template("index.html")

@app.route("/api/metrics")
def metrics():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/").percent
    cpu = psutil.cpu_percent(interval=0.2)
    boot_time = psutil.boot_time()

    return jsonify({
        "cpu": round(cpu, 1),
        "memory": {
            "percent": round(memory.percent, 1),
            "used_gb": round(memory.used / (1024 ** 3), 2),
            "total_gb": round(memory.total / (1024 ** 3), 2)
        },
        "disk": {
            "percent": round(disk.percent, 1),
            "used_gb": round(disk.used / (1024 ** 3), 2),
            "total_gb": round(disk.total / (1024 ** 3), 2)
        },
        "system": platform.system(),
        "hostname": platform.node() or "Docker container",
        "uptime_seconds": int(time.time() - STARTED_AT),
        "boot_time": datetime.fromtimestamp(boot_time, tz=timezone.utc).isoformat(),
        "updated_at": datetime.now().astimezone().isoformat(timespec="seconds")
    })

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

import os
if __name__ == "__main__":
    # Listen on all interfaces so Docker can publish the port.
    #app.run(host="0.0.0.0", port=5000, debug=False)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)
