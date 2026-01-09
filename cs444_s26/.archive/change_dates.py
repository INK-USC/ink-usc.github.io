from bs4 import BeautifulSoup
from datetime import date, timedelta
import re

MEETING_DOWS = {0, 2}  # Monday=0, Wednesday=2
start = date(2026, 1, 12)  # first class meeting

date_pat = re.compile(r"^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}$")

def fmt_mmdd(d):
    return d.strftime("%b ").replace(" 0", " ") + str(d.day)

def next_meeting(d):
    d = d + timedelta(days=1)
    while d.weekday() not in MEETING_DOWS:
        d += timedelta(days=1)
    return d

html = open("index.html", "r", encoding="utf-8").read()
soup = BeautifulSoup(html, "html.parser")

cur = start
# ensure start is on a meeting day
while cur.weekday() not in MEETING_DOWS:
    cur += timedelta(days=1)

for td in soup.find_all("td"):
    txt = td.get_text(strip=True)
    if not date_pat.match(txt):
        continue
    td.string = fmt_mmdd(cur)
    cur = next_meeting(cur)

open("index.updated.html", "w", encoding="utf-8").write(str(soup))
print("Wrote index.updated.html")
