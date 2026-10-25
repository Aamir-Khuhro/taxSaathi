# Wraps simple content pages in the shared <head> and layout. Run: python _partials/make.py
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} — TaxSaathi</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/data.js"></script>
<script src="assets/js/site.js"></script>
</head>
<body>
<div id="site-header"></div>
<main id="main">
<section class="page-head"><div class="wrap">
  <div class="crumbs"><a href="index.html">Home</a> / {title}</div>
  <h1>{h1}</h1>
  <p class="lead">{lead}</p>
</div></section>
'''
FOOT = '''</main>
<div id="site-footer"></div>
{script}
</body>
</html>
'''
for src in sorted((root / "_partials").glob("*.part.html")):
    text = src.read_text(encoding="utf-8")
    meta = dict(re.findall(r"^<!--\s*(\w+):\s*(.*?)\s*-->$", text, re.M))
    body = re.sub(r"^<!--\s*\w+:.*?-->\n", "", text, flags=re.M)
    script = ""
    m = re.search(r"<script>.*</script>", body, re.S)
    if m: script, body = m.group(0), body[:m.start()] + body[m.end():]
    out = HEAD.format(**meta) + body.strip() + "\n" + FOOT.format(script=script)
    (root / src.name.replace(".part", "")).write_text(out, encoding="utf-8")
    print("built", src.name.replace(".part", ""))
