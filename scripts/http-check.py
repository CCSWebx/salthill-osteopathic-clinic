"""Serve dist temporarily on a free loopback port; check every shipped asset."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.request import urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1] / 'dist'
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(ROOT)))
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()
try:
    origin = f'http://127.0.0.1:{server.server_port}'
    files = [p for p in ROOT.rglob('*') if p.is_file()]
    for p in files:
        with urlopen(origin + '/' + p.relative_to(ROOT).as_posix(), timeout=5) as response:
            assert response.status == 200
            assert response.read() == p.read_bytes(), p
    with urlopen(origin + '/', timeout=5) as response:
        assert 'text/html' in response.headers['Content-Type']
        assert 'noindex,nofollow' in response.read().decode('utf-8')
    try: urlopen(origin + '/not-a-real-file', timeout=5)
    except HTTPError as error: assert error.code == 404
    else: raise AssertionError('Expected missing asset to return 404')
    print(f'PASS: static HTTP root, {len(files)} files (byte-exact), MIME and 404; server stopped')
finally:
    server.shutdown(); server.server_close(); thread.join()
