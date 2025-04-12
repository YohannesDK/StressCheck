import random

def get_garmin_bpm():
    """Placeholder for actual Garmin BPM reading.
    This function should interface with the Garmin device to get the BPM.
    """
    return


# Internal state
_current_bpm = random.randint(65, 75)  # Start somewhere calm
def get_mock_bpm():
    """Temporary: generate a more realistic BPM value between 60 and 130.
    BPM varies slowly, like a real heart rate under stress/excitement.
    """
    global _current_bpm

    # Randomly decide to increase or decrease a little
    delta = random.choice([-2, -1, 0, 1, 2])
    
    _current_bpm += delta

    # Clamp between 60 and 130
    _current_bpm = max(60, min(130, _current_bpm))

    return _current_bpm