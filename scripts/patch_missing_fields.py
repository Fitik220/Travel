from pathlib import Path
import re

path = Path('src/data/countries.ts')
text = path.read_text(encoding='utf-8')
start_key = 'export const countries: Country[] = '
start = text.index(start_key)
array_start = text.index('= [', start) + 2

depth = 0
end = None
for i in range(array_start, len(text)):
    if text[i] == '[':
        depth += 1
    elif text[i] == ']':
        depth -= 1
        if depth == 0:
            end = i
            break
if end is None:
    raise RuntimeError('Could not find countries array end')

array_body = text[array_start+1:end]
segments = array_body.split('\n  },\n  {')
print('segments', len(segments))

region_to_climate = {
    'Central Asia': 'Continental',
    'East Asia': 'Temperate',
    'Western Europe': 'Temperate',
    'Southern Europe': 'Mediterranean',
    'Central Europe': 'Temperate',
    'North America': 'Varied',
    'South America': 'Tropical / Mountain',
    'Southeast Asia': 'Tropical',
    'North Africa': 'Arid / Desert',
    'Middle East': 'Arid / Desert',
    'Oceania': 'Tropical / Coastal',
    'Caribbean': 'Tropical',
    'Eastern Europe': 'Temperate',
    'Northern Europe': 'Temperate',
    'Central America': 'Tropical',
}

budget_map = [('budget', 90), ('mid-range', 190), ('luxury', 9999)]

def derive_budget_level(low):
    for level, threshold in budget_map:
        if low < threshold:
            return level
    return 'luxury'


def derive_rating(vibe, style):
    score = 4.2
    text = f'{vibe} {style}'.lower()
    if 'luxury' in text or 'premium' in text or 'boutique' in text:
        score += 0.35
    if 'budget' in text or 'value' in text or 'cheap' in text:
        score -= 0.15
    if 'adventure' in text or 'nature' in text:
        score += 0.1
    return round(min(4.9, max(4.1, score)), 1)


def make_style_tags(vibe, style):
    raw = re.split(r'[^a-zA-Z0-9]+', f'{vibe} {style}'.lower())
    tags = [tag for tag in raw if tag and tag not in {'and', 'or', 'the', 'per'}]
    return sorted(dict.fromkeys(tags))


def create_cities(popular_cities, top_attractions):
    cities = []
    for idx, name in enumerate(popular_cities[:4]):
        vibe = 'City culture'
        if idx == 1:
            vibe = 'Historic immersion'
        elif idx == 2:
            vibe = 'Signature scenery'
        elif idx == 3:
            vibe = 'Laid-back local life'
        attractions = top_attractions[idx:idx+2] or top_attractions[:2]
        cities.append({
            'name': name,
            'vibe': vibe,
            'averageCost': 90 + idx * 40,
            'topAttractions': attractions,
            'styleTags': ['city', 'culture', 'food'],
        })
    return cities


def insert_fields(obj_text):
    if 'tourismRating:' in obj_text:
        return obj_text
    low_match = re.search(r'estimatedDailyBudget:\s*\{\s*low:\s*([0-9]+)', obj_text)
    low = int(low_match.group(1)) if low_match else 120
    region_match = re.search(r'region:\s*"([^"]+)"', obj_text) or re.search(r"region:\s*'([^']+)'", obj_text)
    region = region_match.group(1) if region_match else 'Global'
    vibe_match = re.search(r'travelVibe:\s*"([^"]+)"', obj_text) or re.search(r"travelVibe:\s*'([^']+)'", obj_text)
    vibe = vibe_match.group(1) if vibe_match else 'Balanced'
    style_match = re.search(r'travelStyle:\s*"([^"]+)"', obj_text) or re.search(r"travelStyle:\s*'([^']+)'", obj_text)
    style = style_match.group(1) if style_match else 'City & Culture'
    popular_match = re.search(r'popularCities:\s*\[([^\]]+)\]', obj_text, re.S)
    popular_list = re.findall(r'"([^"]+)"', popular_match.group(1)) if popular_match else []
    top_match = re.search(r'topAttractions:\s*\[([^\]]+)\]', obj_text, re.S)
    top_list = re.findall(r'"([^"]+)"', top_match.group(1)) if top_match else []
    level = derive_budget_level(low)
    rating = derive_rating(vibe, style)
    climate = region_to_climate.get(region, 'Varied')
    tags = make_style_tags(vibe, style)
    cities = create_cities(popular_list, top_list)
    insertion = [
        f'    tourismRating: {rating},',
        f'    budgetLevel: "{level}",',
        f'    climate: "{climate}",',
        f'    styleTags: {tags!r},',
        '    cities: [',
    ]
    for city in cities:
        insertion.extend([
            '      {',
            f'        name: "{city["name"]}",',
            f'        vibe: "{city["vibe"]}",',
            f'        averageCost: {city["averageCost"]},',
            f'        topAttractions: {city["topAttractions"]!r},',
            f'        styleTags: {city["styleTags"]!r},',
            '      },',
        ])
    insertion.append('    ],')
    insert_text = '\n'.join(insertion)
    prefix, sep, suffix = obj_text.rpartition('\n    ],')
    if not sep:
        raise RuntimeError('Could not find hotels boundary in object')
    return prefix + '\n    ],\n' + insert_text + suffix

objects = []
for segment in segments:
    obj_text = segment.strip()
    if not obj_text.startswith('{'):
        obj_text = '{' + obj_text
    updated = insert_fields(obj_text)
    objects.append(updated)

new_body = '\n  },\n  {\n'.join(objects)
new_text = text[:array_start+1] + '\n' + new_body + '\n' + text[end:]
path.write_text(new_text, encoding='utf-8')
print('Patched objects, now have', len(objects))
