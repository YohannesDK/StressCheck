import time
import requests
from bpm_reader import get_mock_bpm

# 📡 Config
BACKEND_API_URL = "http://localhost:5000/api/update_bpm"  # Update for production if needed

def send_bpm_to_server(bpm):
    """Send BPM data to the backend API."""
    payload = {
        "bpm": bpm,
        "timestamp": time.time()
    }
    try:
        response = requests.post(BACKEND_API_URL, json=payload)
        if response.status_code == 200:
            print(f"✅ Sent BPM: {bpm} at {time.strftime('%H:%M:%S')}")
        else:
            print(f"⚠️ Failed to send BPM. Status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Error sending BPM:", e)

def main():
    print("🚀 Heartbeat service started.")
    while True:
        bpm = get_mock_bpm()  # 🎯 Read from bpm_reader
        send_bpm_to_server(bpm)
        time.sleep(1)  # Send every 1 second

if __name__ == "__main__":
    main()
