from pathlib import Path
p=Path('nazir-driver.html')
s=p.read_text()
tag='<script src="nazir-driver-i18n.js?v=20260828-i18n-v1"></script>'
if tag in s: raise SystemExit('Nazir i18n already enabled')
needle='</body></html>'
if needle not in s: raise SystemExit('closing body not found')
s=s.replace(needle,tag+needle,1)
p.write_text(s)
