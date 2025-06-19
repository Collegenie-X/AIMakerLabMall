from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    문의 작성자만 수정/삭제 가능, 나머지는 읽기 전용
    """
    
    def has_permission(self, request, view):
        """
        목록 조회, 생성은 모든 사용자 허용
        """
        # 목록 조회(GET), 생성(POST)는 모든 사용자 허용
        if request.method in ['GET', 'POST']:
            return True
        # 기타 메소드는 인증된 사용자만
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        객체 레벨 권한: 작성자만 수정/삭제 가능
        """
        # 읽기 권한은 모든 사용자에게 허용
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 수정/삭제 권한은 작성자에게만 허용
        # 비로그인 사용자가 작성한 경우는 수정/삭제 불가
        if not request.user or not request.user.is_authenticated:
            return False
            
        return obj.is_owner(request.user)


class IsOwnerOrAdminReadOnly(permissions.BasePermission):
    """
    관리자는 모든 권한, 작성자는 자신의 글만 수정/삭제, 나머지는 읽기 전용
    """
    
    def has_permission(self, request, view):
        """
        목록 조회, 생성은 모든 사용자 허용
        """
        if request.method in ['GET', 'POST']:
            return True
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        객체 레벨 권한
        """
        # 읽기 권한은 모든 사용자에게 허용
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # 인증되지 않은 사용자는 수정/삭제 불가
        if not request.user or not request.user.is_authenticated:
            return False
        
        # 관리자는 모든 권한
        if request.user.is_staff or request.user.is_superuser:
            return True
            
        # 작성자는 자신의 글만 수정/삭제 가능
        return obj.is_owner(request.user) 