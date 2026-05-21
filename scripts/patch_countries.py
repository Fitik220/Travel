from pathlib import Path
import re

root = Path(".")
file_path = root / "src" / "data" / "countries.ts"
text = file_path.read_text(encoding="utf-8")

# Locate the countries array by identifying the exact closing bracket for the array
start_key = "export const countries: Country[] = "
start = text.index(start_key)
array_start = text.index("= [", start) + 2

depth = 0
end = None
for i in range(array_start, len(text)):
    if text[i] == "[":
        depth += 1
    elif text[i] == "]":
        depth -= 1
        if depth == 0:
            end = i
            break
if end is None:
    raise RuntimeError("Could not find countries array end")

header = text[:start]
array_block = text[array_start:end+1]
tail = text[end+1:]

# Split into object blocks using exact separator
segments = array_block.split("\n  },\n  {")
# The first segment includes 'export const countries...' plus first object prefix
# The last segment includes the final object and closing bracket
if len(segments) < 2:
    raise RuntimeError(f"Unexpected split length {len(segments)}")

# The first segment starts with '[\n  {' and the last segment ends with '\n];'

# Remove prefix text before the first object literal
prefix, first_obj = segments[0].split("\n  {", 1)
objects = ["  {" + first_obj] + ["  {" + s for s in segments[1:]]

# Remove trailing array close from last object
last_obj = objects[-1]
if last_obj.endswith("\n]"):
    objects[-1] = last_obj[:-2]
else:
    raise RuntimeError("Last object did not end with array close")

print(f"Found {len(objects)} country objects")

# Utility functions

region_to_climate = {
    "Central Asia": "Continental",
    "East Asia": "Temperate",
    "Western Europe": "Temperate",
    "Southern Europe": "Mediterranean",
    "Central Europe": "Temperate",
    "North America": "Varied",
    "South America": "Tropical / Mountain",
    "Southeast Asia": "Tropical",
    "North Africa": "Arid / Desert",
    "Middle East": "Arid / Desert",
    "Oceania": "Tropical / Coastal",
    "Caribbean": "Tropical",
    "Eastern Europe": "Temperate",
    "Northern Europe": "Temperate",
    "Central America": "Tropical",
}

def derive_budget_level(low):
    if low < 90:
        return "budget"
    if low < 190:
        return "mid-range"
    return "luxury"


def derive_rating(vibe, travel_style):
    base = 4.3
    if "luxury" in vibe.lower() or "luxury" in travel_style.lower():
        base += 0.3
    if "budget" in vibe.lower() or "budget" in travel_style.lower():
        base -= 0.1
    if "adventure" in vibe.lower() or "adventure" in travel_style.lower():
        base += 0.1
    return round(min(4.9, max(4.1, base)), 1)


def slugify(text):
    return text.lower().replace(" ", "-").replace("/", "-").replace("&", "and")


def normalize_tags(text):
    tags = re.split(r"[^a-zA-Z0-9]+", text.lower())
    return [tag for tag in tags if tag and tag not in {"and", "or", "the", "per"}]


def extract_value(pattern, block):
    m = re.search(pattern, block)
    return m.group(1) if m else None


# Create city objects based on popularCities and topAttractions

def create_cities(popular_cities, top_attractions):
    cities = []
    for idx, name in enumerate(popular_cities[:4]):
        vibe = "Urban culture"
        if idx == 1 and len(popular_cities) > 1:
            vibe = "Cultural food scene"
        elif idx == 2:
            vibe = "Iconic sightseeing"
        elif idx == 3:
            vibe = "Relaxed local mood"
        attractions = top_attractions[idx:idx+2] if len(top_attractions) > idx else top_attractions[:2]
        if not attractions:
            attractions = [f"Signature experience in {name}"]
        cities.append({
            "name": name,
            "vibe": vibe,
            "averageCost": 90 + idx * 45,
            "topAttractions": attractions,
            "styleTags": ["city", "culture", "food"],
        })
    return cities

updated_objects = []
for obj in objects:
    if "tourismRating" in obj and "cities:" in obj:
        updated_objects.append(obj)
        continue

    low = extract_value(r"estimatedDailyBudget:\s*\{\s*low:\s*([0-9]+)", obj)
    low_val = int(low) if low else 120
    country_name = extract_value(r'name:\s*"([^"]+)"', obj) or "Destination"
    region = extract_value(r'region:\s*"([^"]+)"', obj) or "Global"
    travel_vibe = extract_value(r'travelVibe:\s*"([^"]+)"', obj) or "Balanced"
    travel_style = extract_value(r'travelStyle:\s*"([^"]+)"', obj) or "City & Culture"
    popular_cities_match = re.search(r'popularCities:\s*\[([^\]]+)\]', obj, re.S)
    popular_cities = []
    if popular_cities_match:
        items = re.findall(r'"([^"]+)"', popular_cities_match.group(1))
        popular_cities = items
    top_attractions_match = re.search(r'topAttractions:\s*\[([^\]]+)\]', obj, re.S)
    top_attractions = []
    if top_attractions_match:
        top_attractions = re.findall(r'"([^"]+)"', top_attractions_match.group(1))

    budget_level = derive_budget_level(low_val)
    tourism_rating = derive_rating(travel_vibe, travel_style)
    climate = region_to_climate.get(region, "Varied")
    style_tags = list(dict.fromkeys(normalize_tags(travel_vibe) + normalize_tags(travel_style)))
    cities = create_cities(popular_cities, top_attractions)

    insert_block = f"    tourismRating: {tourism_rating},\n"
    insert_block += f"    budgetLevel: \"{budget_level}\",\n"
    insert_block += f"    climate: \"{climate}\",\n"
    insert_block += f"    styleTags: {style_tags!r},\n"
    insert_block += "    cities: [\n"
    for city in cities:
        insert_block += "      {\n"
        insert_block += f"        name: \"{city['name']}\",\n"
        insert_block += f"        vibe: \"{city['vibe']}\",\n"
        insert_block += f"        averageCost: {city['averageCost']},\n"
        insert_block += f"        topAttractions: {city['topAttractions']!r},\n"
        insert_block += f"        styleTags: {city['styleTags']!r},\n"
        insert_block += "      },\n"
    insert_block += "    ],\n"

    # Insert before the closing of the object after hotels
    replacement = "\n    ],\n" + insert_block + "  },"
    obj = re.sub(r"\n\s*\],\n  }$", replacement, obj, flags=re.M)
    if obj == objects[0]:
        print('first updated object tail', repr(obj[-200:]))
    updated_objects.append(obj)

new_array_block = "[\n" + "\n  },\n  {".join(o for o in updated_objects) + "\n  },\n];"
new_text = text[:array_start] + new_array_block + tail
file_path.write_text(new_text, encoding='utf-8')
print('Wrote updated countries file')
