const ALL_QUEENS = [
  { name: "Leexa Fox", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/1/1a/LeexaFox.png" },
  { name: "Vanessa Vanjie", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/a/a2/VanessaVanjieMateo.png" },
  { name: "Willam", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/4/4c/WillamBelli.png" },
  { name: "Ivy Winters", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/0/07/IvyWinters.png" },
  { name: "Tina Burner", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/0/05/TinaBurner.png" },
  { name: "Bunny Be Fly", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/2/29/BunnyBeFly.png" },
  { name: "Xilhouete", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/c/c2/Xilhouete.png" },
  { name: "Veronica Green", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/8/87/VeronicaGreen.png" },
  { name: "Vivacious", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/9/9f/Vivacious.png" },
  { name: "Sasha Colby", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/b/b3/SashaColby.png" },
  { name: "Anetra", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/f/f6/Anetra.png" },
  { name: "Mistress Isabelle Brooks", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/6/60/MistressIsabelleBrooks.png" },
  { name: "Luxx Noir London", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/f/f3/LuxxNoirLondon.png" },
  { name: "Marina Summers", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/1/13/MarinaSummers.png" },
  { name: "Jimbo", image: "https://vignette.wikia.nocookie.net/rupaulsdragrace/images/e/e0/Jimbo.png" }
];

let selectedQueens = [...ALL_QUEENS.slice(0, 9)];
let currentScreen = "cast"; 
let episodeNumber = 1;
let episodeStep = 0; 
let activeQueens = [];
let eliminatedQueens = [];
let trackRecordHistory = {};
let currentEpResults = {};

function init() {
  render();
}

function render() {
  const app = document.getElementById("app");
  if (currentScreen === "cast") {
    renderCastScreen(app);
  } else {
    renderSimulatorScreen(app);
  }
}

function renderCastScreen(app) {
  app.innerHTML = `
    <div class="cast-screen">
      <div class="left-panel">
        <p class="subtitle">This is your chance to simulate a drag race season with all your favorite contestants!</p>
        <div class="control-group">
          <label>Choose your contestants:</label>
          <div class="search-container">
            <input type="text" id="queen-search" placeholder="Type a name..." oninput="handleSearch(this.value)">
            <div id="search-results" class="search-results"></div>
          </div>
          <div class="button-group">
            <button class="btn" onclick="addRandomQueen()">Random</button>
          </div>
        </div>
        <div class="control-group">
          <label>Choose your premiere format:</label>
          <select><option>Normal premiere</option></select>
        </div>
        <div class="control-group">
          <label>Choose your returning format:</label>
          <select><option>None</option></select>
        </div>
        <div class="control-group">
          <label>Choose your season format:</label>
          <select><option>Regular</option></select>
        </div>
        <div class="control-group">
          <label>Choose your finale format:</label>
          <select><option>Top 3</option></select>
        </div>
        <button class="btn btn-primary" onclick="startSimulation()">Simulate now!</button>
      </div>
      <div class="right-panel">
        <h2>Current Cast: ${selectedQueens.length}</h2>
        <div class="selected-grid">
          ${selectedQueens.map((q, idx) => `
            <div class="queen-card">
              <img src="${q.image}" alt="${q.name}">
              <span>${q.name}</span>
              <button class="remove-btn" onclick="removeQueen(${idx})">✕</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function handleSearch(val) {
  const container = document.getElementById("search-results");
  if (!val.trim()) {
    container.innerHTML = "";
    return;
  }
  const matches = ALL_QUEENS.filter(q => 
    q.name.toLowerCase().includes(val.toLowerCase()) &&
    !selectedQueens.some(sq => sq.name === q.name)
  );
  
  container.innerHTML = matches.map(q => `
    <div class="search-item" onclick="selectQueen('${q.name}')">
      <img src="${q.image}" alt="${q.name}">
      <span>${q.name}</span>
    </div>
  `).join('');
}

function selectQueen(name) {
  const queen = ALL_QUEENS.find(q => q.name === name);
  if (queen) {
    selectedQueens.push(queen);
    render();
  }
}

function removeQueen(idx) {
  selectedQueens.splice(idx, 1);
  render();
}

function addRandomQueen() {
  const unselected = ALL_QUEENS.filter(q => !selectedQueens.some(sq => sq.name === q.name));
  if (unselected.length > 0) {
    const random = unselected[Math.floor(Math.random() * unselected.length)];
    selectedQueens.push(random);
    render();
  }
}

function startSimulation() {
  if (selectedQueens.length < 4) {
    alert("Please select at least 4 queens to simulate!");
    return;
  }
  activeQueens = [...selectedQueens];
  eliminatedQueens = [];
  episodeNumber = 1;
  episodeStep = 0;
  trackRecordHistory = {};
  selectedQueens.forEach(q => {
    trackRecordHistory[q.name] = [];
  });
  currentScreen = "sim";
  generateEpisodeData();
  render();
}

function generateEpisodeData() {
  const shuffled = [...activeQueens].sort(() => 0.5 - Math.random());
  
  let win = shuffled[0];
  let high1 = shuffled[1];
  let high2 = shuffled[2];
  let low = shuffled[3];
  let btm1 = shuffled[4];
  let btm2 = shuffled[5];
  let safe = shuffled.slice(6);

  let topBottoms = [win, high1, high2, low, btm1, btm2].filter(Boolean);

  let winnerPerformance = [win, high1, high2].filter(Boolean);
  let goodPerformance = [low, btm1, btm2, ...safe].filter(Boolean);

  let eliminated = btm2 || btm1;
  let saved = btm1 === eliminated ? btm2 : btm1;

  currentEpResults = {
    win,
    highs: [high1, high2].filter(Boolean),
    low,
    btm1,
    btm2,
    safe,
    topBottoms,
    winnerPerformance,
    goodPerformance,
    eliminated,
    saved
  };
}

function nextStep() {
  if (episodeStep < 6) {
    episodeStep++;
  } else {
    trackRecordHistory[currentEpResults.win.name].push("WIN");
    currentEpResults.highs.forEach(q => trackRecordHistory[q.name].push("HIGH"));
    currentEpResults.safe.forEach(q => trackRecordHistory[q.name].push("SAFE"));
    if (currentEpResults.low) trackRecordHistory[currentEpResults.low.name].push("LOW");
    if (currentEpResults.saved) trackRecordHistory[currentEpResults.saved.name].push("BTM2");
    
    if (currentEpResults.eliminated) {
      trackRecordHistory[currentEpResults.eliminated.name].push("ELIM");
      activeQueens = activeQueens.filter(q => q.name !== currentEpResults.eliminated.name);
      eliminatedQueens.push(currentEpResults.eliminated);
    }

    if (activeQueens.length <= 3) {
      episodeStep = 7; 
    } else {
      episodeNumber++;
      episodeStep = 0;
      generateEpisodeData();
    }
  }
  render();
}

function renderSimulatorScreen(app) {
  let content = "";

  if (activeQueens.length <= 3 && episodeStep === 7) {
    content = `
      <div class="header-banner">Grand Finale!</div>
      <div class="stage-card">
        <h3>The Top 3 Queens!</h3>
        <div class="avatar-group" style="margin-top:20px;">
          ${activeQueens.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
        </div>
        <p class="result-text" style="margin-top:15px;">Congratulation to our final queens!</p>
        ${renderTrackRecord()}
        <button class="btn btn-primary" onclick="currentScreen='cast'; render();" style="margin-top:20px;">Restart Simulation</button>
      </div>
    `;
  } else {
    switch (episodeStep) {
      case 0: // Remaining
        content = `
          <div class="header-banner">Episode ${episodeNumber}: Remaining Queens</div>
          <div class="stage-card">
            <div class="avatar-group">
              ${activeQueens.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${activeQueens.map(q => q.name).join(", ")} enter the workroom.</p>
            <button class="btn" onclick="nextStep()">Proceed</button>
          </div>
        `;
        break;
      case 1: // Maxi challenge
        content = `
          <div class="header-banner">Maxi-challenge!</div>
          <div class="stage-card">
            <p style="margin-bottom:15px;">The queens will design outfits made with curtains.</p>
            <p><strong>Queens' performances...</strong></p>
            <div class="avatar-group" style="margin-top:10px;">
              ${currentEpResults.winnerPerformance.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${currentEpResults.winnerPerformance.map(q => q.name).join(", ")} had a great performance!</p>
            <div class="avatar-group">
              ${currentEpResults.goodPerformance.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${currentEpResults.goodPerformance.map(q => q.name).join(", ")} had a good performance.</p>
            <button class="btn" onclick="nextStep()">Proceed</button>
          </div>
        `;
        break;
      case 2: // Judging / Safe
        content = `
          <div class="header-banner">Judging!</div>
          <div class="stage-card">
            <p style="margin-bottom:15px;">Based on tonight's performances...</p>
            <div class="avatar-group">
              ${currentEpResults.topBottoms.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${currentEpResults.topBottoms.map(q => q.name).join(", ")} represent the tops and bottoms of the week.</p>
            <p class="result-text" style="color:#ddd;">${currentEpResults.safe.map(q => q.name).join(", ")} you are safe.</p>
            <button class="btn" onclick="nextStep()">Proceed</button>
          </div>
        `;
        break;
      case 3: // Placements
        content = `
          <div class="header-banner">Placements</div>
          <div class="stage-card">
            <div class="avatar-circle-wrapper" style="margin-bottom:10px;">
              <img class="avatar-circle" src="${currentEpResults.win.image}">
            </div>
            <p class="result-text"><strong>${currentEpResults.win.name}</strong>, condragulations, you're the winner of today's challenge!</p>
            <div class="avatar-group">
              ${currentEpResults.highs.map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${currentEpResults.highs.map(q => q.name).join(", ")}, good job this week, you're safe.</p>
            <div class="avatar-group">
              ${[currentEpResults.low, currentEpResults.saved, currentEpResults.eliminated].filter(Boolean).map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <p class="result-text">${[currentEpResults.low, currentEpResults.saved, currentEpResults.eliminated].filter(Boolean).map(q => q.name).join(", ")} are the bottoms of the week...</p>
            ${currentEpResults.low ? `<p class="result-text"><strong>${currentEpResults.low.name}</strong>... you are safe.</p>` : ''}
            <button class="btn" onclick="nextStep()">Proceed</button>
          </div>
        `;
        break;
      case 4: // Lipsync Announcement
        content = `
          <div class="header-banner">The time has come...</div>
          <div class="stage-card">
            <p style="margin-bottom:15px;">For you to lip-sync... for your lives! Good luck, and don't fuck it up.</p>
            <p style="margin-bottom:20px;">The lip-sync song is... <strong>Whip It by Nicki Minaj!</strong></p>
            <div class="avatar-group">
              ${[currentEpResults.saved, currentEpResults.eliminated].filter(Boolean).map(q => `<img class="avatar-circle" src="${q.image}">`).join('')}
            </div>
            <button class="btn" onclick="nextStep()" style="margin-top:15px;">Show result</button>
          </div>
        `;
        break;
      case 5: // Lipsync Result
        content = `
          <div class="header-banner">I've made my decision.</div>
          <div class="stage-card">
            <div class="avatar-circle-wrapper" style="margin-bottom:10px;">
              <img class="avatar-circle" src="${currentEpResults.saved.image}">
            </div>
            <p class="result-text"><strong>${currentEpResults.saved.name}</strong>, shantay you stay.</p>
            <div class="avatar-circle-wrapper" style="margin-bottom:10px;">
              <img class="avatar-circle" src="${currentEpResults.eliminated.image}">
            </div>
            <p class="result-text"><strong>${currentEpResults.eliminated.name}</strong>, sashay away...</p>
            <button class="btn" onclick="nextStep()">Proceed to Track Record</button>
          </div>
        `;
        break;
      case 6: // Track Record Table
        content = `
          <div class="header-banner">Track Record</div>
          <div class="stage-card">
            ${renderTrackRecord()}
            <button class="btn btn-primary" onclick="nextStep()" style="margin-top:20px;">Next Episode</button>
          </div>
        `;
        break;
    }
  }

  app.innerHTML = `<div class="sim-container">${content}</div>`;
}

function renderTrackRecord() {
  const allCast = [...selectedQueens];
  return `
    <table class="track-table">
      <thead>
        <tr>
          <th>Contestant</th>
          <th>Photo</th>
          ${Array.from({ length: episodeNumber }, (_, i) => `<th>Ep. ${i + 1}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${allCast.map(q => {
          const history = trackRecordHistory[q.name] || [];
          return `
            <tr>
              <td>${q.name}</td>
              <td><img src="${q.image}" alt="${q.name}"></td>
              ${Array.from({ length: episodeNumber }, (_, i) => {
                const placement = history[i] || "-";
                return `<td><span class="badge badge-${placement}">${placement}</span></td>`;
              }).join('')}
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

window.onload = init;
