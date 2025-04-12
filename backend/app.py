from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import time
import threading
import json

app = Flask(__name__)
CORS(app)

# In-memory BPM storage
latest_bpm = {
    "value": None,
    "timestamp": None
}

# Frontend fetches BPM using SSE
@app.route('/api/stream_bpm')
def stream_bpm():
    def event_stream():
        last_value = None
        while True:
            if latest_bpm["value"] != last_value:
                data = json.dumps({
                    "bpm": latest_bpm["value"],
                    "timestamp": latest_bpm["timestamp"]
                })
                yield f"data: {data}\n\n"
                last_value = latest_bpm["value"]
            time.sleep(0.5)
    return Response(event_stream(), mimetype="text/event-stream")

# Bluetooth reader or mock POSTs BPM here
@app.route('/api/update_bpm', methods=['POST'])
def update_bpm():
    data = request.json
    bpm = data.get('bpm')

    if bpm is None:
        return jsonify({"error": "Missing bpm value"}), 400

    latest_bpm["value"] = bpm
    latest_bpm["timestamp"] = time.time()
    return jsonify({"message": "BPM updated successfully!"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

