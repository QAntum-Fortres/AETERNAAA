import math
import random
import time

# THIS IS THE GOD FUNCTION (Complexity > 20)
def calculate_global_entropy(bio_data_stream, market_data_stream, energy_data_stream):
    """Calculates the 'Sovereign Alignment Index' by cross‑referencing
    thousands of data points from Bio, Market, and Energy sectors.
    """
    total_entropy = 0.0
    anomalies = []

    # Layer 1: O(N^2) nested loops (slow in Python)
    for bio_point in bio_data_stream:
        # Defense programming: ensure keys exist
        hr = bio_point.get('hr', 70)
        oxy = bio_point.get('oxy', 0.98)
        
        b_val = (hr * 0.5) + (oxy * 2.0)
        
        for market_point in market_data_stream:
            price = market_point.get('price', 1000)
            vol = market_point.get('volume', 1)
            if vol == 0: vol = 1 # Avoid division by zero
            
            m_val = price / vol
            
            # Layer 2: Deep conditional maze
            if b_val > 50 and m_val < 0.001:
                battery = energy_data_stream.get('battery_level', 100)
                if battery < 20:
                    risk_factor = (b_val * m_val) / 0.5
                    anomalies.append(f"CRITICAL_DRAIN_EVENT_{risk_factor}")
                    total_entropy += risk_factor * 2.5
                else:
                    total_entropy += (b_val * m_val) * 0.1
            elif b_val < 20 and m_val > 0.05:
                # Add safety abs check before sqrt
                val_to_sqrt = max(0, b_val * m_val) 
                golden_ratio_check = math.sqrt(val_to_sqrt)
                if golden_ratio_check > 1.618:
                    total_entropy -= golden_ratio_check
                else:
                    total_entropy += 0.01
            else:
                noise = math.sin(b_val) * math.cos(m_val)
                total_entropy += abs(noise) * 0.001

    # Layer 3: Convergence
    final_score = 100 - min(max(total_entropy, 0), 100)
    return final_score, len(anomalies)
