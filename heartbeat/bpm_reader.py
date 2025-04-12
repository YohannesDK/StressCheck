import random
import asyncio
from bleak import BleakScanner, BleakClient

# UUIDs for Bluetooth Heart Rate Service
HR_SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb"
HR_CHARACTERISTIC_UUID = "00002a37-0000-1000-8000-00805f9b34fb"

# Internal state
_mock_current_bpm = random.randint(65, 75)  # Start somewhere calm
_latest_polar_bpm = None
_client = None

async def connect_to_polar():
    global _client

    print("🔍 Scanning for Polar H9...")
    devices = await BleakScanner.discover()
    polar_device = None

    for device in devices:
        if "Polar" in (device.name or ""):
            polar_device = device
            break

    if not polar_device:
        print("❌ Polar H9 not found! Make sure it is active and close by.")
        return

    _client = BleakClient(polar_device.address)
    await _client.connect()
    print(f"✅ Connected to {polar_device.name}")

    await _client.start_notify(HR_CHARACTERISTIC_UUID, handle_heart_rate)

async def handle_heart_rate(sender, data):
    global _latest_polar_bpm
    heart_rate = data[1]
    _latest_polar_bpm = heart_rate
    print(f"💓 Live Polar BPM: {_latest_polar_bpm}")

def get_polar_bpm():
    """Returns the latest live BPM from Polar (could be None at the start)."""
    return _latest_polar_bpm

def get_mock_bpm():
    """Generate a more realistic BPM value between 60 and 130."""
    global _mock_current_bpm

    delta = random.choice([-2, -1, 0, 1, 2])
    _mock_current_bpm += delta
    _mock_current_bpm = max(60, min(130, _mock_current_bpm))

    return _mock_current_bpm
