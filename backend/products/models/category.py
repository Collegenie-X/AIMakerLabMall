from django.db import models

class Category(models.Model):
    name = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='카테고리명'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='카테고리 설명'
    )
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name='상위 카테고리'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='생성일'
    )

    class Meta:
        verbose_name = '카테고리'
        verbose_name_plural = '카테고리 목록'
        ordering = ['name']

    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name 