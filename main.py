from random import randint
import time
import requests
from bs4 import BeautifulSoup
import csv
from datetime import date as d


MAX_SLEEP_TIME = 1

# CSV 파일 생성
today = d.today()
csv_file = open(f'./data/{today}.csv', 'w')
csv_writer = csv.writer(csv_file)

# 헤더 행 추가
csv_writer.writerow(['상품명', '가격', '사진'])

# 빈 리스트 생성
records = []

# 시작 페이지 지정
page_num = 1

while True:
    # HTML 코드 받아오기
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get("https://www.ssg.com/search.ssg?target=all&query=%EC%99%80%EC%9D%B8&ctgId=6000099420&ctgLv=2&page=" + str(page_num), headers=headers)

    # BeautifulSoup 타입으로 변형하기

    soup = BeautifulSoup(response.text, 'html.parser')

    # "prodName" 클래스가 있을 때만 상품 정보 가져오기
    if len(soup.select('div.tmpl_noresult')) == 0:

        print(str(page_num) + "페이지 수집 중...")

        rand_value = randint(1, MAX_SLEEP_TIME)
        time.sleep(rand_value)

        product_names = soup.select('#idProductImg .cunit_info > div.cunit_md.notranslate > div > a > em.tx_ko')
        product_prices = soup.select('#idProductImg .cunit_info > div.cunit_price > div.opt_price > em')
        product_urls = soup.select('#idProductImg .cunit_prod > div.thmb > a > img')
        page_num += 1

        print(product_names)

        # 서버 과부하 방지를 위한 랜덤 슬립
        rand_value = randint(1, MAX_SLEEP_TIME)
        time.sleep(rand_value)

        # 상품의 정보를 하나의 레코드로 만들고, 리스트에 순서대로 추가하기
        for i in range(len(product_names)):
            url = product_urls[i].get('src')
            record = [product_names[i].text, product_prices[i].text.strip(),
                      url[2:]]
            records.append(record)
            csv_writer.writerow([record[0], record[1], record[2]])
    else:
        break

# 파일 닫기
csv_file.close()