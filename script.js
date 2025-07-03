# Create a debug version of the Facts app with helpful logging and fallback messages

# Define debug version of script.js
debug_script_js = """
const newsList = document.getElementById('news-list');
const chatBox = document.getElementById('chat-box');
const qaLog = document.getElementById('qa-log');
const newsTitle = document.getElementById('news-title');
const questionInput = document.getElementById('question');

console.log("✅ Script loaded. Starting app...");

// Check if essential elements exist
if (!newsList || !chatBox || !qaLog || !newsTitle || !questionInput) {
  console.error("❌ One or more required DOM elements are missing.");
}

// Fetch news from NewsAPI (bbc-news)
fetch('https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=7cba2a33d3ea4342b5edfa51cf802319')
  .then(res => {
    console.log("📡 NewsAPI response status:", res.status);
    if (!res.ok) throw new Error("Failed to fetch news from API");
    return res.json();
  })
  .then(data => {
    newsList.innerHTML = '';
    if (data.articles.length === 0) {
      console.warn("⚠️ NewsAPI returned 0 articles.");
      newsList.innerHTML = '<p>No news articles found.</p>';
    } else {
      console.log("📰 Loaded articles:", data.articles.length);
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
    console.error("❌ Error fetching news:", err.message);
    newsList.innerHTML = '<p style="color:red;">Failed to load news. Check your internet or API key.</p>';
  });

function openChat(title) {
  console.log("💬 Opening chat for:", title);
  newsTitle.innerText = title;
  chatBox.style.display = 'block';
  qaLog.innerHTML = `
    <p><strong>User:</strong> How many people were involved?</p>
    <p><strong>Facts:</strong> Based on early reports, details are still emerging. Stay tuned for updates.</p>
  `;
}

questionInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && questionInput.value.trim()) {
    console.log("📨 User asked:", questionInput.value);
    qaLog.innerHTML += '<p><strong>User:</strong> ' + questionInput.value + '</p>';
    qaLog.innerHTML += '<p><strong>Facts:</strong> (Answer coming soon...)</p>';
    questionInput.value = '';
  }
});
"""

# Use previous HTML/CSS from styled version
debug_path = "/mnt/data/Facts_Debug"
os.makedirs(debug_path, exist_ok=True)

# Write all 3 files
with open(f"{debug_path}/index.html", "w") as f:
    f.write(ui_html)

with open(f"{debug_path}/style.css", "w") as f:
    f.write(ui_css)

with open(f"{debug_path}/script.js", "w") as f:
    f.write(debug_script_js)

# Package as a zip
shutil.make_archive(debug_path, 'zip', debug_path)
