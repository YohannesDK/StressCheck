import requests
import random
import time
import argparse

# 🌍 Configuration
LOCAL_BACKEND_URL = "http://localhost:5000/api/update_bpm"
HEROKU_BACKEND_URL = "https://stresscheck-server-c4dba76a1545.herokuapp.com/api/update_bpm"

def send_mock_bpm(is_local: bool):
    backend_url = LOCAL_BACKEND_URL if is_local else HEROKU_BACKEND_URL
    print(f"🌍 Sending BPMs to: {backend_url}")

    while True:
        bpm = random.randint(60, 130)  # mock realistic heart rates
        try:
            response = requests.post(backend_url, json={"bpm": bpm})
            print(f"✅ Sent BPM {bpm}: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"Error sending BPM: {e}")

        time.sleep(2)  # Send a new BPM every 2 seconds

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Mock Heartbeat Sender for StressCheck")
    parser.add_argument(
        "--remote", 
        action="store_true", 
        help="Send BPMs to remote Heroku backend instead of local backend"
    )
    args = parser.parse_args()

    is_local = not args.remote  # Default is_local = True unless --remote is passed

    send_mock_bpm(is_local)

