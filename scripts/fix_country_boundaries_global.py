from pathlib import Path
path = Path('src/data/countries.ts')
text = path.read_text(encoding='utf-8')
text = text.replace('\n  },\n  },\n  {', '\n  },\n  {')
text = text.replace('\n  {\n{', '\n  {\n    ')
path.write_text(text, encoding='utf-8')
print('Applied global boundary fixes')
