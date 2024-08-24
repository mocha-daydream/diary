document.addEventListener('DOMContentLoaded', function() {
    const diaryContainer = document.getElementById('diary-container');
    const diaryContent = document.getElementById('diary-content');
    const saveDiaryButton = document.getElementById('save-diary');
    const clearAllButton = document.getElementById('clear-all');

    // 監聽輸入框的 input 事件
    diaryContent.addEventListener('input', adjustTextareaHeight);

    // 載入保存的日記
    loadDiaries();

    // 保存日記事件
    saveDiaryButton.addEventListener('click', function(e) {
        e.preventDefault();
        saveDiary();
    });

    // 清除所有日記
    clearAllButton.addEventListener('click', function() {
        if (confirm("確定要刪除所有日記嗎？")) {
            localStorage.removeItem('diaries');
            loadDiaries();
        }
    });

    // 保存日記
    function saveDiary() {
        const content = diaryContent.value.trim();
        if (content) {
            const date = new Date().toLocaleString('zh-TW', { dateStyle: 'medium', timeStyle: 'short' });
            const diary = { date, content };
            saveDiaryToStorage(diary);
            loadDiaries();
            diaryContent.value = ''; // 清空輸入框
            adjustTextareaHeight(); // 調整輸入框高度回到初始狀態
        }
    }

    // 將日記保存到本地儲存
    function saveDiaryToStorage(diary) {
        const storedDiaries = getStoredDiaries();
        storedDiaries.push(diary);
        localStorage.setItem('diaries', JSON.stringify(storedDiaries));
    }

    // 載入保存的日記
    function loadDiaries() {
        const storedDiaries = getStoredDiaries();
        diaryContainer.innerHTML = '';
        // 將日記由新到舊顯示
        storedDiaries.reverse().forEach(function(diary, index) {
            const entry = document.createElement('div');
            entry.classList.add('diary-entry');
            // 替換換行符為 <br> 以便在 HTML 中顯示
            const contentWithLineBreaks = diary.content.replace(/\n/g, '<br>');
            entry.innerHTML = `
                <div class="date">${diary.date}</div>
                <div class="content">${contentWithLineBreaks}</div>
                <button class="delete-button" data-index="${index}">X</button>
            `;
            diaryContainer.appendChild(entry);
            adjustDiaryEntryHeight(entry.querySelector('.content')); // 調整日記條目高度
        });
        // 添加刪除個別日記的事件
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteDiary(index);
            });
        });
    }

    // 調整輸入框高度
    function adjustTextareaHeight() {
        diaryContent.style.height = 'auto'; // 重置高度
        diaryContent.style.height = diaryContent.scrollHeight + 'px'; // 設置為內容的高度
    }

    // 調整日記條目高度
    function adjustDiaryEntryHeight(entry) {
        entry.style.height = 'auto'; // 重置高度
        entry.style.height = entry.scrollHeight + 'px'; // 設置為內容的高度
    }

    // 刪除個別日記
    function deleteDiary(index) {
        const storedDiaries = getStoredDiaries();
        storedDiaries.splice(index, 1); // 刪除指定索引的日記
        localStorage.setItem('diaries', JSON.stringify(storedDiaries));
        loadDiaries(); // 重新載入日記
    }

    // 取得保存的日記
    function getStoredDiaries() {
        const storedDiaries = localStorage.getItem('diaries');
        return storedDiaries ? JSON.parse(storedDiaries) : [];
    }
});