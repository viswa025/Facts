const newsList = document.getElementById('news-list');
const chatBox = document.getElementById('chat-box');
const qaLog = document.getElementById('qa-log');
const newsTitle = document.getElementById('news-title');
const questionInput = document.getElementById('question');

fetch('https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey=7cba2a33d3ea4342b5edfa51cf802319')
  .then(res => res.json())
  .then(data => {
    newsList.innerHTML = '';
    if (data.articles.length === 0) {
      newsList.innerHTML = '<p>No news articles found.</p>';
    } else {
      data.articles.forEach(article => {
        const div = document.createElement('div');
        div.className = 'news-card';
        div.innerText = article.title;
        div.onclick = () => openChat(article.title);
        newsList.appendChild(div);
      });
    }
  })
  .catch(err => {
    newsList.innerHTML = '<p>Failed to load news.</p>';
  });

function openChat(title) {
  newsTitle.innerText = title;
  chatBox.style.display = 'block';
  qaLog.innerHTML = `
    <p><strong>User:</strong> How many people were involved?</p>
    <p><strong>Facts:</strong> Based on early reports, details are still emerging. Stay tuned for updates.</p>
  `;
}

questionInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && questionInput.value.trim()) {
    qaLog.innerHTML += '<p><strong>User:</strong> ' + questionInput.value + '</p>';
    qaLog.innerHTML += '<p><strong>Facts:</strong> (Answer coming soon...)</p>';
    questionInput.value = '';
  }
});
