# AIMakerLabMall
 Django, Next.js, Typescript, React-Query, REST API, Admin


## BackEnd 
 - Django로 구성되면 REST API 형태로 구성됩니다. 
 - Django Admin에서 관리하면, 주로 모니터링, 제품 등록에서 사용됩니다. 

## FrontEnd
  - Next.js 프레임워크를 통해서 제작하며 React-Query,Typescript 언어 기반으로 제작합니다. 
  - 함수 components 위주로 사용되면 UI 로직과 Business 로직으로 나뉘어 개발합니다. 

### 

### BackEnd 
venv/Scripts/activite

cd backend
python manage.py runserver 

backend 폴더에서 @settings.py 에서 사용합니다. 이때 필요한 .env 파일에서 참고하는 부분을 작성해 주세요. 

rm db.sqlite3
python manage.py migrate

python manage.py createsuperuser
admin@abc.com / 1234

python manage.py runserver


### frontend Server 실행
cd front
npm install 
npm run dev