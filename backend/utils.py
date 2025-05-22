import os
from datetime import datetime
from uuid import uuid4

def get_filename(filename):
    """
    CKEditor 업로드 파일의 이름을 생성하는 함수
    """
    ext = filename.split('.')[-1]
    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid4())[:8]}.{ext}"
    return os.path.join('uploads', filename) 