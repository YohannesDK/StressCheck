from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from your React frontend

@app.route('/api/heartbeat')
def heartbeat():
    # For now just send fake heart rate
    import random
    bpm = random.randint(60, 150)
    return jsonify({"bpm": bpm})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
