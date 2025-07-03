/* ================== NAV: Burger Toggle ================== */
const burger = document.getElementById('burger');
const nav    = document.getElementById('navLinks');
burger.addEventListener('click', () => nav.classList.toggle('open'));

/* ================== Theme Toggle ================== */
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme',
    document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark')
  document.body.classList.add('dark');

/* ================== Hero Typing Text ================== */
document.addEventListener('DOMContentLoaded', () => {
  new Typed('#typed', {
    strings: [
      'Data Scientist.',
      'Machine‑Learning Engineer.',
      'I turn raw data into decisions.',
      'Python · SQL · Tableau · NLP.',
      'Let’s build something brilliant.'
    ],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 1400,
    loop: true
  });
});

/* ================== Card Tilt Effect ================== */
VanillaTilt.init(document.querySelectorAll('.tilt'), {
  max: 6,
  speed: 400,
  glare: true,
  'max-glare': 0.15
});

/* =======================================================
   Offline AI “Why Hire Me?” Chat Assistant
   ======================================================= */
const aiBtn   = document.getElementById('aiBtn');
const aiModal = document.getElementById('aiModal');
const aiClose = document.getElementById('aiClose');
const aiChat  = document.getElementById('aiChat');
const aiForm  = document.getElementById('aiForm');
const aiInput = document.getElementById('aiQuestion');

/* --- open / close modal --- */
aiBtn. addEventListener('click', () => aiModal.classList.toggle('open'));
aiClose.addEventListener('click', () => aiModal.classList.remove('open'));

/* --- helper to append a message bubble --- */
function addMsg(text, cls) {
  const div = document.createElement('div');
  div.className = `ai-msg ${cls}`;
  div.textContent = text;
  aiChat.appendChild(div);
  aiChat.scrollTop = aiChat.scrollHeight;
}

/* --- keyword → answer knowledge base --- */
const knowledge = [
  { k: ['churn','retention'],
    a: 'I improved customer retention by 11 % using an XGBoost model and actionable Tableau dashboards.' },
  { k: ['dashboard','tableau','power','bi','visual'],
    a: 'I build C‑suite dashboards (Tableau / Power BI) that turn raw KPIs into clear, data‑driven stories.' },
  { k: ['nlp','sentiment','tweet','tweets'],
    a: 'I deployed an NLP pipeline classifying 10 k tweets in real‑time with 82 % accuracy.' },
  { k: ['sql','etl','pipeline'],
    a: 'I design Python + SQL ETL pipelines that cut data‑prep time by 40 % and stay production‑ready.' },
  { k: ['soft','skill','communication','storytell'],
    a: 'Beyond code, I’m a clear storyteller who bridges tech & business to drive adoption.' },
  { k: ['experience','work','history'],
    a: 'My recent roles include Remote Freelance Data Scientist and Research Assistant at Mithibai College.' },
  { k: ['strength','biggest','achievement'],
    a: 'My strength is rapid prototyping — shipping production‑ready models in under two weeks.' }
];
const fallback =
  'Ask me about churn, NLP, dashboards, SQL pipelines, soft skills, or anything you’re curious about!';

/* --- greeting line --- */
addMsg('👋 Hi — I’m Bhavesh’s AI helper. Ask me why he’s perfect for your team!','ai-bot');

/* --- handle question submit --- */
aiForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = aiInput.value.trim();
  if (!q) return;

  addMsg(q, 'ai-user');   // show user bubble
  aiInput.value = '';

  // simple keyword match
  const lower = q.toLowerCase();
  let answer  = fallback;
  for (const pair of knowledge) {
    if (pair.k.some(word => lower.includes(word))) {
      answer = pair.a;
      break;
    }
  }
  setTimeout(() => addMsg(answer, 'ai-bot'), 400); // slight delay for realism
});

/* === Scroll‑reveal for Story Timeline === */
const storyItems = document.querySelectorAll('.story-item');
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e => {
    if(e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.2 });
storyItems.forEach(item => observer.observe(item));

/* ===== Robot Greeter Logic (5‑second cameo) ===== */
const bot       = document.getElementById('botGreeter');
const botSpeech = document.getElementById('botSpeech');

// ➊  Show bubble & wave after 0.8 s
setTimeout(() => bot.classList.add('show'), 800);

// ➋  After 5 s total, hide the entire greeter (emoji + speech)
setTimeout(() => bot.style.display = 'none', 5000);

// ➌  If user clicks before it disappears, open chat & hide greeter immediately
bot.addEventListener('click', () => {
  aiModal.classList.add('open');          // open existing chat modal
  bot.style.display = 'none';             // dismiss the greeter
});

