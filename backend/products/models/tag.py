from django.db import models

class Tag(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='태그명'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='태그 설명'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='생성일'
    )

    class Meta:
        verbose_name = '태그'
        verbose_name_plural = '태그 목록'
        ordering = ['name']

    def __str__(self):
        return self.name 