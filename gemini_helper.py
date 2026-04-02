from google import genai
from google.genai import types
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None
    print("[Gemini] WARNING: GEMINI_API_KEY not set. AI features disabled.")


def fetch_restaurant_suggestion(venue_name, food_pref, budget_for_food, city="Hyderabad"):
    pref_label = {
        "veg": "pure vegetarian",
        "non_veg": "non-vegetarian",
        "mixed": "both vegetarian and non-vegetarian options"
    }.get(food_pref, "both vegetarian and non-vegetarian options")

    prompt = f"""
You are a Hyderabad food expert. Suggest ONE real restaurant near or on the way to "{venue_name}" in {city}, India.

Requirements:
- Food preference: {pref_label}
- Budget: around Rs.{budget_for_food} per person
- Must be a real, well-known place in Hyderabad
- Should be near or on the route to {venue_name}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{{
  "name": "Restaurant Name",
  "type": "Cuisine Type",
  "avg_cost": 250,
  "location": "Area/Locality, Hyderabad",
  "google_maps_hint": "Restaurant Name, Area, Hyderabad",
  "dishes": [
    {{"item": "Dish Name", "price": 80}},
    {{"item": "Dish Name", "price": 60}},
    {{"item": "Dish Name", "price": 70}},
    {{"item": "Dish Name", "price": 50}}
  ],
  "emoji": "food emoji",
  "why": "One line reason why this fits the team"
}}
"""
    try:
        if not client:
            return None
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        text = response.text.strip()
        text = re.sub(r"```json|```", "", text).strip()
        data = json.loads(text)
        data['avg_cost'] = min(data.get('avg_cost', budget_for_food), budget_for_food)
        return data
    except Exception as e:
        print(f"[Gemini] Error fetching restaurant for {venue_name}: {e}")
        return None


def fetch_venue_details(venue_name, city="Hyderabad"):
    prompt = f"""
You are a Hyderabad travel expert. Give details about "{venue_name}" in {city}, India.

Respond ONLY with a valid JSON object (no markdown, no extra text):
{{
  "exact_location": "Full address or area, Hyderabad",
  "google_maps_hint": "Venue Name, Area, Hyderabad",
  "best_time": "e.g. 9 AM - 12 PM",
  "pro_tip": "One practical tip for a group visit",
  "nearby_landmark": "Nearest famous landmark"
}}
"""
    try:
        if not client:
            return None
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        text = response.text.strip()
        text = re.sub(r"```json|```", "", text).strip()
        return json.loads(text)
    except Exception as e:
        print(f"[Gemini] Error fetching venue details for {venue_name}: {e}")
        return None


def fetch_restaurant_suggestion(venue_name, food_pref, budget_for_food, city="Hyderabad"):
    """
    Ask Gemini to suggest a real restaurant near the venue with dishes and location.
    Returns a dict with name, type, avg_cost, dishes, location, emoji.
    """
    pref_label = {
        "veg": "pure vegetarian",
        "non_veg": "non-vegetarian",
        "mixed": "both vegetarian and non-vegetarian options"
    }.get(food_pref, "both vegetarian and non-vegetarian options")

    prompt = f"""
You are a Hyderabad food expert. Suggest ONE real restaurant near or on the way to "{venue_name}" in {city}, India.

Requirements:
- Food preference: {pref_label}
- Budget: around ₹{budget_for_food} per person
- Must be a real, well-known place in Hyderabad
- Should be near or on the route to {venue_name}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{{
  "name": "Restaurant Name",
  "type": "Cuisine Type",
  "avg_cost": 250,
  "location": "Area/Locality, Hyderabad",
  "google_maps_hint": "Restaurant Name, Area, Hyderabad",
  "dishes": [
    {{"item": "Dish Name", "price": 80}},
    {{"item": "Dish Name", "price": 60}},
    {{"item": "Dish Name", "price": 70}},
    {{"item": "Dish Name", "price": 50}}
  ],
  "emoji": "🍛",
  "why": "One line reason why this fits the team"
}}
"""
    try:
        if not model:
            return None
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Strip markdown code fences if present
        text = re.sub(r"```json|```", "", text).strip()
        data = json.loads(text)
        # Clamp cost to budget
        data['avg_cost'] = min(data.get('avg_cost', budget_for_food), budget_for_food)
        return data
    except Exception as e:
        print(f"[Gemini] Error fetching restaurant for {venue_name}: {e}")
        return None


def fetch_venue_details(venue_name, city="Hyderabad"):
    """
    Ask Gemini for enriched venue details — exact location, tips, best time to visit.
    """
    prompt = f"""
You are a Hyderabad travel expert. Give details about "{venue_name}" in {city}, India.

Respond ONLY with a valid JSON object (no markdown, no extra text):
{{
  "exact_location": "Full address or area, Hyderabad",
  "google_maps_hint": "Venue Name, Area, Hyderabad",
  "best_time": "e.g. 9 AM - 12 PM",
  "pro_tip": "One practical tip for a group visit",
  "nearby_landmark": "Nearest famous landmark"
}}
"""
    try:
        if not model:
            return None
        response = model.generate_content(prompt)
        text = response.text.strip()
        text = re.sub(r"```json|```", "", text).strip()
        return json.loads(text)
    except Exception as e:
        print(f"[Gemini] Error fetching venue details for {venue_name}: {e}")
        return None
