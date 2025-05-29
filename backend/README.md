##가상
python3.13 -m venv venv


ls
.\venv\Scripts\activate

python manage.py runserver


cd front
npm run dev 


@product_prod.md  기준으로 backend 폴더에 app products를 구성해 주세요.  REST API, Admin 페이지 둘다 구성해 주세요.  

    # product_detail_info = RichTextUploadingField(
    #     config_name='product_detail',
    #     help_text="관리자 페이지에서 HTML 에디터로 작성하는 상품 상세 설명"
    # )

    mkdir -p staticfiles && python manage.py collectstatic --noinput

python manage.py collectstatic --noinput

