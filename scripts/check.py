from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
root=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.refs=[];self.faq=0;self.h1=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a':self.links.append(a.get('href',''))
  if tag in ('script','img','link'):
   ref=a.get('src',a.get('href',''))
   if ref and not ref.startswith(('https:','data:')):self.refs.append(ref)
  if tag=='img':assert a.get('alt')
  if tag=='details':self.faq+=1
  if tag=='h1':self.h1+=1
p=Page();text=(root/'index.html').read_text(encoding='utf-8');p.feed(text)
assert all(v==1 for v in Counter(p.ids).values()),'Duplicate ID'
assert all(x=='#' or x[1:] in p.ids for x in p.links if x.startswith('#')),'Broken anchor'
assert all((root/x).is_file() for x in p.refs),'Missing asset'
assert p.faq==9 and p.h1==1
assert 'noindex,nofollow' in text
assert 'tel:+353868204401' in text and 'mailto:karl.prendergast@gmail.com' in text
js=(root/'app.js').read_text(encoding='utf-8')
assert not any(x in js for x in ['fetch(', 'localStorage', 'sessionStorage', 'XMLHttpRequest'])
css=(root/'styles.css').read_text(encoding='utf-8')
assert 'prefers-reduced-motion' in css
print('PASS: HTML structure, anchors, local assets, 9 FAQs, contact links, demo privacy and reduced motion')

# Deployment and nonvisual safeguards; no external requests required.
import json, re
from urllib.parse import urlparse, parse_qs
css=(root/'styles.css').read_text(encoding='utf-8')
for ref in re.findall(r'url\([\"\x27]?(.*?)[\"\x27]?\)', css):
 assert not ref.startswith('http'), 'Fonts must be local'
 assert (root/ref).is_file(), ref
for weight in (400,500,600,700,800):
 font=root/f'assets/fonts/manrope-{weight}.woff'
 assert font.read_bytes()[:4] == b'wOFF', font
assert 'SIL OPEN FONT LICENSE' in (root/'assets/fonts/OFL.txt').read_text(encoding='utf-8')
assert 'fonts.googleapis.com' not in text
assert 'disabled' in re.search(r'<button class="button cream"[^>]*>',text).group()
assert 'aria-describedby="demo-note"' in text
assert not re.search(r'<(?:input|textarea)[^>]*\bname=',text), 'Demo fields must not be serialized'
assert '<form id="enquiry-form" aria-describedby="demo-note">' in text
assert text.count('Demo form — no information is sent or stored.') == 1
assert all(x=='tel:+353868204401' for x in p.links if x.startswith('tel:'))
assert all(x=='mailto:karl.prendergast@gmail.com' for x in p.links if x.startswith('mailto:'))
directions=next(x for x in p.links if '/maps/dir/' in x)
assert parse_qs(urlparse(directions).query)['destination']==['6 Monksfield Salthill Galway H91 XN61']
iframe=re.search(r'<iframe[^>]*>',text).group()
assert 'loading="lazy"' in iframe and 'H91%20XN61' in iframe
assert 'noindex,nofollow' in text
config=json.loads((root.parent/'vercel.json').read_text(encoding='utf-8'))
assert config['outputDirectory']=='dist' and config['framework'] is None
assert config['headers'][0]['headers'][0]=={'key':'X-Robots-Tag','value':'noindex, nofollow'}
assert not (root.parent/'.git').exists()
print('PASS: 5 local Manrope fonts/licence, demo fail-closed markup, exact contact/map destinations and static Vercel configuration')
