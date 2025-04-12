import requests
import time
import argparse
import asyncio
import bpm_reader

# 🌍 Configuration
LOCAL_BACKEND_URL = "http://localhost:5000/api/update_bpm"
HEROKU_BACKEND_URL = "https://stresscheck-server-c4dba76a1545.herokuapp.com/api/update_bpm"

async def send_bpm_periodically(is_local: bool, use_mock: bool):
    backend_url = LOCAL_BACKEND_URL if is_local else HEROKU_BACKEND_URL
    print(f"🌍 Sending BPMs to: {backend_url} (mock={use_mock})")

    while True:
        if use_mock:
            bpm = bpm_reader.get_mock_bpm()
        else:
            bpm = bpm_reader.get_polar_bpm()

            if bpm is None:
                print("❓ No Polar BPM yet, skipping send...")
                await asyncio.sleep(2)
                continue

        try:
            response = requests.post(backend_url, json={"bpm": bpm})
            print(f"✅ Sent BPM {bpm}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error sending BPM: {e}")

        await asyncio.sleep(5)  # Wait 5 seconds between sends

async def main():
    parser = argparse.ArgumentParser(description="StressCheck Heartbeat Sender")
    parser.add_argument("--remote", action="store_true", help="Send BPMs to remote Heroku backend instead of local backend")
    parser.add_argument("--mock", action="store_true", help="Use mock BPM values instead of real Polar device")
    args = parser.parse_args()

    is_local = not args.remote
    use_mock = args.mock

    tasks = []

    if not use_mock:
        # Start connecting to Polar device (background task)
        tasks.append(bpm_reader.connect_to_polar())

    # Start sending BPM periodically
    tasks.append(send_bpm_periodically(is_local, use_mock))

    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())


