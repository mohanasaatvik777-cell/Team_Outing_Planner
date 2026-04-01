from flask import Flask, render_template, request, jsonify
from planner import generate_plans
import google.generativeai as genai
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit():
    data = request.json
    member = {
        'name': data.get('name'),
        'food_pref': data.get('food_pref'),
        'activity_pref': data.get('activity_pref'),
        'budget': 800
    }
    return jsonify({'status': 'ok', 'message': f"{member['name']} added!"})

@app.route('/api/set_key', methods=['POST'])
def set_key():
    data = request.json
    key = data.get('api_key', '').strip()
    if not key:
        return jsonify({'status': 'error', 'message': 'No key provided'})
    os.environ['GEMINI_API_KEY'] = key
    genai.configure(api_key=key)
    # Reload gemini_helper with new key
    import gemini_helper
    gemini_helper.GEMINI_API_KEY = key
    genai.configure(api_key=key)
    gemini_helper.model = genai.GenerativeModel("gemini-1.5-flash")
    return jsonify({'status': 'ok', 'message': 'API key set!'})

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json
    members = data.get('members', [])
    use_gemini = data.get('use_gemini', False)
    plans = generate_plans(members, use_gemini=use_gemini)
    return jsonify({'plans': plans})

if __name__ == '__main__':
    app.run(debug=True)
