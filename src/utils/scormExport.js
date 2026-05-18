import JSZip from 'jszip';
import modulesData from '../../data/modules.json';
import questionsData from '../../data/questions.json';

// ─── Manifeste SCORM 1.2 ──────────────────────────────────────────────────
function generateManifest() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="com.greenit.academie.scorm" version="1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
    http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="GreenITOrg">
    <organization identifier="GreenITOrg">
      <title>Green IT Académie — Normes, Labels et Certifications</title>
      <item identifier="item1" identifierref="resource1">
        <title>Parcours complet Green IT (6 modules)</title>
        <adlcp:masteryscore>70</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;
}

// ─── Page HTML autonome (CSS + JS + contenu intégrés) ─────────────────────
function generateHtml(modules, questions) {
  const modulesJson = JSON.stringify(modules);
  const questionsJson = JSON.stringify(questions);

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Green IT Académie</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f1f5f9;display:flex;min-height:100vh}
    #sidebar{width:200px;background:#1e3a5f;min-height:100vh;display:flex;flex-direction:column;flex-shrink:0}
    #sidebar .logo{padding:18px 14px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:8px}
    #sidebar .logo-icon{width:34px;height:34px;background:#2d5a87;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px}
    #sidebar .logo-text div:first-child{color:#fff;font-weight:700;font-size:14px}
    #sidebar .logo-text div:last-child{color:#7cb3d9;font-size:10px;font-style:italic}
    #sidebar nav{padding:8px 0;flex:1}
    .nav-btn{width:100%;padding:10px 14px;background:transparent;border:none;border-left:3px solid transparent;color:rgba(255,255,255,0.75);display:flex;align-items:center;gap:8px;cursor:pointer;font-size:12px;text-align:left}
    .nav-btn.active{background:rgba(255,255,255,0.08);border-left-color:#4ade80;color:#4ade80;font-weight:600}
    #main{flex:1;display:flex;flex-direction:column}
    #header{background:#fff;padding:14px 24px;border-bottom:1px solid #e2e8f0}
    #header h1{font-size:17px;font-weight:700;color:#1e3a5f;margin:0}
    #content{flex:1;padding:24px;overflow-y:auto}
    .card{background:#fff;border-radius:8px;padding:20px;margin-bottom:16px;box-shadow:0 1px 3px rgba(0,0,0,0.06)}
    .section-content{font-size:15px;line-height:1.85;color:#374151}
    .keypoints{background:#ecfdf5;border-radius:8px;padding:16px;margin-top:16px;border:1px solid #86efac}
    .keypoints h3{color:#166534;font-size:13px;margin-bottom:10px}
    .keypoints li{color:#166534;font-size:13px;margin-bottom:6px;list-style:none;display:flex;gap:8px}
    .btn{padding:10px 20px;border-radius:6px;border:none;cursor:pointer;font-weight:600;font-size:13px}
    .btn-primary{background:#1e3a5f;color:#fff}
    .btn-orange{background:#e65100;color:#fff}
    .btn-outline{background:#fff;color:#1e3a5f;border:1px solid #1e3a5f}
    .nav-footer{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;border-top:1px solid #e2e8f0;background:#fff}
    .progress-bar-wrap{height:6px;background:#e2e8f0;border-radius:3px;margin:8px 0}
    .progress-bar-fill{height:100%;background:#22c55e;border-radius:3px;transition:width .3s}
    .answer-btn{width:100%;padding:12px 16px;margin-bottom:8px;border-radius:8px;border:2px solid #e2e8f0;background:#fff;color:#374151;font-size:14px;text-align:left;cursor:pointer;display:flex;gap:10px;align-items:center}
    .answer-btn:hover{border-color:#1e3a5f}
    .answer-btn.correct{border-color:#22c55e;background:#ecfdf5;color:#166534}
    .answer-btn.wrong{border-color:#ef4444;background:#fff5f5;color:#991b1b}
    .answer-btn.disabled{opacity:.5;cursor:default}
    .feedback{padding:14px;border-radius:8px;margin-top:12px;font-size:13px;line-height:1.6}
    .feedback.ok{background:#ecfdf5;border:1px solid #86efac;color:#166534}
    .feedback.ko{background:#fff5f5;border:1px solid #fecaca;color:#991b1b}
    .score-screen{text-align:center;padding:40px 20px}
    .score-big{font-size:56px;font-weight:800}
    .badge{display:inline-block;padding:3px 10px;border-radius:10px;font-size:11px;font-weight:600}
    .badge-ok{background:#dcfce7;color:#166534}
    .badge-ko{background:#fee2e2;color:#991b1b}
    footer{padding:12px 24px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between}
  </style>
</head>
<body>

<div id="sidebar">
  <div class="logo">
    <div class="logo-icon">🌿</div>
    <div class="logo-text">
      <div>Green IT</div>
      <div>académie</div>
    </div>
  </div>
  <nav id="module-nav"></nav>
</div>

<div id="main">
  <div id="header"><h1 id="header-title">Green IT Académie</h1></div>
  <div id="content"></div>
  <div class="nav-footer" id="nav-footer" style="display:none">
    <button class="btn btn-outline" id="btn-prev">← Précédent</button>
    <span id="section-counter" style="font-size:13px;color:#94a3b8"></span>
    <button class="btn btn-primary" id="btn-next">Suivant →</button>
  </div>
  <footer>
    <span>© 2026 Charles DE MEDEIROS – Ziad HARCHAY | Master Data Science, UE Green IT LURS01</span>
    <span>🌱 Éco-conçu selon les principes du Green IT</span>
  </footer>
</div>

<script>
const MODULES = ${modulesJson};
const QUESTIONS = ${questionsJson};

// ── SCORM 1.2 API ──────────────────────────────────────────────────────────
var SCORM_API = null;
var scormScore = 0;

function findAPI(w) {
  var tries = 0;
  while (w.API == null && w.parent != null && w.parent != w && tries < 10) {
    w = w.parent; tries++;
  }
  return w.API || null;
}

function initSCORM() {
  try {
    SCORM_API = findAPI(window);
    if (SCORM_API) {
      SCORM_API.LMSInitialize("");
      SCORM_API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    }
  } catch(e) {}
}

function reportScore(score) {
  scormScore = score;
  try {
    if (SCORM_API) {
      SCORM_API.LMSSetValue("cmi.core.score.raw", String(score));
      SCORM_API.LMSSetValue("cmi.core.score.min", "0");
      SCORM_API.LMSSetValue("cmi.core.score.max", "100");
      SCORM_API.LMSSetValue("cmi.core.lesson_status", score >= 70 ? "passed" : "failed");
      SCORM_API.LMSCommit("");
    }
  } catch(e) {}
}

function finishSCORM() {
  try { if (SCORM_API) SCORM_API.LMSFinish(""); } catch(e) {}
}

window.addEventListener("beforeunload", finishSCORM);
initSCORM();

// ── État de l'app ───────────────────────────────────────────────────────────
var state = {
  screen: "course",   // "course" | "quiz" | "results"
  moduleIdx: 0,
  sectionIdx: 0,
  quizQuestions: [],
  quizIdx: 0,
  quizAnswered: false,
  quizSelected: null,
  quizCorrect: 0,
  quizFinished: false,
};

// ── Navigation latérale ─────────────────────────────────────────────────────
function buildNav() {
  var nav = document.getElementById("module-nav");
  nav.innerHTML = "";
  MODULES.forEach(function(m, idx) {
    var btn = document.createElement("button");
    btn.className = "nav-btn" + (idx === state.moduleIdx && state.screen === "course" ? " active" : "");
    btn.innerHTML = "<span>" + m.image + "</span><span>" + m.unite + "</span>";
    btn.onclick = function() { state.moduleIdx = idx; state.sectionIdx = 0; state.screen = "course"; render(); };
    nav.appendChild(btn);
  });
}

// ── Rendu principal ─────────────────────────────────────────────────────────
function render() {
  buildNav();
  if (state.screen === "course") renderCourse();
  else if (state.screen === "quiz") renderQuiz();
  else renderResults();
}

// ── Écran cours ─────────────────────────────────────────────────────────────
function renderCourse() {
  var mod = MODULES[state.moduleIdx];
  var sec = mod.sections[state.sectionIdx];
  var total = mod.sections.length;
  var isLast = state.sectionIdx === total - 1;

  document.getElementById("header-title").textContent = mod.unite + " — " + mod.title;

  var pct = Math.round(((state.sectionIdx + 1) / total) * 100);
  var kp = sec.keyPoints.map(function(p) {
    return "<li><span>✓</span><span>" + p + "</span></li>";
  }).join("");

  document.getElementById("content").innerHTML =
    "<div style='max-width:760px;margin:0 auto'>" +
      "<div style='font-size:12px;color:#94a3b8;margin-bottom:12px'>" +
        "Section " + (state.sectionIdx+1) + " / " + total + " &nbsp;·&nbsp; ⏱ " + mod.estimatedTime +
        "<div class='progress-bar-wrap'><div class='progress-bar-fill' style='width:" + pct + "%'></div></div>" +
      "</div>" +
      "<div class='card'><p class='section-content'>" + sec.content + "</p></div>" +
      "<div class='keypoints'><h3>💡 Points clés à retenir</h3><ul>" + kp + "</ul></div>" +
    "</div>";

  var footer = document.getElementById("nav-footer");
  footer.style.display = "flex";
  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  document.getElementById("section-counter").textContent = (state.sectionIdx+1) + " / " + total;

  btnPrev.disabled = state.sectionIdx === 0;
  btnPrev.style.opacity = state.sectionIdx === 0 ? "0.4" : "1";
  btnPrev.onclick = function() { if (state.sectionIdx > 0) { state.sectionIdx--; render(); } };

  if (isLast) {
    btnNext.textContent = "S'évaluer →";
    btnNext.className = "btn btn-orange";
    btnNext.onclick = function() { startQuiz(); };
  } else {
    btnNext.textContent = "Suivant →";
    btnNext.className = "btn btn-primary";
    btnNext.onclick = function() { state.sectionIdx++; render(); };
  }
}

// ── Quiz ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function startQuiz() {
  var modId = MODULES[state.moduleIdx].id;
  var qs = QUESTIONS.filter(function(q) { return q.moduleId === modId; });
  state.quizQuestions = shuffle(qs);
  state.quizIdx = 0;
  state.quizAnswered = false;
  state.quizSelected = null;
  state.quizCorrect = 0;
  state.quizFinished = false;
  state.screen = "quiz";
  render();
}

function renderQuiz() {
  document.getElementById("nav-footer").style.display = "none";

  if (state.quizFinished) {
    renderResults();
    return;
  }

  var q = state.quizQuestions[state.quizIdx];
  var total = state.quizQuestions.length;
  var mod = MODULES[state.moduleIdx];
  document.getElementById("header-title").textContent = "Quiz — " + mod.unite;

  var pct = Math.round(((state.quizIdx + 1) / total) * 100);
  var answersHtml = q.answers.map(function(a, i) {
    var cls = "answer-btn";
    if (state.quizAnswered) {
      if (i === q.correctIndex) cls += " correct";
      else if (i === state.quizSelected) cls += " wrong";
      else cls += " disabled";
    }
    return "<button class='" + cls + "' onclick='selectAnswer(" + i + ")'>" +
      "<span style='width:22px;height:22px;background:#e2e8f0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0'>" +
        (state.quizAnswered && i === q.correctIndex ? "✓" : state.quizAnswered && i === state.quizSelected ? "✗" : String.fromCharCode(65+i)) +
      "</span>" + a + "</button>";
  }).join("");

  var feedbackHtml = "";
  if (state.quizAnswered) {
    var ok = state.quizSelected === q.correctIndex;
    feedbackHtml = "<div class='feedback " + (ok ? "ok" : "ko") + "'>" +
      "<strong>" + (ok ? "✓ Bonne réponse !" : "✗ Mauvaise réponse") + "</strong><br>" +
      q.explanation + "</div>" +
      "<div style='text-align:right;margin-top:12px'>" +
        "<button class='btn btn-primary' onclick='nextQuestion()'>" +
          (state.quizIdx < total - 1 ? "Question suivante →" : "Voir les résultats") +
        "</button>" +
      "</div>";
  }

  document.getElementById("content").innerHTML =
    "<div style='max-width:640px;margin:0 auto'>" +
      "<div style='display:flex;justify-content:space-between;margin-bottom:16px;font-size:13px;color:#64748b'>" +
        "<span>Question " + (state.quizIdx+1) + " / " + total + "</span>" +
        "<button class='btn btn-outline' style='padding:6px 12px;font-size:12px' onclick='backToCourse()'>← Abandonner</button>" +
      "</div>" +
      "<div style='background:#e2e8f0;height:4px;border-radius:2px;margin-bottom:20px'>" +
        "<div style='width:" + pct + "%;height:100%;background:#e65100;border-radius:2px'></div></div>" +
      "<div class='card'><p style='font-size:16px;font-weight:600;color:#1e3a5f;line-height:1.6'>" + q.question + "</p></div>" +
      answersHtml + feedbackHtml +
    "</div>";
}

function selectAnswer(idx) {
  if (state.quizAnswered) return;
  state.quizSelected = idx;
  state.quizAnswered = true;
  if (idx === state.quizQuestions[state.quizIdx].correctIndex) state.quizCorrect++;
  render();
}

function nextQuestion() {
  if (state.quizIdx < state.quizQuestions.length - 1) {
    state.quizIdx++;
    state.quizAnswered = false;
    state.quizSelected = null;
    render();
  } else {
    state.quizFinished = true;
    var score = Math.round((state.quizCorrect / state.quizQuestions.length) * 100);
    reportScore(score);
    renderResults();
  }
}

function backToCourse() {
  state.screen = "course";
  render();
}

// ── Résultats ───────────────────────────────────────────────────────────────
function renderResults() {
  document.getElementById("nav-footer").style.display = "none";
  var score = Math.round((state.quizCorrect / state.quizQuestions.length) * 100);
  var passed = score >= 70;
  var mod = MODULES[state.moduleIdx];
  document.getElementById("header-title").textContent = "Résultats — " + mod.unite;

  var retryBtn = passed ? "" :
    "<button class='btn btn-outline' style='margin-right:10px' onclick='startQuiz()'>Réessayer</button>";

  document.getElementById("content").innerHTML =
    "<div style='max-width:480px;margin:40px auto;text-align:center'>" +
      "<div style='font-size:56px;margin-bottom:12px'>" + (passed ? "🏆" : "📚") + "</div>" +
      "<div class='score-big' style='color:" + (passed ? "#22c55e" : "#e53e3e") + "'>" + score + "%</div>" +
      "<div style='margin:12px 0'><span class='badge " + (passed ? "badge-ok" : "badge-ko") + "'>" +
        (passed ? "✓ Module validé" : "À retravailler") + "</span></div>" +
      "<p style='color:#64748b;font-size:14px;margin:0 0 24px'>" +
        state.quizCorrect + " / " + state.quizQuestions.length + " bonnes réponses · Seuil : 70%</p>" +
      retryBtn +
      "<button class='btn btn-primary' onclick='backToCourse()'>Retour au cours</button>" +
    "</div>";
}

// ── Init ─────────────────────────────────────────────────────────────────────
render();
</script>
</body>
</html>`;
}

// ─── Export principal ─────────────────────────────────────────────────────
export async function exportScorm() {
  const zip = new JSZip();
  zip.file('imsmanifest.xml', generateManifest());
  zip.file('index.html', generateHtml(modulesData.modules, questionsData.questions));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GreenIT_Academie_SCORM.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
