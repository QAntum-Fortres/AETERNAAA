"""
Stripe Webhook Handler - QAntum Sovereign SaaS
==============================================
Handles payment confirmations and bridges them to the Rust Economy Core.
"""

import os
import stripe
import requests
import logging
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import io

# Import Services (The "Soul")
from services.nexus_logic import calculate_global_entropy
from services.scribe import generate_certificate_buffer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "sk_test_mock")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")
# The Rust server where credits are actually minted
RUST_ECONOMY_URL = os.environ.get("RUST_ECONOMY_URL", "http://localhost:8890")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing for Frontend

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "active", 
        "bridge": "Stripe -> QAntum Core",
        "modules": ["NexusLogic", "Scribe"]
    })

# --- NEW: NEXUS LOGIC ENDPOINT ---
@app.route('/api/entropy', methods=['POST'])
def get_entropy():
    """
    Calculates entropy based on posted User Bio/Market data.
    """
    data = request.json or {}
    
    # Robust extraction with defaults
    bio_stream = data.get('bio_data', [{'hr': 70, 'oxy': 0.98}])
    mkt_stream = data.get('market_data', [{'price': 1000, 'volume': 10}])
    nrg_stream = data.get('energy_data', {'battery_level': 100})
    
    score, anomalies = calculate_global_entropy(bio_stream, mkt_stream, nrg_stream)
    
    return jsonify({
        "sovereign_alignment_index": score,
        "anomaly_count": anomalies,
        "status": "OPTIMAL" if score > 80 else "WARNING"
    })

# --- NEW: SCRIBE CERTIFICATE ENDPOINT ---
@app.route('/api/certificate', methods=['POST'])
def create_certificate():
    """
    Generates a PDF certificate on the fly.
    """
    data = request.json or {}
    user = data.get('user', 'GUEST_COMMANDER')
    entries = data.get('entries', [{'action': 'SYSTEM_INIT', 'timestamp': '2026-01-01'}])
    
    try:
        pdf_bytes = generate_certificate_buffer(entries, user)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'sovereign_cert_{user}.pdf'
        )
    except Exception as e:
        logger.error(f"Certificate generation failed: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = None
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            event = stripe.Event.construct_from(request.json, stripe.api_key)

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            user_id = session.metadata.get('userId')
            tier = session.metadata.get('tier')
            credits = session.metadata.get('credits')

            logger.info(f"💰 PAYMENT SUCCESS: User {user_id}, Tier: {tier}, Credits: {credits}")
            
            # Bridge to Rust/QAntum Core
            try:
                requests.post(f"{RUST_ECONOMY_URL}/api/mint_credits", json={
                    "user_id": user_id,
                    "amount": int(credits),
                    "source": f"Stripe_{tier}"
                }, timeout=5)
                logger.info("✅ Credits bridged to Rust Logic Substrate.")
            except Exception as e:
                logger.error(f"❌ Failed to bridge credits: {e}")

        return jsonify(success=True)

    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return jsonify(error=str(e)), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    logger.info(f"🛰️ QAntum Wealth Bridge active on port {port}")
    app.run(host='0.0.0.0', port=port)
