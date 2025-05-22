document.addEventListener('DOMContentLoaded', function() {
    // 미디어 파일 선택 시 이미지 미리보기 업데이트 및 적용
    function setupMediaFileSelectors() {
        const mediaFileSelects = document.querySelectorAll('select[name$="media_file"]');
        
        mediaFileSelects.forEach(select => {
            select.addEventListener('change', function() {
                // 현재 행 찾기
                const row = this.closest('tr');
                if (!row) return;
                
                const previewCell = row.querySelector('td.field-image_preview');
                
                if (this.value) {
                    // 미디어 파일이 선택된 경우
                    
                    // 1. 미리보기 업데이트
                    if (previewCell) {
                        const imageUrl = '/media/' + this.value;
                        previewCell.innerHTML = `
                            <a href="${imageUrl}" target="_blank">
                                <img src="${imageUrl}" width="100" height="100" style="object-fit: cover;" />
                            </a>
                        `;
                    }
                    
                    // 2. 파일 입력 필드 비우기 (서버에서 미디어 파일을 사용하도록)
                    const fileInput = row.querySelector('input[type="file"]');
                    if (fileInput) {
                        // 파일 입력 필드 비우기
                        try {
                            fileInput.value = '';
                            
                            // 일부 브라우저에서는 직접 value 변경이 제한되어 있어 이 방법 사용
                            const newFileInput = document.createElement('input');
                            newFileInput.type = 'file';
                            newFileInput.name = fileInput.name;
                            newFileInput.className = fileInput.className;
                            newFileInput.id = fileInput.id;
                            newFileInput.accept = fileInput.accept;
                            
                            fileInput.parentNode.replaceChild(newFileInput, fileInput);
                        } catch (e) {
                            console.log('파일 입력 필드를 초기화할 수 없습니다:', e);
                        }
                    }
                } else if (previewCell) {
                    // 선택이 취소된 경우 미리보기 지우기
                    previewCell.innerHTML = 'No Image';
                }
            });
        });
    }
    
    // 초기 설정
    setupMediaFileSelectors();
    
    // 새 인라인 폼이 추가될 때 이벤트 리스너 재설정
    if (typeof django !== 'undefined' && django.jQuery) {
        django.jQuery(document).on('formset:added', function() {
            setTimeout(setupMediaFileSelectors, 100); // 약간의 지연을 줘서 DOM이 업데이트된 후 실행
        });
    }
}); 