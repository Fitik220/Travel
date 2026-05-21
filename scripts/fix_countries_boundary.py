from pathlib import Path
path = Path('src/data/countries.ts')
text = path.read_text(encoding='utf-8')
text = text.replace('  {  {', '  {')
text = text.replace('  },\n  },\n];;', '  },\n];')
path.write_text(text, encoding='utf-8')
print('Fixed object boundaries')
