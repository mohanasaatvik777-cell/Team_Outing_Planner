import random

VENUES = [
    {"name": "Ramoji Film City", "distance_km": 30, "type": "entertainment", "entry_fee": 350, "food": {"veg": True, "non_veg": True}, "description": "World's largest film studio complex with rides, shows & gardens.", "emoji": "🎬", "rating": 4.5},
    {"name": "Ananthagiri Hills", "distance_km": 38, "type": "nature", "entry_fee": 0, "food": {"veg": True, "non_veg": True}, "description": "Lush green hills with trekking trails and scenic viewpoints.", "emoji": "🏔️", "rating": 4.3},
    {"name": "Hussain Sagar Lake & Lumbini Park", "distance_km": 5, "type": "leisure", "entry_fee": 60, "food": {"veg": True, "non_veg": True}, "description": "Iconic lake with boating, Buddha statue & evening light shows.", "emoji": "🌊", "rating": 4.2},
    {"name": "Mrugavani National Park", "distance_km": 25, "type": "nature", "entry_fee": 40, "food": {"veg": True, "non_veg": False}, "description": "Serene wildlife sanctuary perfect for nature walks & picnics.", "emoji": "🌿", "rating": 4.1},
    {"name": "Chilkur Balaji & Osman Sagar", "distance_km": 28, "type": "spiritual_leisure", "entry_fee": 0, "food": {"veg": True, "non_veg": False}, "description": "Peaceful temple visit followed by serene lakeside relaxation.", "emoji": "🛕", "rating": 4.0},
    {"name": "KBR National Park", "distance_km": 8, "type": "nature", "entry_fee": 20, "food": {"veg": True, "non_veg": False}, "description": "Urban forest in the heart of Hyderabad — perfect for morning walks and bird watching.", "emoji": "🌳", "rating": 4.2},
    {"name": "Golconda Fort", "distance_km": 11, "type": "cultural", "entry_fee": 35, "food": {"veg": True, "non_veg": True}, "description": "Iconic 16th-century fort with stunning architecture, sound & light show in the evening.", "emoji": "🏰", "rating": 4.4},
    {"name": "Nehru Zoological Park", "distance_km": 10, "type": "leisure", "entry_fee": 80, "food": {"veg": True, "non_veg": True}, "description": "One of India's largest zoos with over 1,500 animals and a toy train ride.", "emoji": "🦁", "rating": 4.1},
    {"name": "Durgam Cheruvu (Secret Lake)", "distance_km": 15, "type": "leisure", "entry_fee": 50, "food": {"veg": True, "non_veg": True}, "description": "A hidden gem lake surrounded by rocky hills — great for boating and sunset views.", "emoji": "🏞️", "rating": 4.3},
    {"name": "Shilparamam Arts Village", "distance_km": 18, "type": "cultural", "entry_fee": 30, "food": {"veg": True, "non_veg": True}, "description": "Open-air cultural village showcasing tribal art, crafts, and folk performances.", "emoji": "🎨", "rating": 4.0},
    {"name": "Botanical Garden (CSIR-IICT)", "distance_km": 20, "type": "wellness", "entry_fee": 20, "food": {"veg": True, "non_veg": False}, "description": "Sprawling garden with rare plant species — ideal for a calm, refreshing outing.", "emoji": "🌸", "rating": 3.9},
    {"name": "Birla Mandir & Surroundings", "distance_km": 6, "type": "spiritual", "entry_fee": 0, "food": {"veg": True, "non_veg": False}, "description": "Stunning white marble temple atop a hill with panoramic city views.", "emoji": "⛩️", "rating": 4.3},
    {"name": "Sanjeevaiah Park", "distance_km": 7, "type": "leisure", "entry_fee": 25, "food": {"veg": True, "non_veg": True}, "description": "Large riverside park with open lawns, boating, and picnic spots.", "emoji": "🌻", "rating": 3.8},
    {"name": "Charminar & Laad Bazaar", "distance_km": 12, "type": "cultural", "entry_fee": 25, "food": {"veg": True, "non_veg": True}, "description": "Hyderabad's iconic monument with vibrant street food and bangle shopping nearby.", "emoji": "🕌", "rating": 4.5},
    {"name": "Salar Jung Museum", "distance_km": 13, "type": "cultural", "entry_fee": 20, "food": {"veg": True, "non_veg": False}, "description": "One of India's largest museums with rare antiques, art, and artefacts.", "emoji": "🏛️", "rating": 4.2},
    {"name": "Osman Sagar (Gandipet Lake)", "distance_km": 30, "type": "leisure", "entry_fee": 0, "food": {"veg": True, "non_veg": True}, "description": "Scenic reservoir with open spaces, perfect for a relaxed group picnic.", "emoji": "💧", "rating": 4.0},
    {"name": "Snow World Hyderabad", "distance_km": 9, "type": "adventure", "entry_fee": 400, "food": {"veg": True, "non_veg": True}, "description": "India's largest snow theme park — snow slides, igloo, and ice sculptures.", "emoji": "❄️", "rating": 4.1},
    {"name": "Inorbit Mall + Fun Zone", "distance_km": 17, "type": "entertainment", "entry_fee": 0, "food": {"veg": True, "non_veg": True}, "description": "Shopping, gaming arcade, bowling, and food court — all under one roof.", "emoji": "🎳", "rating": 3.9},
]

# Each dish has item name + price so UI can show price beside each dish
# avg_cost = total per person budget for this restaurant
# Only dishes whose price <= avg_cost are shown (filtered in generate_plans)
FOOD_OPTIONS = {
    "veg_only": [
        {"name": "Chutneys Restaurant", "avg_cost": 250, "type": "South Indian Veg", "emoji": "🥗", "location": "Banjara Hills, Hyderabad", "google_maps_hint": "Chutneys Restaurant Banjara Hills Hyderabad",
         "dishes": [{"item": "Masala Dosa", "price": 80}, {"item": "Idli Sambar", "price": 60}, {"item": "Pesarattu", "price": 70}, {"item": "Filter Coffee", "price": 40}]},
        {"name": "Govinda's Pure Veg", "avg_cost": 200, "type": "Pure Veg Thali", "emoji": "🍱", "location": "Abids, Hyderabad", "google_maps_hint": "Govindas Pure Veg Abids Hyderabad",
         "dishes": [{"item": "Full Veg Thali", "price": 120}, {"item": "Dal Makhani", "price": 90}, {"item": "Paneer Butter Masala", "price": 110}, {"item": "Gulab Jamun", "price": 40}]},
        {"name": "Saravanaa Bhavan", "avg_cost": 220, "type": "South Indian Veg", "emoji": "🍛", "location": "Ameerpet, Hyderabad", "google_maps_hint": "Saravanaa Bhavan Ameerpet Hyderabad",
         "dishes": [{"item": "Rava Dosa", "price": 90}, {"item": "Pongal", "price": 70}, {"item": "Sambar Vada", "price": 60}, {"item": "Kesari", "price": 50}]},
        {"name": "Cream Stone + Snacks", "avg_cost": 120, "type": "Desserts & Light Bites", "emoji": "🍦", "location": "Jubilee Hills, Hyderabad", "google_maps_hint": "Cream Stone Jubilee Hills Hyderabad",
         "dishes": [{"item": "Custom Ice Cream", "price": 60}, {"item": "Waffle", "price": 80}, {"item": "Cold Coffee", "price": 70}, {"item": "Brownie Sundae", "price": 90}]},
        {"name": "Minerva Coffee Shop", "avg_cost": 180, "type": "Veg Andhra Meals", "emoji": "🍚", "location": "Abids, Hyderabad", "google_maps_hint": "Minerva Coffee Shop Abids Hyderabad",
         "dishes": [{"item": "Andhra Meals", "price": 100}, {"item": "Gongura Pachadi", "price": 40}, {"item": "Rasam Rice", "price": 60}, {"item": "Payasam", "price": 50}]},
    ],
    "non_veg": [
        {"name": "Paradise Biryani", "avg_cost": 300, "type": "Hyderabadi Biryani", "emoji": "🍛", "location": "MG Road, Secunderabad, Hyderabad", "google_maps_hint": "Paradise Biryani MG Road Secunderabad Hyderabad",
         "dishes": [{"item": "Chicken Dum Biryani", "price": 180}, {"item": "Mutton Biryani", "price": 220}, {"item": "Mirchi Ka Salan", "price": 60}, {"item": "Double Ka Meetha", "price": 80}]},
        {"name": "Bawarchi Restaurant", "avg_cost": 280, "type": "Mixed Cuisine", "emoji": "🍖", "location": "RTC Cross Roads, Hyderabad", "google_maps_hint": "Bawarchi Restaurant RTC Cross Roads Hyderabad",
         "dishes": [{"item": "Chicken Biryani", "price": 170}, {"item": "Keema Naan", "price": 90}, {"item": "Chicken 65", "price": 130}, {"item": "Phirni", "price": 70}]},
        {"name": "Shah Ghouse Cafe", "avg_cost": 260, "type": "Hyderabadi Non-Veg", "emoji": "🥘", "location": "Tolichowki, Hyderabad", "google_maps_hint": "Shah Ghouse Cafe Tolichowki Hyderabad",
         "dishes": [{"item": "Haleem", "price": 120}, {"item": "Nihari", "price": 130}, {"item": "Paya Soup", "price": 80}, {"item": "Sheer Khurma", "price": 60}]},
        {"name": "Cafe Bahar", "avg_cost": 240, "type": "Irani Cafe", "emoji": "☕", "location": "Basheerbagh, Hyderabad", "google_maps_hint": "Cafe Bahar Basheerbagh Hyderabad",
         "dishes": [{"item": "Irani Chai", "price": 30}, {"item": "Osmania Biscuits", "price": 40}, {"item": "Chicken Samosa", "price": 50}, {"item": "Bun Maska", "price": 25}]},
        {"name": "Local Dhaba Spread", "avg_cost": 200, "type": "Dhaba Style", "emoji": "🍽️", "location": "Near Venue, Hyderabad", "google_maps_hint": "Dhaba near venue Hyderabad",
         "dishes": [{"item": "Butter Chicken", "price": 120}, {"item": "Dal Tadka", "price": 80}, {"item": "Tandoori Roti", "price": 20}, {"item": "Lassi", "price": 50}]},
        {"name": "Hyderabad House", "avg_cost": 270, "type": "Biryani & Kebabs", "emoji": "🍢", "location": "Banjara Hills, Hyderabad", "google_maps_hint": "Hyderabad House Banjara Hills Hyderabad",
         "dishes": [{"item": "Chicken Biryani", "price": 180}, {"item": "Seekh Kebab", "price": 120}, {"item": "Raita", "price": 40}, {"item": "Khubani Ka Meetha", "price": 80}]},
    ],
    "mixed": [
        {"name": "Ohri's Jiva Imperia", "avg_cost": 350, "type": "Multi-Cuisine Buffet", "emoji": "🍽️", "location": "Lakdikapul, Hyderabad", "google_maps_hint": "Ohris Jiva Imperia Lakdikapul Hyderabad",
         "dishes": [{"item": "Live Pasta Station", "price": 80}, {"item": "Tandoori Platter", "price": 120}, {"item": "Dessert Counter", "price": 90}, {"item": "Mocktails", "price": 60}]},
        {"name": "Eat Street (Necklace Road)", "avg_cost": 200, "type": "Open-Air Food Court", "emoji": "🌆", "location": "Necklace Road, Hyderabad", "google_maps_hint": "Eat Street Necklace Road Hyderabad",
         "dishes": [{"item": "Hyderabadi Snacks", "price": 60}, {"item": "Grilled Corn", "price": 40}, {"item": "Veg & Non-Veg Rolls", "price": 70}, {"item": "Fresh Lime Soda", "price": 30}]},
        {"name": "Absolute Barbecues (AB's)", "avg_cost": 480, "type": "Live Grill Buffet", "emoji": "🥩", "location": "Kondapur, Hyderabad", "google_maps_hint": "Absolute Barbecues Kondapur Hyderabad",
         "dishes": [{"item": "Grilled Chicken", "price": 150}, {"item": "Paneer Tikka", "price": 120}, {"item": "Veg Kebab Platter", "price": 110}, {"item": "Ice Cream Bar", "price": 100}]},
        {"name": "Zega - Novotel", "avg_cost": 400, "type": "International Buffet", "emoji": "🌍", "location": "HICC, Madhapur, Hyderabad", "google_maps_hint": "Zega Novotel Madhapur Hyderabad",
         "dishes": [{"item": "Sushi Counter", "price": 120}, {"item": "Grilled Fish", "price": 130}, {"item": "Veg Mezze Platter", "price": 90}, {"item": "Chocolate Fountain", "price": 60}]},
        {"name": "Street Food Stalls", "avg_cost": 150, "type": "Local Street Food", "emoji": "🍢", "location": "Old City / Near Venue, Hyderabad", "google_maps_hint": "Street food Hyderabad",
         "dishes": [{"item": "Pani Puri", "price": 30}, {"item": "Chicken Roll", "price": 60}, {"item": "Mirchi Bajji", "price": 25}, {"item": "Sugarcane Juice", "price": 35}]},
        {"name": "Hyderabad House", "avg_cost": 300, "type": "Biryani & Veg Options", "emoji": "🍛", "location": "Banjara Hills, Hyderabad", "google_maps_hint": "Hyderabad House Banjara Hills Hyderabad",
         "dishes": [{"item": "Chicken Biryani", "price": 180}, {"item": "Veg Biryani", "price": 140}, {"item": "Raita", "price": 40}, {"item": "Khubani Ka Meetha", "price": 80}]},
    ]
}

ACTIVITIES = {
    "adventure": ["Rock Climbing 🧗", "Zip-lining 🪂", "ATV Rides 🏍️", "Rappelling 🪢", "Trekking 🥾"],
    "nature": ["Nature Walk 🚶", "Bird Watching 🦜", "Photography Trail 📸", "Waterfall Hike 💧", "Stargazing 🌟"],
    "entertainment": ["Live Shows 🎭", "Studio Tour 🎬", "Theme Rides 🎡", "Magic Shows 🪄", "Comedy Night 😂"],
    "leisure": ["Boating 🚣", "Sunset Viewing 🌅", "Group Games 🎮", "Picnic 🧺", "Hammock Relaxing 🌴"],
    "spiritual_leisure": ["Temple Visit 🙏", "Meditation 🧘", "Lakeside Picnic 🧺", "Chanting Session 🔔"],
    "spiritual": ["Temple Darshan 🛕", "Meditation Walk 🧘", "Aarti Ceremony 🪔", "Heritage Prayer 🙏"],
    "food_tour": ["Street Food Crawl 🍢", "Biryani Trail 🍛", "Chaat Hopping 🥙", "Dessert Tour 🍮", "Local Market Visit 🛒"],
    "sports": ["Cricket Match 🏏", "Badminton Tournament 🏸", "Football 5-a-side ⚽", "Volleyball 🏐", "Tug of War 🪢"],
    "cultural": ["Museum Tour 🏛️", "Heritage Walk 🚶", "Craft Workshop 🎨", "Folk Dance Show 💃", "Art Gallery Visit 🖼️"],
    "photography": ["Golden Hour Shoot 🌅", "Street Photography 📷", "Nature Macro Shots 🌸", "Group Portrait Session 🤳", "Drone View Spot 🚁"],
    "wellness": ["Yoga Session 🧘", "Spa & Massage 💆", "Meditation Retreat 🌿", "Breathing Workshop 🌬️", "Nature Sound Bath 🎵"],
}

BUDGET = 800
TRANSPORT_NEAR = 80
TRANSPORT_FAR = 120
MISC = 50

AI_RECOMMENDATION_TEMPLATES = [
    "We strongly recommend {venue} for your team outing. It's {distance_km} km from your office, rated {rating}/5, and fits perfectly within your Rs.800 budget at just Rs.{total}/person. Pair it with {food} for a complete experience.",
    "Our top pick is {venue} — a {rating}-star destination just {distance_km} km away. At Rs.{total}/person, your team saves Rs.{savings} each. {food} nearby makes it a full-day plan worth every rupee.",
    "Go for {venue}. It checks all the boxes — within 40 km, budget-friendly at Rs.{total}/person, and highly rated at {rating}/5. {food} is the ideal food stop to round off the day.",
]

def analyze_preferences(members):
    has_veg = any(m['food_pref'] in ['veg', 'both'] for m in members)
    has_non_veg = any(m['food_pref'] in ['non_veg', 'both'] for m in members)
    activity_votes = {}
    for m in members:
        pref = m.get('activity_pref', 'leisure')
        activity_votes[pref] = activity_votes.get(pref, 0) + 1
    top_activity = max(activity_votes, key=activity_votes.get)
    return {
        'has_veg': has_veg,
        'has_non_veg': has_non_veg,
        'is_mixed': has_veg and has_non_veg,
        'top_activity': top_activity,
        'activity_votes': activity_votes
    }

def pick_food(prefs, max_food_budget, used_food_names):
    if prefs['is_mixed']:
        pool = FOOD_OPTIONS['mixed']
    elif prefs['has_non_veg']:
        pool = FOOD_OPTIONS['non_veg']
    else:
        pool = FOOD_OPTIONS['veg_only']

    affordable = [f for f in pool if f['avg_cost'] <= max_food_budget and f['name'] not in used_food_names]
    if not affordable:
        affordable = [f for f in pool if f['avg_cost'] <= max_food_budget]
    if not affordable:
        all_options = FOOD_OPTIONS['veg_only'] + FOOD_OPTIONS['non_veg'] + FOOD_OPTIONS['mixed']
        affordable = sorted(all_options, key=lambda f: f['avg_cost'])
    chosen = random.choice(affordable)
    # Filter dishes to only those whose price <= avg_cost (within per-person food budget)
    filtered_dishes = [d for d in chosen.get('dishes', []) if d['price'] <= chosen['avg_cost']]
    return {**chosen, 'dishes': filtered_dishes}

def generate_plans(members, use_gemini=False):
    if not members:
        members = [{'name': 'Demo', 'food_pref': 'both', 'activity_pref': 'leisure', 'budget': 800}]

    prefs = analyze_preferences(members)
    count = len(members)
    plans = []
    used_food_names = set()

    def is_affordable(v):
        transport = TRANSPORT_FAR if v['distance_km'] > 20 else TRANSPORT_NEAR
        max_food = BUDGET - v['entry_fee'] - transport - MISC
        return max_food >= 100

    eligible = [
        v for v in VENUES
        if v['distance_km'] <= 40
        and not (prefs['has_non_veg'] and not v['food']['non_veg'])
        and is_affordable(v)
    ]
    if len(eligible) < 3:
        eligible = [v for v in VENUES if v['distance_km'] <= 40 and is_affordable(v)]

    def score(v):
        activity_bonus = 3 if v['type'] == prefs['top_activity'] else 0
        return v['rating'] + activity_bonus + random.uniform(0, 1.5)

    eligible.sort(key=score, reverse=True)

    selected = []
    used_types = set()
    for v in eligible:
        if v['type'] not in used_types:
            selected.append(v)
            used_types.add(v['type'])
        if len(selected) == 3:
            break
    if len(selected) < 3:
        for v in eligible:
            if v not in selected:
                selected.append(v)
            if len(selected) == 3:
                break

    for i, venue in enumerate(selected):
        transport = TRANSPORT_FAR if venue['distance_km'] > 20 else TRANSPORT_NEAR
        max_food_budget = BUDGET - venue['entry_fee'] - transport - MISC
        food = pick_food(prefs, max_food_budget, used_food_names)
        used_food_names.add(food['name'])

        venue_details = None
        if use_gemini:
            try:
                from gemini_helper import fetch_restaurant_suggestion, fetch_venue_details
                food_pref_key = 'mixed' if prefs['is_mixed'] else ('non_veg' if prefs['has_non_veg'] else 'veg')
                gemini_food = fetch_restaurant_suggestion(venue['name'], food_pref_key, max_food_budget)
                if gemini_food:
                    food = {
                        'name': gemini_food.get('name', food['name']),
                        'avg_cost': gemini_food.get('avg_cost', food['avg_cost']),
                        'type': gemini_food.get('type', food['type']),
                        'emoji': gemini_food.get('emoji', food['emoji']),
                        'dishes': [d for d in gemini_food.get('dishes', food.get('dishes', [])) if (d['price'] if isinstance(d, dict) else 999) <= gemini_food.get('avg_cost', max_food_budget)],
                        'location': gemini_food.get('location', food.get('location', '')),
                        'google_maps_hint': gemini_food.get('google_maps_hint', food.get('google_maps_hint', '')),
                        'why': gemini_food.get('why', '')
                    }
                venue_details = fetch_venue_details(venue['name'])
            except Exception as e:
                print(f"[Gemini] Skipping due to error: {e}")

        total_per_person = venue['entry_fee'] + food['avg_cost'] + transport + MISC
        total_group = total_per_person * count
        savings = BUDGET - total_per_person

        activities = ACTIVITIES.get(venue['type'], ACTIVITIES.get(prefs['top_activity'], ACTIVITIES['leisure']))

        template = AI_RECOMMENDATION_TEMPLATES[i % len(AI_RECOMMENDATION_TEMPLATES)]
        ai_recommendation = template.format(
            venue=venue['name'], distance_km=venue['distance_km'],
            rating=venue['rating'], total=total_per_person,
            savings=savings, food=food['name']
        )

        plans.append({
            "plan_number": i + 1,
            "venue": venue['name'],
            "venue_emoji": venue['emoji'],
            "venue_description": venue['description'],
            "distance_km": venue['distance_km'],
            "rating": venue['rating'],
            "food": food['name'],
            "food_type": food['type'],
            "food_emoji": food['emoji'],
            "food_dishes": food.get('dishes', []),
            "food_location": food.get('location', ''),
            "food_maps": food.get('google_maps_hint', ''),
            "food_why": food.get('why', ''),
            "venue_details": venue_details,
            "activities": activities,
            "cost_breakdown": {
                "entry_fee": venue['entry_fee'],
                "food": food['avg_cost'],
                "transport": transport,
                "misc": MISC,
                "total_per_person": total_per_person,
                "total_group": total_group
            },
            "within_budget": True,
            "budget_status": "Within Rs.800 Budget",
            "savings": savings,
            "ai_recommendation": ai_recommendation,
            "fit_score": round(venue['rating'] * 20 - abs(total_per_person - 600) / 10, 1),
            "highlights": [
                f"📍 {venue['distance_km']} km from office",
                f"👥 Perfect for {count} people",
                f"⭐ Rated {venue['rating']}/5",
                f"💰 Rs.{total_per_person}/person (saves Rs.{savings})"
            ]
        })

    return plans
