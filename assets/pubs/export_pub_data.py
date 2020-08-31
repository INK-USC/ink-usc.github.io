from bs4 import BeautifulSoup as bs
from bs4 import Tag, NavigableString
import re, json

html_file = open('../../publications_copy.html')
soup = bs(html_file.read(), 'html.parser')

#root = soup.find(id="two")
pub_by_years = soup.find_all('div', class_='content')
#print(pub_by_years)

def get_yearly_data(pub_by_year):
    year = pub_by_year.find('h3').string
    publist_root = pub_by_year.find('ul')
    pub_datas = []
    #print(publist_root)
    for i, pub in enumerate(publist_root.find_all('p',recursive=False)):
        #print(i, pub)
        pub_data = get_pub_data(pub)
        #break
        pub_datas.append(pub_data)
    return pub_datas

def print_contents(ele):
    for i, e in enumerate(ele):
        print(i,e, type(e))

def get_pub_data(pub):
    print(pub.find('b').contents)
    title = pub.find('b').find('a')

    title = ''.join([str(_) for _ in title])

    title_href = pub.find('b').contents[0].href
    useful_info = pub.contents[2:]
    
    strings = []
    for ele in useful_info:
        if isinstance(ele,  NavigableString):
            strings.append(ele)
        else:
            strings.extend(ele.strings)

    strings = [_.strip() for _ in strings if _.strip()]

    #print_contents(pub)

    authors_and_venue = strings[0]
   
    matchobj = re.match('(.+)\. ([^\d]+)\s?(\d+)\.', authors_and_venue)
    if matchobj:
        authors = matchobj.group(1)
        venue = matchobj.group(2).strip()
        year = matchobj.group(3)
    else:
        authors = authors_and_venue
        venue_and_year = strings[1]
        #print(strings)
        matchobj = re.match('([^\d]+)\s?(\d+)\.?', venue_and_year)
        if matchobj is None:
            venue, year = '', ''
        else:
            venue = matchobj.group(1).strip()
            year = matchobj.group(2)
    #extra_info 
    print('{}---------{}---------{}'.format(authors, venue, year))
    pub_data = {
        'authors': authors,
        'year': year,
        'venue': venue,
        'title': title,
        'raw': str(pub)
    }
    return pub_data
    

print(len(pub_by_years))
all_data = []
for pub_by_year in pub_by_years:
    yearly_data = get_yearly_data(pub_by_year)
    all_data.extend(yearly_data)
with open('pub_data.json','w') as wf:
    json.dump(all_data, wf, indent=4)