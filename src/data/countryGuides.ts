export type GuideListItem = {
  title: string;
  text: string;
};

export type GuideSection = {
  id: string;
  title: string;
  eyebrow: string;
  paragraphs: string[];
  items?: GuideListItem[];
};

export type CountryGuide = {
  heroImage: string;
  foodImage: string;
  placeImage: string;
  quickFacts: GuideListItem[];
  sections: GuideSection[];
  translations?: { en?: Partial<CountryGuide>; ru?: Partial<CountryGuide> };
};

const commonReadingNote =
  "This guide is written for slow reading: not as a shopping page, not as a tour package, but as a cultural file that helps a visitor understand how a country feels before they open a map or book anything.";

const imageFor = (query: string) =>
  `https://source.unsplash.com/1400x900/?${encodeURIComponent(query)}`;

const guideImages: Record<string, Pick<CountryGuide, "heroImage" | "foodImage" | "placeImage">> = {
  japan: {
    heroImage: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1400&q=85",
    foodImage: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1400&q=85",
    placeImage: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1400&q=85",
  },
  uzbekistan: {
    heroImage: imageFor("samarkand uzbekistan registan"),
    foodImage: imageFor("uzbek plov food"),
    placeImage: imageFor("bukhara uzbekistan"),
  },
  france: {
    heroImage: imageFor("paris france street"),
    foodImage: imageFor("french food table"),
    placeImage: imageFor("provence france village"),
  },
  brazil: {
    heroImage: imageFor("rio de janeiro brazil"),
    foodImage: imageFor("brazilian food"),
    placeImage: imageFor("iguazu falls brazil"),
  },
  egypt: {
    heroImage: imageFor("egypt pyramids nile"),
    foodImage: imageFor("egyptian food"),
    placeImage: imageFor("luxor egypt temple"),
  },
  turkey: {
    heroImage: imageFor("istanbul turkey mosque"),
    foodImage: imageFor("turkish breakfast"),
    placeImage: imageFor("cappadocia turkey"),
  },
  italy: {
    heroImage: imageFor("rome italy street"),
    foodImage: imageFor("italian food table"),
    placeImage: imageFor("venice italy canal"),
  },
  indonesia: {
    heroImage: imageFor("bali indonesia rice terrace"),
    foodImage: imageFor("indonesian food"),
    placeImage: imageFor("borobudur indonesia"),
  },
};

const facts: Record<string, GuideListItem[]> = {
  japan: [
    { title: "Time zone", text: "Japan Standard Time, UTC+9. The country does not use daylight saving time." },
    { title: "Capital", text: "Tokyo, one of the world's largest urban regions and the main transport gateway." },
    { title: "Language", text: "Japanese. English is visible in large stations, airports, and hotels, but learning greetings helps a lot." },
    { title: "Money", text: "Japanese yen. Cards are common in cities, but cash still matters in small restaurants, temples, and countryside routes." },
    { title: "Reading mood", text: "Japan rewards attention to small rules, quiet details, seasons, and neighborhood rhythm." },
  ],
  uzbekistan: [
    { title: "Time zone", text: "Uzbekistan Time, UTC+5. No daylight saving time is used." },
    { title: "Capital", text: "Tashkent, a broad, green, Soviet-era and modern city with metro stations, markets, and museums." },
    { title: "Language", text: "Uzbek is the state language. Russian is still widely understood in cities and transport contexts." },
    { title: "Money", text: "Uzbekistani som. Cards work in many places, but cash is useful for bazaars and small cafes." },
    { title: "Reading mood", text: "The country is best understood through Silk Road cities, family hospitality, craft, tea, bread, and courtyards." },
  ],
  france: [
    { title: "Time zone", text: "Metropolitan France uses Central European Time, UTC+1, and UTC+2 during summer time." },
    { title: "Capital", text: "Paris, a cultural capital for museums, fashion, literature, food, and urban walking." },
    { title: "Language", text: "French. Polite greetings before asking questions are part of everyday etiquette." },
    { title: "Money", text: "Euro. Cards are very common, with small cash useful for markets." },
    { title: "Reading mood", text: "France is about regions: each area has its own food, architecture, landscape, and pace." },
  ],
  brazil: [
    { title: "Time zone", text: "Brazil has multiple time zones, commonly UTC-2 to UTC-5 depending on region." },
    { title: "Capital", text: "Brasilia, a planned modernist capital distinct from coastal cultural centers." },
    { title: "Language", text: "Portuguese. Regional accents and expressions are important parts of local identity." },
    { title: "Money", text: "Brazilian real. Digital payments are common in cities, but keep a backup plan." },
    { title: "Reading mood", text: "Brazil should be understood by region: coast, rainforest, cities, waterfalls, music, and local community life." },
  ],
  egypt: [
    { title: "Time zone", text: "Egypt generally uses Eastern European Time, UTC+2, with seasonal rules that may vary by year." },
    { title: "Capital", text: "Cairo, a dense historic metropolis near Giza and the Nile." },
    { title: "Language", text: "Arabic, especially Egyptian Arabic in daily life. English is common in tourism zones." },
    { title: "Money", text: "Egyptian pound. Small notes are useful for tips, cafes, and local purchases." },
    { title: "Reading mood", text: "Egypt connects ancient monuments with living cities, river culture, desert landscapes, and religious traditions." },
  ],
  turkey: [
    { title: "Time zone", text: "Turkey Time, UTC+3. The country does not currently change clocks seasonally." },
    { title: "Capital", text: "Ankara, while Istanbul remains the largest cultural and historical gateway." },
    { title: "Language", text: "Turkish. Simple phrases are appreciated in markets, cafes, and smaller towns." },
    { title: "Money", text: "Turkish lira. Cards are common, with cash useful for markets and tea stops." },
    { title: "Reading mood", text: "Turkey sits across layers: Byzantine, Ottoman, Anatolian, Mediterranean, Black Sea, and modern urban life." },
  ],
  italy: [
    { title: "Time zone", text: "Central European Time, UTC+1, and UTC+2 during summer time." },
    { title: "Capital", text: "Rome, a city where ancient, religious, political, and everyday layers overlap." },
    { title: "Language", text: "Italian. Regional dialects and identities remain culturally important." },
    { title: "Money", text: "Euro. Cards are common, with cash useful in small towns and markets." },
    { title: "Reading mood", text: "Italy is not one style: food, architecture, gestures, and pace shift strongly by region." },
  ],
  indonesia: [
    { title: "Time zone", text: "Indonesia has three main time zones: UTC+7, UTC+8, and UTC+9." },
    { title: "Capital", text: "Jakarta remains the current capital and main air gateway." },
    { title: "Language", text: "Indonesian is the national language, with hundreds of local languages across islands." },
    { title: "Money", text: "Indonesian rupiah. Cash is useful outside major tourist districts." },
    { title: "Reading mood", text: "Indonesia is best read as an island world: religions, food, landscapes, and customs change from place to place." },
  ],
};

const guideTranslations: Record<string, { ru: Partial<CountryGuide> }> = {
  japan: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Япония использует стандартное время UTC+9. Переход на летнее время не применяется." },
        { title: "Столица", text: "Токио — один из крупнейших мегаполисов мира и главный транспортный узел." },
        { title: "Язык", text: "Японский. Английский встречается на крупных станциях, аэропортах и в гостиницах, но базовые приветствия сильно помогают." },
        { title: "Деньги", text: "Японская иена. В городах часто принимают карты, но наличные нужны в небольших кафе, храмах и селах." },
        { title: "Настроение чтения", text: "Япония вознаграждает внимательных: мелкие правила, тихие детали, сезоны и ритм районов." },
      ],
    },
  },
  uzbekistan: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Узбекистан использует UTC+5. Летнее время не применяется." },
        { title: "Столица", text: "Ташкент, просторный, зелёный город советского и современного видов, с метро, базарами и музеями." },
        { title: "Язык", text: "Узбекский — государственный язык. Русский широко понятен в городах и транспорте." },
        { title: "Деньги", text: "Узбекский сум. Карты работают во многих местах, но наличные полезны на базарах и в мелких кафе." },
        { title: "Настроение чтения", text: "Страна лучше понимается через города Шёлкового пути, гостеприимство, ремёсла, чай, хлеб и дворы." },
      ],
    },
  },
  france: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Метрополитен Франции использует Центральноевропейское время UTC+1 зимой и UTC+2 летом." },
        { title: "Столица", text: "Париж, культурная столица музеев, моды, литературы, еды и прогулок." },
        { title: "Язык", text: "Французский. Вежливые приветствия перед вопросами — часть ежедневной этики." },
        { title: "Деньги", text: "Евро. Карты очень распространены, наличные лучше для рынков." },
        { title: "Настроение чтения", text: "Франция — это регионы: в каждом своя еда, архитектура, пейзаж и темп." },
      ],
    },
  },
  brazil: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Бразилия охватывает несколько часовых поясов, обычно UTC-2 до UTC-5 в зависимости от региона." },
        { title: "Столица", text: "Бразилиа, спланированная модернистская столица, отличная от прибрежных культурных центров." },
        { title: "Язык", text: "Португальский. Региональные акценты и выражения — важная часть местной идентичности." },
        { title: "Деньги", text: "Бразильский реал. Цифровые платежи распространены в городах, но имейте запасной план." },
        { title: "Настроение чтения", text: "Бразилию лучше понимать по регионам: побережье, тропический лес, города, водопады, музыка и местная жизнь." },
      ],
    },
  },
  egypt: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Египет обычно использует восточноевропейское время UTC+2; сезонные правила могут меняться." },
        { title: "Столица", text: "Каир, плотный исторический мегаполис рядом с Гизой и Нилом." },
        { title: "Язык", text: "Арабский, особенно египетский диалект в повседневной жизни. Английский распространён в туристических зонах." },
        { title: "Деньги", text: "Египетский фунт. Мелкие купюры пригодятся для чаевых, кафе и локальных покупок." },
        { title: "Настроение чтения", text: "Египет соединяет древние памятники с живыми городами, речной культурой, пустыней и религиозными традициями." },
      ],
    },
  },
  turkey: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Турция использует UTC+3. Стрелки часов не переводятся сезонно." },
        { title: "Столица", text: "Анкара, тогда как Стамбул остаётся крупнейшим культурным и историческим входом." },
        { title: "Язык", text: "Турецкий. Простые фразы ценятся на рынках, в кафе и маленьких городках." },
        { title: "Деньги", text: "Турецкая лира. Карты распространены, наличные полезны на базарах и чайных." },
        { title: "Настроение чтения", text: "Турция лежит на слоях: Византия, Османская империя, Анатолия, Средиземное море, Чёрное море и современная городская жизнь." },
      ],
    },
  },
  italy: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Центральноевропейское время UTC+1 и UTC+2 летом." },
        { title: "Столица", text: "Рим, город, где древность, религия, политика и повседневность пересекаются." },
        { title: "Язык", text: "Итальянский. Региональные диалекты и идентичности остаются важными." },
        { title: "Деньги", text: "Евро. Карты распространены, наличные удобны в небольших городах и на рынках." },
        { title: "Настроение чтения", text: "Италия не одинакова: еда, архитектура, жесты и темп сильно меняются от региона к региону." },
      ],
    },
  },
  indonesia: {
    ru: {
      quickFacts: [
        { title: "Часовой пояс", text: "Индонезия имеет три основных часовых пояса: UTC+7, UTC+8 и UTC+9." },
        { title: "Столица", text: "Джакарта остаётся текущей столицей и главным авиаузлом." },
        { title: "Язык", text: "Индонезийский — национальный язык, с сотнями местных языков на островах." },
        { title: "Деньги", text: "Индонезийская рупия. Наличные полезны вне основных туристических районов." },
        { title: "Настроение чтения", text: "Индонезия лучше всего читается как островной мир: религии, еда, ландшафты и обычаи меняются от места к месту." },
      ],
    },
  },
};

function baseSections(countryName: string): GuideSection[] {
  return [
    {
      id: "story",
      eyebrow: "01 / Country story",
      title: `${countryName} is...`,
      paragraphs: [
        `${countryName} is not just a point on the globe. It is a living collection of landscapes, daily habits, architecture, food smells, family rituals, old beliefs, modern cities, and small details that a fast visitor can easily miss.`,
        commonReadingNote,
        "When you read about a country, try to imagine the ordinary day first: how people greet each other, where they buy bread or breakfast, what sounds come from the street, how public transport feels, what people wear for celebration, and what kind of silence exists in temples, museums, old towns, or family homes.",
      ],
    },
    {
      id: "history",
      eyebrow: "02 / Long history",
      title: "History in simple words",
      paragraphs: [
        `The history of ${countryName} can be read through movement: migration, trade, religion, war, rebuilding, and exchange with neighboring cultures. No country appears in one moment; it becomes itself through centuries of contact and change.`,
        "Older traditions often survive inside ordinary behavior. A greeting, a meal, a festival costume, a temple rule, a market habit, or a family celebration can carry memory from a time long before the modern state existed.",
        "For a traveler, history is useful because it explains why cities are shaped the way they are. It explains why some districts are ceremonial, why some foods are eaten on holidays, why certain colors feel formal, and why local people may care deeply about places that look simple from the outside.",
      ],
      items: [
        { title: "Ancient layer", text: "Look for old routes, religious sites, burial traditions, myths, and early settlement patterns." },
        { title: "Trade layer", text: "Markets, ports, caravan routes, railways, and craft streets often show how the country connected to the outside world." },
        { title: "Modern layer", text: "Recent architecture, transport, schools, media, and youth culture show how tradition continues to change." },
      ],
    },
    {
      id: "culture",
      eyebrow: "03 / Culture",
      title: "Culture, values, and daily behavior",
      paragraphs: [
        `Culture in ${countryName} is visible in how people create order around everyday life. It appears in the speed of service, the way elders are treated, the tone of a greeting, the importance of family, and the difference between public and private behavior.`,
        "A visitor should not try to perform culture perfectly. It is enough to observe carefully, speak politely, dress with awareness, and understand that local habits are not decorations; they are practical ways people protect comfort, respect, and belonging.",
        "The most important rule is simple: when you do not know what to do, slow down. Watch how local people enter a sacred place, how they stand in line, how loudly they speak, how they handle shoes, money, food, and personal space.",
      ],
      items: [
        { title: "Greetings", text: "A calm greeting before a question often changes the whole interaction." },
        { title: "Family", text: "Family reputation, elder respect, and hospitality may shape decisions more than strict individual preference." },
        { title: "Public behavior", text: "Noise, personal space, and direct criticism have different meanings from country to country." },
      ],
    },
    {
      id: "customs",
      eyebrow: "04 / Customs",
      title: "Customs, etiquette, and small rules",
      paragraphs: [
        "Customs are the small invisible roads of society. They tell people when to remove shoes, when to bring a gift, where to sit, how to accept food, and how to show gratitude without making the moment awkward.",
        `In ${countryName}, as in many places, etiquette is not only about being formal. It is about making other people comfortable. The traveler who learns a few local customs will usually receive warmer explanations, better recommendations, and more patient help.`,
        "The safest travel attitude is gentle curiosity. Ask before photographing people, avoid treating religious places as stages, and remember that a home, a market, a shrine, a cemetery, or a village street may carry meanings that are not obvious in a photo.",
      ],
      items: [
        { title: "Shoes", text: "In many cultures shoes may be removed in homes, sacred spaces, or specific rooms." },
        { title: "Photos", text: "People, ceremonies, and religious interiors should be photographed only with permission." },
        { title: "Gifts", text: "Small gifts can be meaningful, especially when visiting homes or family-run places." },
        { title: "Voice", text: "A lower, calmer voice often communicates respect in museums, transport, and sacred spaces." },
      ],
    },
    {
      id: "holidays",
      eyebrow: "05 / Holidays",
      title: "Holidays, festivals, and celebration rhythm",
      paragraphs: [
        `Holidays in ${countryName} are a doorway into memory. Public celebrations often mix religion, agriculture, national history, family gatherings, music, clothing, and food. They are not only days off; they are days when a society tells stories about itself.`,
        "Some festivals are loud and public, with parades, markets, fireworks, music, or crowded streets. Others are private and family-centered, built around meals, cemetery visits, prayer, gift-giving, or time with elders.",
        "A traveler should check exact holiday dates before a trip because transport, museums, restaurants, and government offices can change schedules. But culturally, holidays are also a chance to see clothing, songs, seasonal foods, and local pride in one place.",
      ],
      items: [
        { title: "National holidays", text: "Often connected with independence, republic history, leaders, or major political events." },
        { title: "Religious holidays", text: "May follow lunar or liturgical calendars, so dates can shift each year." },
        { title: "Seasonal festivals", text: "Often connected with spring, harvest, flowers, water, light, or the changing weather." },
      ],
    },
    {
      id: "food",
      eyebrow: "06 / Food",
      title: "About food",
      paragraphs: [
        `Food in ${countryName} is one of the easiest ways to understand the country because it connects climate, religion, trade, family, and daily schedule. A dish is never only ingredients; it is also who cooks it, when it is served, and what kind of gathering surrounds it.`,
        "A good food route should include famous dishes, but also ordinary meals: breakfast, snacks near stations, market fruit, tea or coffee habits, bread, street food, family restaurants, and sweets that appear around holidays.",
        "When reading a menu, notice cooking methods. Grilled, steamed, fermented, baked, raw, pickled, fried, and slow-cooked foods each tell you something about climate, preservation, tools, and older household routines.",
      ],
      items: [
        { title: "Main dishes", text: "Look for dishes that locals connect with family gatherings, weekends, or celebration tables." },
        { title: "Street snacks", text: "Small foods are often the best introduction to a city because they show working-day rhythm." },
        { title: "Drinks", text: "Tea, coffee, juices, dairy drinks, or local soft drinks often have their own etiquette." },
        { title: "Sweets", text: "Desserts can reveal holiday history, imported ingredients, and regional pride." },
      ],
    },
    {
      id: "utensils",
      eyebrow: "07 / Table culture",
      title: "Tableware, utensils, and eating etiquette",
      paragraphs: [
        `Eating tools in ${countryName} can include forks, spoons, knives, chopsticks, hands, bread, small bowls, shared plates, or serving spoons depending on the meal. The tool is part of the culture, not just a practical object.`,
        "In many countries, table etiquette changes by setting. A family table may be relaxed, a formal dinner may follow stricter order, and street food may have its own fast, practical style. Shared dishes can also change the meaning of personal space.",
        "The important thing is to notice how food is offered and accepted. Taking too much first, refusing too strongly, pointing with utensils, eating before elders, or mishandling shared dishes can feel rude in some places even if no one says it directly.",
      ],
      items: [
        { title: "Shared plates", text: "Use serving utensils when they are provided and avoid touching shared food with personal utensils." },
        { title: "Hands", text: "Where eating by hand is normal, the right hand is often preferred, especially in traditional contexts." },
        { title: "Chopsticks", text: "Never use them as toys, never stick them upright into rice, and avoid pointing with them." },
        { title: "Bread", text: "In many cultures bread is treated with special respect and may function like a utensil." },
      ],
    },
    {
      id: "clothing",
      eyebrow: "08 / Clothing",
      title: "Traditional clothes, modern style, and dress codes",
      paragraphs: [
        `Clothing in ${countryName} can show region, religion, climate, celebration, age, profession, and personal style. Traditional dress is often strongest at weddings, festivals, dance performances, religious events, and national celebrations.`,
        "Modern clothing in cities may look global, but formal expectations still matter. Sacred places, government buildings, rural areas, and family ceremonies can require more modest or careful dress than shopping streets or beach towns.",
        "Textiles are also history. Patterns, embroidery, weaving, dyes, headwear, belts, footwear, and ceremonial garments often preserve older ideas about beauty, protection, status, family, and regional identity.",
      ],
      items: [
        { title: "Daily clothing", text: "Urban daily style may be practical and international, but local ideas of neatness still matter." },
        { title: "Religious sites", text: "Covered shoulders, longer clothing, or removing shoes may be expected." },
        { title: "Ceremonial dress", text: "Wedding and festival clothing often carries symbols of family, luck, purity, maturity, or respect." },
      ],
    },
    {
      id: "places",
      eyebrow: "09 / Places",
      title: "Popular places and how to read them",
      paragraphs: [
        `The famous places of ${countryName} are useful starting points, but they should not be treated as a checklist. A landmark becomes more interesting when you understand who built it, who uses it now, what neighborhood surrounds it, and how local people feel about it.`,
        "Good routes mix major sights with ordinary spaces: train stations, markets, parks, river walks, residential streets, old shops, university areas, and small museums. These places show the country between postcard moments.",
        "When planning, keep distance honest. Some countries look small on a screen but take time to cross. Others have fast trains or strong domestic flights. A slower route often gives more real understanding than trying to collect too many cities.",
      ],
      items: [
        { title: "Capital city", text: "Usually the easiest place to understand transport, museums, and modern national identity." },
        { title: "Historic towns", text: "Show older architecture, craft, religion, and local memory in a smaller space." },
        { title: "Nature routes", text: "Mountains, coast, desert, forests, rivers, or islands explain food and settlement patterns." },
        { title: "Markets", text: "Markets show seasonal produce, bargaining culture, street food, and everyday design." },
      ],
    },
    {
      id: "practical",
      eyebrow: "10 / Practical guide",
      title: "Practical notes for respectful travel",
      paragraphs: [
        `A respectful visit to ${countryName} starts before arrival. Learn greetings, check local transport, understand climate, and read about dress rules for religious or traditional spaces. Small preparation makes the trip calmer and more interesting.`,
        "Do not build the whole trip around photos. Build it around time: time to sit, read signs, eat slowly, ask questions, return to one neighborhood, and notice changes between morning and evening.",
        "The best traveler is not the one who knows every fact. It is the one who can enter a place without making it smaller, who understands that people live there before and after the visitor arrives.",
      ],
      items: [
        { title: "Before visiting", text: "Check visa rules, local holidays, weather, transport schedules, and museum closures." },
        { title: "During the trip", text: "Keep cash backup, respect queues, ask before photos, and dress carefully where needed." },
        { title: "After reading", text: "Choose a few topics to explore deeper: music, architecture, food, religion, textiles, or language." },
      ],
    },
  ];
}

const japanSections: GuideSection[] = [
  {
    id: "story",
    eyebrow: "01 / First impression",
    title: "Japan is a country of seasons, manners, and layered memory",
    paragraphs: [
      "Japan is often imagined through a few strong images: cherry blossoms, Tokyo lights, Mount Fuji, bullet trains, temples, anime, sushi, and quiet gardens. Those images are real, but they are only the surface. The deeper feeling of Japan comes from contrast: old wooden shrines beside convenience stores, formal etiquette inside fast modern cities, handmade craft beside advanced robotics, and tiny seasonal details inside a very organized public life.",
      "A visitor usually notices order first. Trains are precise, streets are clean, people queue carefully, and many interactions follow an expected rhythm. But Japan is not cold or mechanical. The system is built to make shared space comfortable: less noise on trains, careful packaging, clear signs, seasonal greetings, and a strong habit of thinking about the person next to you.",
      "The country is also extremely regional. Tokyo is not Kyoto, Kyoto is not Hokkaido, and Okinawa has a completely different island history and climate. Food, dialect, festivals, architecture, and local pride change as you move. A good Japan trip is not only a list of famous places; it is a slow reading of how each place organizes beauty, respect, memory, and daily life.",
    ],
  },
  {
    id: "history",
    eyebrow: "02 / History",
    title: "A short history from ancient pottery to modern cities",
    paragraphs: [
      "Japan's human story is very old. The Jōmon period is famous for some of the world's early pottery traditions and for communities that lived by hunting, fishing, gathering, and managing local resources. Later, the Yayoi period brought wet-rice agriculture, new social organization, and stronger links with the Asian mainland. These early layers matter because rice, seasonal farming, ritual, and village life remained important in Japanese identity for centuries.",
      "Classical Japan developed court culture, writing, Buddhism, and refined arts connected with the imperial capital. Kyoto became one of the great cultural centers of East Asia. Over time, warrior rule grew stronger, and samurai families shaped politics, landholding, military values, and ideas of loyalty. The medieval period was not only war; it also produced temple culture, tea practice, gardens, Noh theater, and craft traditions.",
      "The Edo period, from the early 1600s to the mid-1800s, brought long internal peace under Tokugawa rule. Cities expanded, merchant culture grew, kabuki and ukiyo-e prints became popular, and many customs now associated with 'traditional Japan' matured. The Meiji Restoration in 1868 transformed the country again: Japan rapidly modernized its government, military, industry, education, and infrastructure while negotiating what to keep from older culture.",
      "The 20th century included empire, war, destruction, occupation, constitutional change, reconstruction, and extraordinary economic growth. Today Japan is a highly developed country whose modern life still carries older forms: shrine visits at New Year, seasonal food, school ceremonies, family graves, tea rooms, festival floats, and local crafts. The important point is not that Japan is 'old' or 'modern'; it is both at once.",
    ],
    items: [
      { title: "Jōmon and Yayoi", text: "Early pottery, settled communities, rice cultivation, and new social structures created deep foundations for later Japanese life." },
      { title: "Classical capitals", text: "Nara and Kyoto shaped religion, writing, aristocratic culture, temple architecture, and courtly ideas of beauty." },
      { title: "Samurai and shoguns", text: "Warrior governments shaped land, law, loyalty, military culture, and many later stories about honor and discipline." },
      { title: "Edo to Meiji", text: "Urban culture flourished in Edo, then Meiji reforms pushed Japan into rapid modern state-building and industrialization." },
    ],
  },
  {
    id: "culture",
    eyebrow: "03 / Culture",
    title: "Culture: harmony, form, seasonality, and attention",
    paragraphs: [
      "Japanese culture is often described through harmony, respect, cleanliness, and attention to form. These words can sound simple, but in daily life they appear everywhere: in how people bow, how gifts are wrapped, how shoes are removed, how food is arranged, how silence is respected, and how public behavior is adjusted so others are not disturbed.",
      "Seasonality is one of the strongest cultural ideas. Spring cherry blossoms, summer festivals, autumn leaves, and winter foods are not just tourist marketing; they shape menus, packaging, greetings, poetry, school calendars, clothing, and travel habits. Even convenience stores change products by season, and traditional sweets often reflect flowers, snow, moon-viewing, or harvest imagery.",
      "Another important idea is the value of form. A tea ceremony, a temple visit, a business card exchange, a school entrance ceremony, or a formal meal may follow steps that look strict from outside. The point is not empty rules. The form creates a shared space where people know how to behave and can show respect without needing to explain everything in words.",
    ],
    items: [
      { title: "Wa", text: "The idea of social harmony encourages people to avoid unnecessary conflict and think about group comfort." },
      { title: "Omotenashi", text: "Hospitality is often shown through anticipation: preparing details before a guest asks for them." },
      { title: "Mono no aware", text: "A sensitivity to impermanence appears in cherry blossoms, autumn leaves, old houses, and seasonal art." },
      { title: "Cleanliness", text: "Clean public behavior connects practical hygiene with school habits, shrine purification, and respect for shared space." },
    ],
  },
  {
    id: "customs",
    eyebrow: "04 / Customs",
    title: "Customs and etiquette a visitor should understand",
    paragraphs: [
      "The first rule is to observe. Japan has many small etiquette patterns, and local people do not expect a visitor to know everything. They do appreciate calm behavior, soft speech in shared spaces, careful handling of objects, and an attempt to follow visible rules.",
      "Bowing is a common greeting and sign of thanks, apology, respect, or acknowledgement. Visitors do not need to calculate the exact angle; a small respectful bow is enough in most casual situations. In shops and restaurants, staff may use very polite language and formal gestures. You can answer simply with a smile, a nod, and basic phrases.",
      "Shoes are important. In homes, traditional inns, some restaurants, temples, fitting rooms, and places with tatami flooring, shoes may need to be removed. Slippers may be provided, and toilet slippers should not be worn back into other rooms. This sounds tiny, but it is one of the easiest ways to show awareness.",
      "Public transport has its own quiet code. Phone calls on trains are generally avoided, backpacks should be moved so they do not hit people, and priority seats should be respected. Escalator standing sides can vary by region. Eating while walking is less common than in some countries, though train bentos and festival food are normal in the right setting.",
    ],
    items: [
      { title: "Before eating", text: "People often say itadakimasu before a meal and gochisosama desu after finishing." },
      { title: "Photos", text: "Ask before photographing people, private shops, ceremonies, or interiors where signs restrict cameras." },
      { title: "Money", text: "Cash may be placed in a small tray rather than handed directly to a cashier." },
      { title: "Onsen", text: "Wash before entering the bath, keep towels out of the water, and check tattoo rules before visiting." },
    ],
  },
  {
    id: "holidays",
    eyebrow: "05 / Holidays",
    title: "Holidays and festivals: matsuri, New Year, and seasonal memory",
    paragraphs: [
      "Japan has national holidays, local festivals, Buddhist observances, Shinto shrine events, and seasonal celebrations. The most important family period is New Year. Many people clean the house, eat special foods, visit shrines or temples, send greetings, and spend time with relatives. The first shrine visit of the year, hatsumode, is one of the most visible public traditions.",
      "Cherry blossom season is not a single official holiday, but hanami is one of Japan's best-known seasonal customs. People gather under blooming trees for walks, picnics, photographs, and quiet appreciation of beauty that lasts only a short time. This is why cherry blossoms are so emotionally powerful: they are beautiful because they disappear.",
      "Summer brings many matsuri. These festivals often include portable shrines, floats, drums, dances, lanterns, food stalls, yukata, and neighborhood participation. Some are linked to Shinto shrines, some to Buddhist customs, some to local history, and some to harvest or seasonal protection. Fireworks festivals are also a major part of summer atmosphere.",
      "Obon, usually in summer, is connected with honoring ancestors. Families may visit graves, lanterns may be used symbolically, and Bon odori dances can appear in local communities. In autumn, moon-viewing, harvest themes, and colorful leaves shape travel and food. Winter brings illumination events, hot dishes, snow festivals in northern areas, and New Year preparation.",
    ],
    items: [
      { title: "Shogatsu", text: "New Year is the major family holiday, with shrine visits, special foods, cards, and house cleaning." },
      { title: "Hanami", text: "Cherry blossom viewing celebrates spring, beauty, friendship, photography, and the feeling of impermanence." },
      { title: "Obon", text: "A Buddhist-influenced period for remembering ancestors, visiting graves, and joining local dances." },
      { title: "Matsuri", text: "Local festivals often combine shrine ritual, music, floats, food stalls, and neighborhood identity." },
    ],
  },
  {
    id: "food",
    eyebrow: "06 / Food",
    title: "Food: washoku, rice, seasonality, and everyday comfort",
    paragraphs: [
      "Japanese food is much wider than sushi and ramen. The traditional dietary culture known as washoku emphasizes rice, soup, side dishes, seasonal ingredients, balance, and presentation. A simple meal may include rice, miso soup, pickles, grilled fish, vegetables, and tea. The arrangement matters because Japanese cuisine often values color, season, texture, and the feeling of the dish as much as size.",
      "Rice is central. It appears as plain steamed rice, onigiri, sushi rice, rice crackers, mochi, sake, and ceremonial foods. Miso, soy sauce, dashi, seaweed, tofu, pickles, and fermented ingredients give many dishes their depth. Fish and seafood are important because of Japan's geography, but mountain vegetables, noodles, wagashi sweets, beef, pork, chicken, and regional specialties are also essential.",
      "Everyday food can be extremely accessible. Convenience stores sell onigiri, bento, sandwiches, drinks, desserts, and seasonal snacks. Train stations sell ekiben lunch boxes connected with regional identity. Small ramen shops, curry houses, soba restaurants, izakaya, bakeries, department-store food halls, and family restaurants all show different layers of modern eating.",
    ],
    items: [
      { title: "Sushi", text: "Vinegared rice with seafood or other toppings; from casual conveyor-belt shops to formal counter dining." },
      { title: "Ramen", text: "Noodles in broth with regional styles such as miso ramen in Hokkaido or tonkotsu ramen in Kyushu." },
      { title: "Tempura", text: "Seafood or vegetables fried in a light batter, often served with dipping sauce, salt, rice, or soba." },
      { title: "Onigiri", text: "Rice balls, often wrapped in nori and filled with salmon, umeboshi, tuna mayo, kombu, or other fillings." },
      { title: "Okonomiyaki", text: "A savory pancake associated especially with Osaka and Hiroshima, cooked with cabbage and various toppings." },
      { title: "Kaiseki", text: "A refined multi-course meal connected with seasonality, tea culture, ceramics, and careful presentation." },
    ],
  },
  {
    id: "utensils",
    eyebrow: "07 / Table culture",
    title: "Chopsticks, bowls, shared dishes, and table manners",
    paragraphs: [
      "Chopsticks are the main eating utensil for many Japanese meals, but spoons, forks, knives, ladles, skewers, and hands are also used depending on the dish. Ramen is eaten with chopsticks and a spoon, curry rice with a spoon, some street snacks by hand, and Western-style dishes with Western utensils.",
      "Chopstick etiquette matters because some actions resemble funeral rituals. Do not stick chopsticks upright into rice, and do not pass food directly from chopsticks to another person's chopsticks. Avoid pointing with chopsticks, waving them around, moving plates with them, or digging through a shared dish looking for a preferred piece.",
      "Bowls may be lifted closer to the mouth for rice or soup. Slurping noodles is acceptable and often normal, especially with ramen, soba, and udon. Soy sauce should be used carefully, not poured over everything. At sushi restaurants, dipping the fish side lightly rather than soaking the rice can help preserve texture and balance.",
    ],
    items: [
      { title: "Hashi", text: "Chopsticks are used for rice, fish, noodles, vegetables, pickles, and many shared dishes." },
      { title: "Hashioki", text: "A chopstick rest may be used between bites; if none exists, use the paper wrapper neatly." },
      { title: "Rice bowl", text: "It is normal to lift a rice bowl, but avoid mixing all dishes together unless the dish is designed that way." },
      { title: "Shared food", text: "Use serving chopsticks when available, or reverse your chopsticks only if the setting makes that acceptable." },
    ],
  },
  {
    id: "clothing",
    eyebrow: "08 / Clothing",
    title: "Kimono, yukata, uniforms, and the meaning of neatness",
    paragraphs: [
      "Traditional Japanese clothing is not everyday wear for most people, but it remains culturally important. Kimono are worn for weddings, tea ceremony, coming-of-age ceremonies, formal visits, graduations, and other special occasions. The garment is connected with season, age, gender, formality, textile design, family tradition, and the skill of dressing.",
      "Yukata are lighter cotton garments often seen at summer festivals, fireworks events, hot-spring towns, and traditional inns. They are easier to wear than formal kimono and create a strong summer atmosphere. Accessories such as obi belts, geta sandals, tabi socks, hair ornaments, and small bags complete the look.",
      "Modern Japanese clothing ranges from business suits and school uniforms to street fashion, outdoor wear, minimalist design, and subcultures in neighborhoods such as Harajuku. Even when clothing is casual, neatness and appropriateness matter. A visitor should dress more carefully for temples, shrines, formal restaurants, traditional inns, and rural community events.",
    ],
    items: [
      { title: "Kimono", text: "A formal traditional garment with seasonal fabrics, symbolic patterns, and complex rules of formality." },
      { title: "Yukata", text: "A casual summer robe often worn at festivals, fireworks, hot springs, and ryokan." },
      { title: "Obi", text: "The sash used with kimono or yukata, tied in different styles depending on age and formality." },
      { title: "Geta and zori", text: "Traditional footwear that changes with garment type, season, and formal level." },
    ],
  },
  {
    id: "places",
    eyebrow: "09 / Places",
    title: "Popular places and what they teach you",
    paragraphs: [
      "Tokyo teaches modern scale: rail networks, vertical neighborhoods, tiny bars, quiet residential lanes, museums, design stores, electronics districts, and parks that feel calm inside a huge city. Kyoto teaches continuity: temples, shrines, gardens, old streets, craft, tea, and seasonal beauty. Osaka teaches food energy, humor, nightlife, and merchant-city directness.",
      "Nara shows early state history and Buddhist temple culture. Hiroshima teaches memory, peace, reconstruction, and the human meaning of war. Hokkaido gives wide landscapes, snow, dairy, seafood, national parks, and Ainu cultural history. Okinawa has subtropical islands, Ryukyu heritage, music, different food, and a separate historical identity within modern Japan.",
      "Mount Fuji is both a physical mountain and a cultural symbol. It appears in art, religion, tourism, and national imagination. But smaller places can be just as meaningful: a local shotengai shopping street, a neighborhood shrine, a countryside station, a family restaurant, a pottery town, or a quiet morning market.",
    ],
    items: [
      { title: "Tokyo", text: "Best for modern Japan, transport, museums, food variety, design, pop culture, and neighborhood wandering." },
      { title: "Kyoto", text: "Best for temples, shrines, gardens, craft, tea culture, and historical atmosphere." },
      { title: "Nara", text: "Best for early Buddhist monuments, deer park walks, and older capital history." },
      { title: "Hiroshima", text: "Best for peace history, reconstruction, Miyajima access, and regional food such as okonomiyaki." },
      { title: "Hokkaido", text: "Best for snow, open landscapes, seafood, national parks, and summer flower fields." },
      { title: "Okinawa", text: "Best for island culture, beaches, Ryukyu history, music, and subtropical food." },
    ],
  },
  {
    id: "practical",
    eyebrow: "10 / Practical guide",
    title: "Practical reading before a first Japan trip",
    paragraphs: [
      "Japan is easy to travel in but rewards preparation. Learn how IC cards work, check train routes before moving between cities, reserve popular Shinkansen routes during busy seasons, and avoid building a schedule where every day is overloaded. Distances inside cities can be larger than they look on a map because station complexes are huge.",
      "Cash is still useful, especially for small restaurants, temples, rural buses, older shops, coin lockers, and markets. Convenience stores are extremely helpful for ATMs, snacks, umbrellas, basic toiletries, ticket machines, and quick meals. Trash bins can be hard to find, so carry small rubbish until you reach a station, convenience store, hotel, or park bin.",
      "The best way to enjoy Japan is to combine famous sights with ordinary routines. Visit a major temple, but also sit near a small shrine. Eat sushi, but also try an onigiri breakfast. Ride the Shinkansen, but also take a local train. Photograph cherry blossoms, but also notice shop signs, ceramic bowls, packaging, school uniforms, seasonal sweets, and the sound of a neighborhood at night.",
    ],
    items: [
      { title: "Time zone", text: "Japan uses Japan Standard Time, UTC+9, with no daylight saving time." },
      { title: "Transport", text: "Rail is excellent, but big stations are complex; leave transfer time and check platform details." },
      { title: "Money", text: "Cards are common in cities, but cash remains useful for small local places." },
      { title: "Respect", text: "Quiet public behavior, shoe rules, photo permission, and careful chopstick use matter." },
    ],
  },
];

export function getCountryGuide(slug: string, countryName: string): CountryGuide {
  const images = guideImages[slug] ?? {
    heroImage: imageFor(`${countryName} landscape`),
    foodImage: imageFor(`${countryName} food`),
    placeImage: imageFor(`${countryName} travel place`),
  };

  return {
    ...images,
    quickFacts: facts[slug] ?? [
      { title: "Time zone", text: "Check the exact local time zone before planning calls or arrivals." },
      { title: "Capital", text: "The capital is usually the best starting point for museums and transport." },
      { title: "Language", text: "Learn greetings and polite phrases before arrival." },
      { title: "Money", text: "Carry a payment backup because card acceptance can change by region." },
      { title: "Reading mood", text: "Read slowly and compare history, culture, food, and daily etiquette." },
    ],
    sections: slug === "japan" ? japanSections : baseSections(countryName),
    translations: guideTranslations[slug],
  };
}
