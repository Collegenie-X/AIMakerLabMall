# Generated by Django 5.2.1 on 2025-06-05 02:43

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InternalClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='교육 수업', max_length=200, verbose_name='수업 제목')),
                ('course_type', models.CharField(choices=[('app-inventor', '앱 인벤터'), ('arduino', '아두이노'), ('raspberry-pi', 'Raspberry Pi'), ('ai', 'AI 코딩'), ('python', '파이썬 코딩'), ('scratch', '스크래치'), ('web-development', '웹 개발'), ('game-development', '게임 개발'), ('data-science', '데이터 사이언스'), ('robotics', '로보틱스')], default='python', max_length=30, verbose_name='교육 과정')),
                ('class_type', models.CharField(choices=[('오프라인', '오프라인 수업'), ('직접출강', '직접 출강')], default='오프라인', max_length=20, verbose_name='수업 형태')),
                ('instructor', models.CharField(default='담당 강사', max_length=50, verbose_name='강사명')),
                ('target_grade', models.CharField(choices=[('초등 1-2학년', '초등 1-2학년'), ('초등 3-4학년', '초등 3-4학년'), ('초등 5-6학년', '초등 5-6학년'), ('중학생', '중학생'), ('고등학생', '고등학생'), ('성인', '성인'), ('전체', '전체')], default='전체', max_length=20, verbose_name='대상')),
                ('max_students', models.PositiveIntegerField(default=10, verbose_name='최대 인원')),
                ('current_students', models.PositiveIntegerField(default=0, verbose_name='현재 신청자')),
                ('start_date', models.DateField(default=django.utils.timezone.now, verbose_name='시작일')),
                ('end_date', models.DateField(default=django.utils.timezone.now, verbose_name='종료일')),
                ('class_time', models.TimeField(default='14:00', verbose_name='수업 시간')),
                ('duration_hours', models.PositiveIntegerField(default=2, verbose_name='총 교육 시간')),
                ('sessions', models.PositiveIntegerField(default=1, verbose_name='총 회차')),
                ('price', models.PositiveIntegerField(default=50000, verbose_name='가격')),
                ('discount_rate', models.PositiveIntegerField(default=0, verbose_name='할인율 (%)')),
                ('description', models.TextField(default='수업 설명을 입력해주세요.', verbose_name='수업 설명')),
                ('curriculum', models.JSONField(default=list, verbose_name='커리큘럼')),
                ('prerequisites', models.TextField(blank=True, null=True, verbose_name='수강 조건')),
                ('materials', models.TextField(blank=True, null=True, verbose_name='준비물')),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='class_thumbnails/', verbose_name='썸네일 이미지')),
                ('images', models.JSONField(default=list, verbose_name='수업 이미지')),
                ('location', models.CharField(blank=True, max_length=200, null=True, verbose_name='출강 장소')),
                ('travel_fee', models.PositiveIntegerField(default=0, verbose_name='출장비')),
                ('is_active', models.BooleanField(default=True, verbose_name='활성화')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='생성일시')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='수정일시')),
            ],
            options={
                'verbose_name': '내부 교육 수업',
                'verbose_name_plural': '내부 교육 수업들',
                'ordering': ['start_date'],
            },
        ),
        migrations.CreateModel(
            name='OutreachInquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(default='교육 문의', max_length=200, verbose_name='교육 제목')),
                ('requester_name', models.CharField(default='미입력', max_length=50, verbose_name='요청자 이름')),
                ('phone', models.CharField(default='000-0000-0000', max_length=20, verbose_name='연락처')),
                ('email', models.EmailField(default='example@email.com', max_length=254, verbose_name='이메일')),
                ('course_type', models.CharField(choices=[('app-inventor', '앱 인벤터'), ('arduino', '아두이노'), ('raspberry-pi', 'Raspberry Pi'), ('ai', 'AI 코딩'), ('python', '파이썬 코딩'), ('scratch', '스크래치'), ('web-development', '웹 개발'), ('game-development', '게임 개발'), ('data-science', '데이터 사이언스'), ('robotics', '로보틱스')], default='python', max_length=30, verbose_name='교육 과정')),
                ('student_count', models.PositiveIntegerField(default=1, verbose_name='참여 인원')),
                ('student_grade', models.CharField(choices=[('초등 1-2학년', '초등 1-2학년'), ('초등 3-4학년', '초등 3-4학년'), ('초등 5-6학년', '초등 5-6학년'), ('중학생', '중학생'), ('고등학생', '고등학생'), ('성인', '성인'), ('전체', '전체')], default='전체', max_length=20, verbose_name='학년/연령대')),
                ('preferred_date', models.DateField(default=django.utils.timezone.now, verbose_name='희망 날짜')),
                ('preferred_time', models.TimeField(default='14:00', verbose_name='희망 시간')),
                ('duration', models.CharField(choices=[('1시간', '1시간'), ('2시간', '2시간'), ('3시간', '3시간'), ('4시간', '4시간'), ('6시간', '6시간'), ('8시간', '8시간'), ('12시간', '12시간'), ('16시간', '16시간'), ('20시간', '20시간'), ('24시간', '24시간'), ('30시간', '30시간'), ('40시간', '40시간'), ('기타', '기타')], default='2시간', max_length=20, verbose_name='교육 시간')),
                ('duration_custom', models.CharField(blank=True, max_length=50, null=True, verbose_name='기타 교육 시간')),
                ('location', models.CharField(default='미정', max_length=200, verbose_name='교육 장소')),
                ('budget', models.CharField(blank=True, max_length=100, null=True, verbose_name='예산')),
                ('message', models.TextField(default='교육 문의 내용을 입력해주세요.', verbose_name='교육 요청사항')),
                ('special_requests', models.TextField(blank=True, null=True, verbose_name='기타 요청사항')),
                ('equipment', models.JSONField(blank=True, default=list, verbose_name='필요 장비')),
                ('status', models.CharField(choices=[('접수대기', '접수대기'), ('검토중', '검토중'), ('견적발송', '견적발송'), ('확정', '확정'), ('진행중', '진행중'), ('완료', '완료'), ('취소', '취소')], default='접수대기', max_length=10, verbose_name='상태')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='생성일시')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='수정일시')),
                ('admin_notes', models.TextField(blank=True, null=True, verbose_name='관리자 메모')),
            ],
            options={
                'verbose_name': '코딩 출강 교육 문의',
                'verbose_name_plural': '코딩 출강 교육 문의들',
                'ordering': ['-created_at'],
            },
        ),
    ]
