from pathlib import Path
text = Path('src/data/countries.ts').read_text(encoding='utf-8')
key = 'export const countries: Country[] = '
idx = text.index(key)
arr_start = text.index('= [', idx) + 2

depth = 0
end = None
for i in range(arr_start, len(text)):
    ch = text[i]
    if ch == '[':
        depth += 1
    elif ch == ']':
        depth -= 1
        if depth == 0:
            end = i
            break
print('start', arr_start, 'end', end)
segment = text[arr_start:end+1]
print('split_count', segment.count('\n  },\n  {'))
print('has_pattern', '\n  },\n  {' in segment)
parts = segment.split('\n  },\n  {')
print('parts len', len(parts))
print('last part tail', repr(parts[-1][-200:]))
