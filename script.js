const gnewsKey = "ab645ae55f26daa49575e11723271b7e";
const openrouterKey = "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";

const newsList = document.getElementById('news-list');
const chatBox = document.getElementById('chat-box');
const qaLog = document.getElementById('qa-log');
const newsTitle = document.getElementById('news-title');
const questionInput = document.getElementById('question');
const locationLabel = document.getElementById('location-label');

let selectedHeadline = "";

navigator.geolocation.getCurrentPosition(
  async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const city = await getCityName(lat, lon);
    locationLabel.innerText = `📍 ${city}`;
    loadLocalNews(city);
  },
  () => {
    locationLabel.innerText = "📍 Chennai (default)";
    loadLocalNews("Chennai");
  }
);

async function getCityName(lat, lon) {
  try {
    const res = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    return data.address.city || data.address.town || data.address.state || "India";
  } catch {
    return "India";
  }
}

function loadLocalNews(city) {
  fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(city)}&lang=en&country=in&token=${gnewsKey}`)
    .then(res => res.json())
    .then(data => {
      newsList.innerHTML = '';
      if (!data.articles || data.articles.length === 0) {
        newsList.innerHTML = "<p>No local news found.</p>";
        return;
      }
      data.articles.forEach(article => {
        const div = document.createElement("div");
        div.className = "news-card";
        div.innerText = article.title;
        div.onclick = () => openChat(article.title);
        newsList.appendChild(div);
      });
    })
    .catch(() => {
      newsList.innerHTML = "<p>Failed to load news. Check your API key or internet.</p>";
    });
}

function openChat(title) {
  selectedHeadline = title;
  newsTitle.innerText = title;
  qaLog.innerHTML = '';
  chatBox.style.display = 'block';
}

questionInput.addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && questionInput.value.trim()) {
    const userQ = questionInput.value;
    questionInput.value = '';
    qaLog.innerHTML += `<p><strong>User:</strong> ${userQ}</p>`;
    qaLog.innerHTML += `<p><strong>Facts:</strong> Thinking...</p>`;
    
    const response = await askAI(`${selectedHeadline} — ${userQ}`);
    const factsReply = `<p><strong>Facts:</strong> ${response}</p>`;
    qaLog.innerHTML = qaLog.innerHTML.replace("Thinking...", response);
  }
});

async function askAI(prompt) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openrouterKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mixtral-8x7b-instruct",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Sorry, I couldn’t understand that.";
}
