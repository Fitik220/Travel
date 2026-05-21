from pathlib import Path
path = Path('src/data/countries.ts')
text = path.read_text(encoding='utf-8')
text = text.replace('\n  {\n{slug:', '\n  {\n    slug:')
text = text.replace('\n  {\n{slug:', '\n  {\n    slug:')
path.write_text(text, encoding='utf-8')
print('Repaired extra opening braces')
