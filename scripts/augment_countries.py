from pathlib import Path
import re

path = Path('src/data/countries.ts')
text = path.read_text(encoding='utf-8')
start_key = 'export const countries: Country[] = '
start = text.index(start_key)
array_start = text.index('= [', start) + 2

# Find matching end bracket for the countries array
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
print('found segments', len(segments))
objects = []

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
    region = (re.search(r'region:\s*"([^"]+)"', obj_text) or re.search(r"region:\s*'([^']+)'", obj_text))
    region = region.group(1) if region else 'Global'
    vibe = (re.search(r'travelVibe:\s*"([^"]+)"', obj_text) or re.search(r"travelVibe:\s*'([^']+)'", obj_text))
    vibe = vibe.group(1) if vibe else 'Balanced'
    style = (re.search(r'travelStyle:\s*"([^"]+)"', obj_text) or re.search(r"travelStyle:\s*'([^']+)'", obj_text))
    style = style.group(1) if style else 'City & Culture'
    popular = re.search(r'popularCities:\s*\[([^\]]+)\]', obj_text, re.S)
    popular_list = re.findall(r'"([^"]+)"', popular.group(1)) if popular else []
    top = re.search(r'topAttractions:\s*\[([^\]]+)\]', obj_text, re.S)
    top_list = re.findall(r'"([^"]+)"', top.group(1)) if top else []

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


extra_countries = [
    {
        'slug': 'united-states',
        'name': 'United States',
        'region': 'North America',
        'capital': 'Washington, D.C.',
        'bestSeason': 'April-June, September-November',
        'intro': 'Coast-to-coast premium experiences from big cities to national parks.',
        'overview': 'The United States delivers a diverse portfolio of luxury, outdoor, and cultural routes for a fully customized travel itinerary.',
        'highlights': ['New York', 'Grand Canyon', 'Napa Valley', 'Miami Beach'],
        'culture': 'From metropolitan design to national-park hospitality, the U.S. travel experience feels aspirational, varied, and modern.',
        'food': ['New York deli', 'California seafood', 'BBQ', 'Southern cuisine'],
        'practicalTips': ['Book domestic flights early', 'Allow extra time for national parks', 'Use city ride apps for convenience'],
        'accent': '#0ea5e9',
        'coordinates': {'lat': 37.0902, 'lng': -95.7129},
        'travelVibe': 'Luxury / Nature / City',
        'travelStyle': 'All-American premium',
        'budgetRange': 'USD 220-480 per day',
        'hotelPriceRange': 'USD 180-420 per night',
        'flightEstimateRange': 'USD 450-850',
        'estimatedDailyBudget': {'low': 220, 'high': 480, 'currency': 'USD'},
        'recommendedDuration': '10-15 days',
        'popularCities': ['New York', 'San Francisco', 'Miami', 'Las Vegas'],
        'topAttractions': ['Broadway', 'Golden Gate', 'Everglades', 'Grand Canyon'],
        'foodRecommendations': ['Steakhouse dinner', 'California wine tasting', 'Street tacos', 'Seafood brunch'],
        'hotels': [
            {'stars': 3, 'label': 'City modern', 'nightly': [180, 240]},
            {'stars': 5, 'label': 'Resort luxury', 'nightly': [340, 420]},
        ],
    },
    {
        'slug': 'china',
        'name': 'China',
        'region': 'East Asia',
        'capital': 'Beijing',
        'bestSeason': 'April-May, September-October',
        'intro': 'China pairs ancient traditions with modern megacities and diverse landscapes.',
        'overview': 'A premium itinerary blends Beijing heritage, Yangtze river travel, and coastal city modernity for a powerful Asia route.',
        'highlights': ['Beijing', 'Xi’an', 'Shanghai', 'Guilin'],
        'culture': 'Immersive cultural rhythms and polished transport make China a high-contrast premium travel option.',
        'food': ['Peking duck', 'Xiaolongbao', 'Hot pot', 'Dim sum'],
        'practicalTips': ['Use domestic high-speed trains', 'Download local navigation apps before travel', 'Respect temple etiquette'],
        'accent': '#f97316',
        'coordinates': {'lat': 35.8617, 'lng': 104.1954},
        'travelVibe': 'Culture / City / Luxury',
        'travelStyle': 'Heritage and high-speed',
        'budgetRange': 'USD 130-260 per day',
        'hotelPriceRange': 'USD 120-320 per night',
        'flightEstimateRange': 'USD 820-1,120',
        'estimatedDailyBudget': {'low': 130, 'high': 260, 'currency': 'USD'},
        'recommendedDuration': '10-14 days',
        'popularCities': ['Beijing', 'Shanghai', 'Xi’an', 'Guilin'],
        'topAttractions': ['Forbidden City', 'Terracotta Army', 'Bund skyline', 'Li River cruise'],
        'foodRecommendations': ['Street dumplings', 'Tea house dim sum', 'Sichuan hot pot'],
        'hotels': [
            {'stars': 3, 'label': 'City boutique', 'nightly': [120, 180]},
            {'stars': 5, 'label': 'Luxury landmark', 'nightly': [300, 320]},
        ],
    },
    {
        'slug': 'united-arab-emirates',
        'name': 'United Arab Emirates',
        'region': 'Middle East',
        'capital': 'Abu Dhabi',
        'bestSeason': 'November-March',
        'intro': 'High-gloss city hotels, desert lodges, and megaproject luxury define UAE travel.',
        'overview': 'Dubai and Abu Dhabi lead premium Middle East routes with bold design, desert adventure, and nonstop luxury.',
        'highlights': ['Dubai', 'Abu Dhabi', 'Al Ain', 'Liwa Desert'],
        'culture': 'The UAE offers polished hospitality, world-class dining, and striking desert-city contrasts.',
        'food': ['Shawarma', 'Emirati mezze', 'Fine-dining fusion', 'Fresh seafood'],
        'practicalTips': ['Travel in cooler months', 'Book luxury experiences early', 'Respect local customs in public spaces'],
        'accent': '#fcd34d',
        'coordinates': {'lat': 23.4241, 'lng': 53.8478},
        'travelVibe': 'Luxury / City / Adventure',
        'travelStyle': 'Modern desert',
        'budgetRange': 'USD 280-520 per day',
        'hotelPriceRange': 'USD 220-460 per night',
        'flightEstimateRange': 'USD 900-1,300',
        'estimatedDailyBudget': {'low': 280, 'high': 520, 'currency': 'USD'},
        'recommendedDuration': '6-10 days',
        'popularCities': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain'],
        'topAttractions': ['Burj Khalifa', 'Sheikh Zayed Mosque', 'Desert safari', 'Louvre Abu Dhabi'],
        'foodRecommendations': ['Luxury brunch', 'Street shawarma', 'Emirati coffee', 'Seafood grill'],
        'hotels': [
            {'stars': 3, 'label': 'Boutique city', 'nightly': [220, 280]},
            {'stars': 5, 'label': 'Iconic resort', 'nightly': [420, 460]},
        ],
    },
    {
        'slug': 'saudi-arabia',
        'name': 'Saudi Arabia',
        'region': 'Middle East',
        'capital': 'Riyadh',
        'bestSeason': 'October-March',
        'intro': 'A historic and emerging luxury route with desert lodges, Red Sea islands, and cultural renewals.',
        'overview': 'Saudi Arabia combines heritage cities, modern hospitality, and dramatic desert landscapes for new premium travel products.',
        'highlights': ['Riyadh', 'Jeddah', 'AlUla', 'Red Sea Coast'],
        'culture': 'A rapidly modernizing destination with renewed archaeological access, curated hospitality, and distinctive heritage.',
        'food': ['Kabsa', 'Shawarma', 'Jeddah seafood', 'Traditional coffee'],
        'practicalTips': ['Travel in winter months', 'Plan long travel legs carefully', 'Respect dress codes at cultural sites'],
        'accent': '#f97316',
        'coordinates': {'lat': 23.8859, 'lng': 45.0792},
        'travelVibe': 'Luxury / Culture / Adventure',
        'travelStyle': 'Desert discovery',
        'budgetRange': 'USD 190-360 per day',
        'hotelPriceRange': 'USD 160-320 per night',
        'flightEstimateRange': 'USD 980-1,250',
        'estimatedDailyBudget': {'low': 190, 'high': 360, 'currency': 'USD'},
        'recommendedDuration': '8-12 days',
        'popularCities': ['Riyadh', 'Jeddah', 'AlUla', 'Neom'],
        'topAttractions': ['AlUla tombs', 'Red Sea diving', 'Masmak Fortress', 'Desert camp'],
        'foodRecommendations': ['Kabsa feast', 'Street shawarma', 'Date coffee', 'Fresh seafood'],
        'hotels': [
            {'stars': 3, 'label': 'City comfort', 'nightly': [160, 210]},
            {'stars': 5, 'label': 'Luxury resort', 'nightly': [300, 320]},
        ],
    },
    {
        'slug': 'singapore',
        'name': 'Singapore',
        'region': 'Southeast Asia',
        'capital': 'Singapore',
        'bestSeason': 'February-April',
        'intro': 'A compact premium city-state with gardens, luxury hotels, and world-class dining.',
        'overview': 'Singapore works as a premium hub for architecture, gastronomy, and efficient city experiences.',
        'highlights': ['Marina Bay', 'Sentosa', 'Chinatown', 'Botanic Gardens'],
        'culture': 'A modern fusion of Malay, Chinese, Indian, and global influences with ultra-clean urban systems.',
        'food': ['Chilli crab', 'Hainanese chicken rice', 'Laksa', 'Fine dining'],
        'practicalTips': ['Use public transit extensively', 'Carry water in humid weather', 'Book key attractions early'],
        'accent': '#14b8a6',
        'coordinates': {'lat': 1.3521, 'lng': 103.8198},
        'travelVibe': 'Luxury / City / Food',
        'travelStyle': 'Urban refinement',
        'budgetRange': 'USD 220-380 per day',
        'hotelPriceRange': 'USD 190-350 per night',
        'flightEstimateRange': 'USD 860-1,100',
        'estimatedDailyBudget': {'low': 220, 'high': 380, 'currency': 'USD'},
        'recommendedDuration': '5-8 days',
        'popularCities': ['Singapore', 'Sentosa', 'Marina Bay', 'Chinatown'],
        'topAttractions': ['Gardens by the Bay', 'SkyPark views', 'Hawker food', 'Night safari'],
        'foodRecommendations': ['Hawker centre tour', 'Chilli crab experience', 'Bak kut teh', 'Local dessert tasting'],
        'hotels': [
            {'stars': 3, 'label': 'City stylish', 'nightly': [190, 240]},
            {'stars': 5, 'label': 'Iconic luxury', 'nightly': [330, 350]},
        ],
    },
    {
        'slug': 'norway',
        'name': 'Norway',
        'region': 'Northern Europe',
        'capital': 'Oslo',
        'bestSeason': 'June-August, December-February',
        'intro': 'Epic fjords, northern lights, and curated outdoor luxury create an unforgettable Nordic route.',
        'overview': 'Norway combines polished city stays, dramatic coastal drives, and wilderness lodges in a premium travel package.',
        'highlights': ['Oslo', 'Bergen', 'Fjords', 'Tromsø'],
        'culture': 'The Norwegian travel rhythm is calm, outdoors-forward, and grounded in nature-focused design.',
        'food': ['Seafood', 'Reindeer', 'Smoked salmon', 'Baked goods'],
        'practicalTips': ['Book scenic trains early', 'Dress for changeable weather', 'Reserve popular fjord cruises'],
        'accent': '#38bdf8',
        'coordinates': {'lat': 60.4720, 'lng': 8.4689},
        'travelVibe': 'Luxury / Nature / Adventure',
        'travelStyle': 'Fjord escape',
        'budgetRange': 'USD 260-430 per day',
        'hotelPriceRange': 'USD 210-390 per night',
        'flightEstimateRange': 'USD 920-1,200',
        'estimatedDailyBudget': {'low': 260, 'high': 430, 'currency': 'USD'},
        'recommendedDuration': '7-10 days',
        'popularCities': ['Oslo', 'Bergen', 'Tromsø', 'Ålesund'],
        'topAttractions': ['Fjord cruise', 'Northern lights', 'Vigeland Park', 'Scenic train ride'],
        'foodRecommendations': ['Seafood platter', 'Norwegian waffles', 'Smoked fish', 'Local coffee'],
        'hotels': [
            {'stars': 3, 'label': 'Coastal lodge', 'nightly': [210, 270]},
            {'stars': 5, 'label': 'Boutique fjord resort', 'nightly': [350, 390]},
        ],
    },
    {
        'slug': 'sweden',
        'name': 'Sweden',
        'region': 'Northern Europe',
        'capital': 'Stockholm',
        'bestSeason': 'May-September',
        'intro': 'Design-led city stays, archipelago islands, and modern culinary travel.',
        'overview': 'Sweden blends Scandinavian hospitality with urban style and natural escapes for premium northern travel.',
        'highlights': ['Stockholm', 'Gothenburg', 'Lapland', 'Archipelago'],
        'culture': 'Swedish travel emphasizes minimalism, comfort, and clean, sustainable experiences.',
        'food': ['Smörgåsbord', 'Seafood', 'Fika pastries', 'Modern Nordic dishes'],
        'practicalTips': ['Use trains between cities', 'Book mountain or archipelago stays in advance', 'Pack layering pieces'],
        'accent': '#22c55e',
        'coordinates': {'lat': 60.1282, 'lng': 18.6435},
        'travelVibe': 'Nature / City / Luxury',
        'travelStyle': 'Nordic calm',
        'budgetRange': 'USD 220-380 per day',
        'hotelPriceRange': 'USD 180-340 per night',
        'flightEstimateRange': 'USD 880-1,180',
        'estimatedDailyBudget': {'low': 220, 'high': 380, 'currency': 'USD'},
        'recommendedDuration': '7-11 days',
        'popularCities': ['Stockholm', 'Gothenburg', 'Kiruna', 'Visby'],
        'topAttractions': ['Stockholm Old Town', 'Northern lights', 'Island sailing', 'Design museums'],
        'foodRecommendations': ['Fika break', 'Seafood tasting', 'Local cheese', 'Pastry sampling'],
        'hotels': [
            {'stars': 3, 'label': 'Urban comfort', 'nightly': [180, 230]},
            {'stars': 5, 'label': 'Design retreat', 'nightly': [320, 340]},
        ],
    },
    {
        'slug': 'finland',
        'name': 'Finland',
        'region': 'Northern Europe',
        'capital': 'Helsinki',
        'bestSeason': 'June-August, December-March',
        'intro': 'Lakes, forests, saunas, and bespoke nature experiences define Finland travel.',
        'overview': 'Finland is a premium wilderness and city destination with strong design culture and quiet luxury.',
        'highlights': ['Helsinki', 'Lapland', 'Sauna', 'Lake cabins'],
        'culture': 'Finnish travel is rooted in nature, clean design, and precise planning.',
        'food': ['Reindeer', 'Salmon', 'Rye bread', 'Berry desserts'],
        'practicalTips': ['Pack warm layers for cooler months', 'Try a sauna experience', 'Plan Arctic logistics carefully'],
        'accent': '#60a5fa',
        'coordinates': {'lat': 61.9241, 'lng': 25.7482},
        'travelVibe': 'Nature / Relaxation / Luxury',
        'travelStyle': 'Forest retreat',
        'budgetRange': 'USD 210-370 per day',
        'hotelPriceRange': 'USD 180-340 per night',
        'flightEstimateRange': 'USD 900-1,140',
        'estimatedDailyBudget': {'low': 210, 'high': 370, 'currency': 'USD'},
        'recommendedDuration': '6-10 days',
        'popularCities': ['Helsinki', 'Rovaniemi', 'Tampere', 'Åland'],
        'topAttractions': ['Arctic wildlife', 'Sauna culture', 'Design district', 'Northern lights'],
        'foodRecommendations': ['Berry picking', 'Salmon soup', 'Finnish pastries', 'Reindeer stew'],
        'hotels': [
            {'stars': 3, 'label': 'Lakeside lodge', 'nightly': [180, 240]},
            {'stars': 5, 'label': 'Arctic luxury', 'nightly': [320, 340]},
        ],
    },
    {
        'slug': 'austria',
        'name': 'Austria',
        'region': 'Central Europe',
        'capital': 'Vienna',
        'bestSeason': 'May-October, December-February',
        'intro': 'Music, mountains, and elegant city culture make Austria a refined European route.',
        'overview': 'Austria marries alpine vistas with Baroque cities, luxury train rides, and culinary finesse.',
        'highlights': ['Vienna', 'Salzburg', 'Innsbruck', 'Hallstatt'],
        'culture': 'Austrian travel combines historic coffeehouse culture, classical music, and mountain leisure.',
        'food': ['Wiener schnitzel', 'Sacher torte', 'Strudel', 'Alpine cheese'],
        'practicalTips': ['Use regional trains', 'Book concert tickets in advance', 'Carry layers for alpine weather'],
        'accent': '#fbbf24',
        'coordinates': {'lat': 47.5162, 'lng': 14.5501},
        'travelVibe': 'Culture / Nature / Luxury',
        'travelStyle': 'Alpine elegance',
        'budgetRange': 'USD 190-340 per day',
        'hotelPriceRange': 'USD 170-320 per night',
        'flightEstimateRange': 'USD 720-980',
        'estimatedDailyBudget': {'low': 190, 'high': 340, 'currency': 'USD'},
        'recommendedDuration': '7-10 days',
        'popularCities': ['Vienna', 'Salzburg', 'Innsbruck', 'Hallstatt'],
        'topAttractions': ['Palace tours', 'Alpine lake', 'Mozart heritage', 'Scenic train'],
        'foodRecommendations': ['Coffeehouse pastry', 'Austrian dinner', 'Mountain cheese platter'],
        'hotels': [
            {'stars': 3, 'label': 'City comfort', 'nightly': [170, 220]},
            {'stars': 5, 'label': 'Historic palace', 'nightly': [300, 320]},
        ],
    },
    {
        'slug': 'czech-republic',
        'name': 'Czech Republic',
        'region': 'Central Europe',
        'capital': 'Prague',
        'bestSeason': 'May-September',
        'intro': 'Gothic architecture, breweries, and historic cities create an easily accessible European route.',
        'overview': 'The Czech Republic offers premium cultural travel in Prague and charming regional towns with strong value.',
        'highlights': ['Prague', 'Český Krumlov', 'Karlovy Vary', 'Kutná Hora'],
        'culture': 'Czech travel is centered on beautiful cityscapes, historic beer halls, and comfortable regional charm.',
        'food': ['Goulash', 'Trdelník', 'Knedlíky', 'Pilsner'],
        'practicalTips': ['Explore by train to smaller towns', 'Book Prague walking tours early', 'Enjoy the relaxed cultural pace'],
        'accent': '#38bdf8',
        'coordinates': {'lat': 49.8175, 'lng': 15.4730},
        'travelVibe': 'Culture / History / Value',
        'travelStyle': 'Historic Europe',
        'budgetRange': 'USD 120-220 per day',
        'hotelPriceRange': 'USD 100-210 per night',
        'flightEstimateRange': 'USD 580-860',
        'estimatedDailyBudget': {'low': 120, 'high': 220, 'currency': 'USD'},
        'recommendedDuration': '5-9 days',
        'popularCities': ['Prague', 'Český Krumlov', 'Karlovy Vary', 'Kutná Hora'],
        'topAttractions': ['Charles Bridge', 'Castle district', 'Spa towns', 'Baroque churches'],
        'foodRecommendations': ['Beer tasting', 'Czech dumplings', 'Bakery treats'],
        'hotels': [
            {'stars': 3, 'label': 'City style', 'nightly': [100, 140]},
            {'stars': 5, 'label': 'Castle hotel', 'nightly': [190, 210]},
        ],
    },
    {
        'slug': 'ireland',
        'name': 'Ireland',
        'region': 'Northern Europe',
        'capital': 'Dublin',
        'bestSeason': 'May-September',
        'intro': 'Emerald landscapes, castle hotels, and pubs tuned for premium tourism.',
        'overview': 'Ireland delivers relaxed luxury with coastal routes, city culture, and countryside stays.',
        'highlights': ['Dublin', 'Galway', 'Cliffs of Moher', 'Killarney'],
        'culture': 'Irish travel feels friendly, scenic, and rooted in music, stories, and warm local hospitality.',
        'food': ['Seafood chowder', 'Irish stew', 'Soda bread', 'Craft beer'],
        'practicalTips': ['Rent a car for rural routes', 'Pack rain layers', 'Book castle stays early'],
        'accent': '#22c55e',
        'coordinates': {'lat': 53.1424, 'lng': -7.6921},
        'travelVibe': 'Nature / Culture / Comfort',
        'travelStyle': 'Country roads',
        'budgetRange': 'USD 170-300 per day',
        'hotelPriceRange': 'USD 150-290 per night',
        'flightEstimateRange': 'USD 700-960',
        'estimatedDailyBudget': {'low': 170, 'high': 300, 'currency': 'USD'},
        'recommendedDuration': '7-11 days',
        'popularCities': ['Dublin', 'Galway', 'Killarney', 'Cork'],
        'topAttractions': ['Cliffs of Moher', 'Pub music', 'Wild Atlantic Way', 'Castle stay'],
        'foodRecommendations': ['Seafood platter', 'Irish breakfast', 'Scones and tea'],
        'hotels': [
            {'stars': 3, 'label': 'Historic inn', 'nightly': [150, 190]},
            {'stars': 5, 'label': 'Estate retreat', 'nightly': [280, 290]},
        ],
    },
    {
        'slug': 'hungary',
        'name': 'Hungary',
        'region': 'Central Europe',
        'capital': 'Budapest',
        'bestSeason': 'April-June, September-October',
        'intro': 'Budapest thermal baths, riverfront palaces, and elegant Central Europe value.',
        'overview': 'Hungary pairs a modern European city with cultural depth and pleasantly priced premium stays.',
        'highlights': ['Budapest', 'Lake Balaton', 'Eger', 'Danube Bend'],
        'culture': 'Hungary offers dramatic architecture, spa culture, and approachable European hospitality.',
        'food': ['Goulash', 'Langos', 'Paprika chicken', 'Tokaji wine'],
        'practicalTips': ['Book Budapest spa tickets in advance', 'Try river dining', 'Explore both Buda and Pest sides'],
        'accent': '#f472b6',
        'coordinates': {'lat': 47.1625, 'lng': 19.5033},
        'travelVibe': 'Culture / City / Value',
        'travelStyle': 'Historic city',
        'budgetRange': 'USD 110-190 per day',
        'hotelPriceRange': 'USD 90-180 per night',
        'flightEstimateRange': 'USD 520-760',
        'estimatedDailyBudget': {'low': 110, 'high': 190, 'currency': 'USD'},
        'recommendedDuration': '5-8 days',
        'popularCities': ['Budapest', 'Eger', 'Sopron', 'Lake Balaton'],
        'topAttractions': ['Thermal baths', 'Castle district', 'Wine region', 'River cruise'],
        'foodRecommendations': ['Local goulash', 'Bakery treats', 'Wine tasting'],
        'hotels': [
            {'stars': 3, 'label': 'City classic', 'nightly': [90, 130]},
            {'stars': 5, 'label': 'Riverside palace', 'nightly': [170, 180]},
        ],
    },
    {
        'slug': 'south-korea',
        'name': 'South Korea',
        'region': 'East Asia',
        'capital': 'Seoul',
        'bestSeason': 'March-May, September-November',
        'intro': 'Tech-savvy cities, mountain temples, and dynamic food neighborhoods.',
        'overview': 'South Korea offers premium urban energy alongside heritage and natural escapes.',
        'highlights': ['Seoul', 'Busan', 'Jeju Island', 'Gyeongju'],
        'culture': 'Korean travel mixes modern style with historic rituals and intense culinary culture.',
        'food': ['Korean barbecue', 'Bibimbap', 'Street snacks', 'Seafood stews'],
        'practicalTips': ['Use subway cards', 'Try local markets', 'Learn basic etiquette for temples'],
        'accent': '#f87171',
        'coordinates': {'lat': 35.9078, 'lng': 127.7669},
        'travelVibe': 'City / Culture / Food',
        'travelStyle': 'Fast-paced discovery',
        'budgetRange': 'USD 130-240 per day',
        'hotelPriceRange': 'USD 120-240 per night',
        'flightEstimateRange': 'USD 820-1,100',
        'estimatedDailyBudget': {'low': 130, 'high': 240, 'currency': 'USD'},
        'recommendedDuration': '7-11 days',
        'popularCities': ['Seoul', 'Busan', 'Jeju', 'Gyeongju'],
        'topAttractions': ['Palace tours', 'Street food alleys', 'Coastal city', 'Temple trails'],
        'foodRecommendations': ['Korean BBQ dinner', 'Market snacks', 'Seafood stew', 'Coffee cafes'],
        'hotels': [
            {'stars': 3, 'label': 'City boutique', 'nightly': [120, 160]},
            {'stars': 5, 'label': 'Design luxury', 'nightly': [220, 240]},
        ],
    },
    {
        'slug': 'philippines',
        'name': 'Philippines',
        'region': 'Southeast Asia',
        'capital': 'Manila',
        'bestSeason': 'November-May',
        'intro': 'Island hopping, coral reefs, and warm hospitality define this tropical route.',
        'overview': 'The Philippines offers premium beach and adventure travel with a strong local island culture.',
        'highlights': ['Palawan', 'Cebu', 'Boracay', 'Bohol'],
        'culture': 'Island travel here is relaxed, sun-soaked, and full of friendly local connections.',
        'food': ['Lechon', 'Adobo', 'Seafood', 'Tropical fruits'],
        'practicalTips': ['Book boat transfers early', 'Pack reef-safe sunscreen', 'Allow extra time for island logistics'],
        'accent': '#34d399',
        'coordinates': {'lat': 12.8797, 'lng': 121.7740},
        'travelVibe': 'Nature / Beach / Adventure',
        'travelStyle': 'Island luxury',
        'budgetRange': 'USD 140-260 per day',
        'hotelPriceRange': 'USD 100-240 per night',
        'flightEstimateRange': 'USD 860-1,080',
        'estimatedDailyBudget': {'low': 140, 'high': 260, 'currency': 'USD'},
        'recommendedDuration': '8-12 days',
        'popularCities': ['Manila', 'Palawan', 'Cebu', 'Boracay'],
        'topAttractions': ['Island beaches', 'Reef diving', 'Rice terraces', 'Sunset cruises'],
        'foodRecommendations': ['Seafood feast', 'Street adobo', 'Fruit smoothies'],
        'hotels': [
            {'stars': 3, 'label': 'Beach resort', 'nightly': [100, 150]},
            {'stars': 5, 'label': 'Private island', 'nightly': [220, 240]},
        ],
    },
    {
        'slug': 'russia',
        'name': 'Russia',
        'region': 'Eastern Europe',
        'capital': 'Moscow',
        'bestSeason': 'May-September',
        'intro': 'Historic capitals, grand palaces, and vast landscapes make Russia a commanding travel route.',
        'overview': 'Russia presents premium cultural depth in Moscow and Saint Petersburg, plus expansive countryside journeys.',
        'highlights': ['Moscow', 'Saint Petersburg', 'Golden Ring', 'Lake Baikal'],
        'culture': 'Russian travel is majestic, formal, and steeped in art, music, and imperial history.',
        'food': ['Borscht', 'Pelmeni', 'Caviar', 'Russian tea'],
        'practicalTips': ['Plan visas carefully', 'Book classical performances ahead', 'Use regional flights for long distances'],
        'accent': '#60a5fa',
        'coordinates': {'lat': 61.5240, 'lng': 105.3188},
        'travelVibe': 'Culture / History / Luxury',
        'travelStyle': 'Grand Europe',
        'budgetRange': 'USD 180-340 per day',
        'hotelPriceRange': 'USD 140-320 per night',
        'flightEstimateRange': 'USD 850-1,240',
        'estimatedDailyBudget': {'low': 180, 'high': 340, 'currency': 'USD'},
        'recommendedDuration': '9-13 days',
        'popularCities': ['Moscow', 'Saint Petersburg', 'Kazan', 'Sochi'],
        'topAttractions': ['Kremlin tour', 'Hermitage museum', 'Trans-Siberian scenic', 'Palace architecture'],
        'foodRecommendations': ['Dinner theater', 'Caviar tasting', 'Russian pastries'],
        'hotels': [
            {'stars': 3, 'label': 'City classic', 'nightly': [140, 190]},
            {'stars': 5, 'label': 'Imperial luxury', 'nightly': [300, 320]},
        ],
    },
    {
        'slug': 'colombia',
        'name': 'Colombia',
        'region': 'South America',
        'capital': 'Bogotá',
        'bestSeason': 'December-March, July-August',
        'intro': 'Coffee regions, Caribbean beaches, and lively cities form a colorful travel route.',
        'overview': 'Colombia offers premium value with diverse landscapes, culture, and fresh food across regions.',
        'highlights': ['Bogotá', 'Medellín', 'Cartagena', 'Coffee Triangle'],
        'culture': 'Colombian travel blends vivid street life, mountains, and warm hospitality.',
        'food': ['Arepas', 'Fresh seafood', 'Coffee tasting', 'Street fruits'],
        'practicalTips': ['Travel by internal flights', 'Use local guides in mountainous regions', 'Stay hydrated in cities'],
        'accent': '#f97316',
        'coordinates': {'lat': 4.5709, 'lng': -74.2973},
        'travelVibe': 'Culture / Adventure / Value',
        'travelStyle': 'Tropical discovery',
        'budgetRange': 'USD 110-220 per day',
        'hotelPriceRange': 'USD 90-210 per night',
        'flightEstimateRange': 'USD 720-980',
        'estimatedDailyBudget': {'low': 110, 'high': 220, 'currency': 'USD'},
        'recommendedDuration': '8-12 days',
        'popularCities': ['Bogotá', 'Medellín', 'Cartagena', 'Salento'],
        'topAttractions': ['Coffee finca', 'Colonial walled city', 'Andean scenery', 'Caribbean coast'],
        'foodRecommendations': ['Coffee tasting', 'Street arepas', 'Fresh ceviche'],
        'hotels': [
            {'stars': 3, 'label': 'City boutique', 'nightly': [90, 130]},
            {'stars': 5, 'label': 'Beach resort', 'nightly': [190, 210]},
        ],
    },
    {
        'slug': 'poland',
        'name': 'Poland',
        'region': 'Central Europe',
        'capital': 'Warsaw',
        'bestSeason': 'May-September',
        'intro': 'Historic cities, Baltic coastlines, and strong cultural energy define Poland travel.',
        'overview': 'Poland offers premium heritage routes at strong value with food, castles, and lake retreats.',
        'highlights': ['Kraków', 'Warsaw', 'Gdańsk', 'Zakopane'],
        'culture': 'Polish travel combines historic architecture, hearty cuisine, and emerging boutique hotels.',
        'food': ['Pierogi', 'Żurek', 'Bigos', 'Polish bread'],
        'practicalTips': ['Explore by train and local coach', 'Reserve Kraków attractions in advance', 'Try local markets'],
        'accent': '#f43f5e',
        'coordinates': {'lat': 51.9194, 'lng': 19.1451},
        'travelVibe': 'Culture / Value / History',
        'travelStyle': 'Eastern Europe charm',
        'budgetRange': 'USD 100-190 per day',
        'hotelPriceRange': 'USD 90-170 per night',
        'flightEstimateRange': 'USD 560-820',
        'estimatedDailyBudget': {'low': 100, 'high': 190, 'currency': 'USD'},
        'recommendedDuration': '6-10 days',
        'popularCities': ['Warsaw', 'Kraków', 'Gdańsk', 'Zakopane'],
        'topAttractions': ['Old Towns', 'Castle tours', 'Mountain hikes', 'Coastal ports'],
        'foodRecommendations': ['Pierogi dinner', 'Market snacks', 'Polish bakery treats'],
        'hotels': [
            {'stars': 3, 'label': 'Historic hotel', 'nightly': [90, 130]},
            {'stars': 5, 'label': 'Palace stay', 'nightly': [160, 170]},
        ],
    },
    {
        'slug': 'qatar',
        'name': 'Qatar',
        'region': 'Middle East',
        'capital': 'Doha',
        'bestSeason': 'October-March',
        'intro': 'Bold new museums, desert experiences, and luxury city stays.',
        'overview': 'Qatar offers premium future-facing hospitality and cultural attractions in a compact Gulf route.',
        'highlights': ['Doha', 'Museum District', 'Desert dunes', 'Souq Waqif'],
        'culture': 'Qatar travel is polished, very modern, and rooted in Arabian tradition.',
        'food': ['Mezze', 'Grilled meats', 'Arabic coffee', 'Seafood'],
        'practicalTips': ['Travel in fall or winter', 'Book museum tickets early', 'Dress modestly in markets'],
        'accent': '#818cf8',
        'coordinates': {'lat': 25.3548, 'lng': 51.1839},
        'travelVibe': 'Luxury / Culture / City',
        'travelStyle': 'Gulf discovery',
        'budgetRange': 'USD 240-430 per day',
        'hotelPriceRange': 'USD 200-390 per night',
        'flightEstimateRange': 'USD 900-1,220',
        'estimatedDailyBudget': {'low': 240, 'high': 430, 'currency': 'USD'},
        'recommendedDuration': '5-8 days',
        'popularCities': ['Doha', 'Al Khor', 'Souq Waqif', 'The Pearl'],
        'topAttractions': ['Museum of Islamic Art', 'Desert camp', 'Souq shopping', 'Coastal promenade'],
        'foodRecommendations': ['Luxury mezze', 'Street shawarma', 'Arabic coffee'],
        'hotels': [
            {'stars': 3, 'label': 'City ensemble', 'nightly': [200, 260]},
            {'stars': 5, 'label': 'Skyline palace', 'nightly': [360, 390]},
        ],
    },
    {
        'slug': 'belgium',
        'name': 'Belgium',
        'region': 'Western Europe',
        'capital': 'Brussels',
        'bestSeason': 'May-September',
        'intro': 'Canals, chocolate, beer, and compact premium city travel.',
        'overview': 'Belgium is a polished cultural route with strong food, art, and historic city charm.',
        'highlights': ['Brussels', 'Bruges', 'Ghent', 'Antwerp'],
        'culture': 'Belgian travel blends Renaissance architecture, culinary quality, and accessible luxury.',
        'food': ['Belgian waffles', 'Moules-frites', 'Chocolate', 'Beer pairings'],
        'practicalTips': ['Explore cities by train', 'Book museum passes in advance', 'Try local beer tasting tours'],
        'accent': '#f59e0b',
        'coordinates': {'lat': 50.5039, 'lng': 4.4699},
        'travelVibe': 'Culture / City / Food',
        'travelStyle': 'European gourmet',
        'budgetRange': 'USD 180-320 per day',
        'hotelPriceRange': 'USD 150-300 per night',
        'flightEstimateRange': 'USD 520-730',
        'estimatedDailyBudget': {'low': 180, 'high': 320, 'currency': 'USD'},
        'recommendedDuration': '6-9 days',
        'popularCities': ['Brussels', 'Bruges', 'Ghent', 'Antwerp'],
        'topAttractions': ['Grand Place', 'Canal tours', 'Beer cafes', 'Art museums'],
        'foodRecommendations': ['Belgian chocolate', 'Waffle stands', 'Beer tasting'],
        'hotels': [
            {'stars': 3, 'label': 'City classic', 'nightly': [150, 200]},
            {'stars': 5, 'label': 'Design hotel', 'nightly': [280, 300]},
        ],
    },
]


extra_texts = []
for country in extra_countries:
    parts = [
        '  {',
        f'    slug: "{country["slug"]}",',
        f'    name: "{country["name"]}",',
        f'    region: "{country["region"]}",',
        f'    capital: "{country["capital"]}",',
        f'    bestSeason: "{country["bestSeason"]}",',
        f'    intro: "{country["intro"]}",',
        f'    overview: "{country["overview"]}",',
        f'    highlights: {country["highlights"]!r},',
        f'    culture: "{country["culture"]}",',
        f'    food: {country["food"]!r},',
        f'    practicalTips: {country["practicalTips"]!r},',
        f'    accent: "{country["accent"]}",',
        f'    coordinates: {{ lat: {country["coordinates"]["lat"]}, lng: {country["coordinates"]["lng"]} }},',
        f'    travelVibe: "{country["travelVibe"]}",',
        f'    travelStyle: "{country["travelStyle"]}",',
        f'    budgetRange: "{country["budgetRange"]}",',
        f'    hotelPriceRange: "{country["hotelPriceRange"]}",',
        f'    flightEstimateRange: "{country["flightEstimateRange"]}",',
        f'    estimatedDailyBudget: {{ low: {country["estimatedDailyBudget"]["low"]}, high: {country["estimatedDailyBudget"]["high"]}, currency: "{country["estimatedDailyBudget"]["currency"]}" }},',
        f'    recommendedDuration: "{country["recommendedDuration"]}",',
        f'    popularCities: {country["popularCities"]!r},',
        f'    topAttractions: {country["topAttractions"]!r},',
        f'    foodRecommendations: {country["foodRecommendations"]!r},',
        '    hotels: [',
    ]
    for hotel in country['hotels']:
        parts.append(f'      {{ stars: {hotel["stars"]}, label: "{hotel["label"]}", nightly: {hotel["nightly"]} }},')
    parts.append('    ],')
    parts.append('  },')
    extra_texts.append('\n'.join(parts))

for segment in segments:
    obj_text = segment.strip()
    if obj_text.startswith('{'):
        obj_text = obj_text
    else:
        obj_text = '{' + obj_text
    updated = insert_fields(obj_text)
    objects.append(updated)

for extra in extra_texts:
    objects.append(extra)

new_body = '\n  },\n  {\n'.join(objects)
new_text = text[:array_start+1] + '\n' + new_body + '\n' + text[end:]
path.write_text(new_text, encoding='utf-8')
print('Wrote augmented countries file with', len(objects), 'entries')
