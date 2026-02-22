import re, json

with open(r'D:\Ekrem Abi\ASO ILTEK\aso-iltek-web\src\data\turkey.svg', 'r', encoding='utf-8') as f:
    content = f.read()

# The SVG has d before id/name: <path d="..." id="TR75" name="Ardahan">
paths = re.findall(r'<path\s+d="([^"]+)"\s+id="([^"]+)"\s+name="([^"]+)"', content)
print(f'Found {len(paths)} province paths')

# Also extract label positions from the circles
labels = re.findall(r'<circle\s+class="([^"]+)"\s+cx="([^"]+)"\s+cy="([^"]+)"\s+id="([^"]+)"', content)
print(f'Found {len(labels)} label positions')

label_map = {}
for name, cx, cy, id_val in labels:
    label_map[id_val] = {'name': name, 'cx': float(cx), 'cy': float(cy)}

# Build combined data
provinces_data = []
for d, id_val, name in paths:
    label = label_map.get(id_val, {})
    provinces_data.append({
        'id': id_val,
        'name': name,
        'labelName': label.get('name', name),
        'cx': label.get('cx', 0),
        'cy': label.get('cy', 0),
        'd': d
    })

print(f'Total provinces for JS: {len(provinces_data)}')
for p in provinces_data[:5]:
    print(f"  {p['id']}: {p['name']} ({p['cx']}, {p['cy']})")

# Write JS file
with open(r'D:\Ekrem Abi\ASO ILTEK\aso-iltek-web\src\data\turkeyPaths.js', 'w', encoding='utf-8') as f:
    f.write('// Turkey SVG Paths - 81 Provinces (SimpleMaps)\n')
    f.write('// viewBox: 0 0 1000 422\n\n')
    f.write('export const VIEWBOX = "0 0 1000 422";\n\n')
    f.write('export const turkeyPaths = ')
    f.write(json.dumps(provinces_data, ensure_ascii=False, indent=2))
    f.write(';\n')

print('turkeyPaths.js written!')
