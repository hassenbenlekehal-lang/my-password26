// Applications populaires pour l'autocomplétion
const KNOWN_APPS = [
  { name: 'Gmail', domain: 'gmail.com', usernameHint: 'votre@gmail.com' },
  { name: 'Facebook', domain: 'facebook.com', usernameHint: 'email ou téléphone' },
  { name: 'Instagram', domain: 'instagram.com', usernameHint: 'email ou téléphone' },
  { name: 'Twitter', domain: 'twitter.com', usernameHint: '@utilisateur' },
  { name: 'LinkedIn', domain: 'linkedin.com', usernameHint: 'email professionnel' },
  { name: 'GitHub', domain: 'github.com', usernameHint: 'email ou téléphone' },
  { name: 'Netflix', domain: 'netflix.com', usernameHint: 'email' },
  { name: 'Amazon', domain: 'amazon.fr', usernameHint: 'email' },
  { name: 'PayPal', domain: 'paypal.com', usernameHint: 'email' },
  { name: 'Spotify', domain: 'spotify.com', usernameHint: 'email' },
  { name: 'Discord', domain: 'discord.com', usernameHint: 'email ou téléphone' },
  { name: 'Reddit', domain: 'reddit.com', usernameHint: 'email ou téléphone' },
  { name: 'YouTube', domain: 'youtube.com', usernameHint: 'email' },
  { name: 'Twitch', domain: 'twitch.tv', usernameHint: 'email ou téléphone' },
  { name: 'Steam', domain: 'steamcommunity.com', usernameHint: 'email ou téléphone' },
  { name: 'Tiktok', domain: 'Tiktok.com', usernameHint: 'email ou téléphone' },
];


// Éléments DOM
const elements = {
  genBtn: document.getElementById('genBtn'),
  saveBtn: document.getElementById('saveBtn'),
  viewBtn: document.getElementById('viewBtn'),
  copyBtn: document.getElementById('copyBtn'),
  service: document.getElementById('service'),
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  masterKey: document.getElementById('masterKey'),
  savedPasswords: document.getElementById('savedPasswords'),
  serviceIcon: document.getElementById('serviceIcon'),
  suggestions: document.getElementById('suggestions'),
  lengthSlider: document.getElementById('lengthSlider'),
  lengthValue: document.getElementById('lengthValue'),
  uppercase: document.getElementById('uppercase'),
  numbers: document.getElementById('numbers'),
  symbols: document.getElementById('symbols'),
  strengthBar: document.getElementById('strengthBar')
};

// Event Listeners
elements.genBtn.addEventListener('click', generatePassword);
elements.saveBtn.addEventListener('click', savePassword);
elements.viewBtn.addEventListener('click', viewPasswords);
elements.copyBtn.addEventListener('click', () => copyToClipboard(elements.password.value));

elements.lengthSlider.addEventListener('input', (e) => {
  elements.lengthValue.textContent = e.target.value;
  generatePassword();
});

elements.password.addEventListener('input', updatePasswordStrength);

// Autocomplétion pour les services
elements.service.addEventListener('input', handleServiceInput);
elements.service.addEventListener('blur', () => {
  setTimeout(() => elements.suggestions.style.display = 'none', 200);
});

// Génération automatique au changement des options
[elements.uppercase, elements.numbers, elements.symbols].forEach(checkbox => {
  checkbox.addEventListener('change', generatePassword);
});

function handleServiceInput(e) {
  const query = e.target.value.toLowerCase();
  if (query.length < 2) {
    elements.suggestions.style.display = 'none';
    return;
  }

  const matches = KNOWN_APPS.filter(app => 
    app.name.toLowerCase().includes(query) || 
    app.domain.toLowerCase().includes(query)
  );

  if (matches.length > 0) {
    renderSuggestions(matches);
  } else {
    elements.suggestions.style.display = 'none';
  }
}

function renderSuggestions(apps) {
  elements.suggestions.innerHTML = apps.map(app => `
    <div class="suggestion-item" onclick="selectApp('${app.name}', '${app.domain}', '${app.usernameHint}')">
      <img class="suggestion-icon" src="https://www.google.com/s2/favicons?domain=${app.domain}&sz=32" alt="${app.name}">
      <div>
        <div>${app.name}</div>
        <small style="color: #666;">${app.domain}</small>
      </div>
    </div>
  `).join('');
  elements.suggestions.style.display = 'block';
}

function selectApp(name, domain, hint) {
  elements.service.value = name;
  elements.service.classList.add('with-icon');
  elements.serviceIcon.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  elements.serviceIcon.style.display = 'block';
  elements.username.placeholder = hint;
  elements.suggestions.style.display = 'none';
  generatePassword();
}

function generatePassword() {
  const length = parseInt(elements.lengthSlider.value);
  const useUppercase = elements.uppercase.checked;
  const useNumbers = elements.numbers.checked;
  const useSymbols = elements.symbols.checked;

  let chars = 'abcdefghijklmnopqrstuvwxyz';
  if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (chars === 'abcdefghijklmnopqrstuvwxyz') {
    showToast('Veuillez sélectionner au moins une option pour générer un mot de passe sécurisé!', 'error');
    return;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  elements.password.value = password;
  updatePasswordStrength();
}

function updatePasswordStrength() {
  const password = elements.password.value;
  const strength = calculatePasswordStrength(password);
  
  elements.strengthBar.className = 'strength-bar';
  if (strength >= 80) elements.strengthBar.classList.add('strength-strong');
  else if (strength >= 60) elements.strengthBar.classList.add('strength-good');
  else if (strength >= 40) elements.strengthBar.classList.add('strength-medium');
  else elements.strengthBar.classList.add('strength-weak');
}

function calculatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  return score;
}

function savePassword() {
  const service = elements.service.value.trim();
  const username = elements.username.value.trim();
  const password = elements.password.value.trim();
  const masterKey = prompt("🔐 Entrez votre mot de passe maître :");

  if (!service || !username || !password) {
    showToast('Veuillez remplir tous les champs!', 'error');
    return;
  }

  if (!masterKey) {
    showToast('Mot de passe maître requis!', 'error');
    return;
  }

  try {
    const data = { username, password, createdAt: new Date().toISOString() };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), masterKey).toString();
    
    // Stocker dans localStorage
    localStorage.setItem(service, encrypted);
    
    showToast('✅ Mot de passe sauvegardé avec succès!');
    
    // Réinitialiser le formulaire
    elements.service.value = '';
    elements.username.value = '';
    elements.password.value = '';
    elements.serviceIcon.style.display = 'none';
    elements.service.classList.remove('with-icon');
    elements.username.placeholder = 'Nom d\'utilisateur ou email';
    updatePasswordStrength();
  } catch (error) {
    showToast('Erreur lors de la sauvegarde!', 'error');
  }
}

function viewPasswords() {
  const masterKey = elements.masterKey.value;
  if (!masterKey) {
    showToast('Veuillez entrer votre mot de passe maître!', 'error');
    return;
  }

  if (localStorage.length === 0) {
    elements.savedPasswords.innerHTML = `
      <div style="text-align: center; padding: 30px; color: rgba(255,255,255,0.7);">
        <div style="font-size: 48px; margin-bottom: 15px;">🔒</div>
        <h3 style="margin-bottom: 10px;">Aucun mot de passe sauvegardé</h3>
        <p>Commencez par créer votre premier compte sécurisé!</p>
        <div style="margin-top: 20px; padding: 15px; background: rgba(46, 213, 115, 0.1); border-radius: 8px;">
          <strong>💡 Conseil:</strong> Utilisez le mot de passe maître <strong>"demo123"</strong> pour voir les données de démonstration
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  let successfulDecryptions = 0;
  
  // Parcourir tous les éléments du localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const service = localStorage.key(i);
    const encrypted = localStorage.getItem(service);
    
    try {
      const decrypted = CryptoJS.AES.decrypt(encrypted, masterKey).toString(CryptoJS.enc.Utf8);
      const data = JSON.parse(decrypted);
      successfulDecryptions++;

      // Déterminer le domaine pour l'icône
      const knownApp = KNOWN_APPS.find(app => app.name.toLowerCase() === service.toLowerCase());
      const domain = knownApp ? knownApp.domain : `${service.toLowerCase()}.com`;

      html += `
        <div class="password-entry">
          <div class="entry-header">
            <img class="entry-icon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" alt="${service}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%222%22><rect x=%223%22 y=%2211%22 width=%2218%22 height=%2211%22 rx=%222%22 ry=%222%22></rect><circle cx=%2212%22 cy=%2216%22 r=%221%22></circle><path d=%22M7 11V7a5 5 0 0 1 10 0v4%22></path></svg>'">
            <div class="entry-title">${escapeHtml(service)}</div>
          </div>
          <div class="entry-details">
            <div><strong>👤 Utilisateur:</strong> ${escapeHtml(data.username)}</div>
            <div><strong>🔑 Mot de passe:</strong> <span style="font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${escapeHtml(data.password)}</span></div>
            ${data.createdAt ? `<div><strong>📅 Créé le:</strong> ${new Date(data.createdAt).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>` : ''}
          </div>
          <div class="entry-actions">
            <button class="btn-small btn-success" onclick="copyToClipboard('${escapeJs(data.username)}')">📋 Copier utilisateur</button>
            <button class="btn-small btn-success" onclick="copyToClipboard('${escapeJs(data.password)}')">📋 Copier mot de passe</button>
            <button class="btn-small btn-danger" onclick="deletePassword('${escapeJs(service)}')">🗑️ Supprimer</button>
          </div>
        </div>
      `;
    } catch {
      html += `
        <div class="password-entry">
          <div class="entry-header">
            <div style="width: 24px; height: 24px; background: rgba(255,71,87,0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #ff4757;">❌</div>
            <div class="entry-title">${escapeHtml(service)}</div>
          </div>
          <div style="color: #ff4757; padding: 10px 0;">
            <strong>🔒 Impossible de déchiffrer</strong><br>
            <small>Mot de passe maître incorrect pour ce compte</small>
          </div>
        </div>
      `;
    }
  }

  // Ajouter un en-tête avec statistiques
  if (successfulDecryptions > 0) {
    const headerHtml = `
      <div style="background: rgba(46, 213, 115, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center; color: white;">
        <div style="font-size: 24px; margin-bottom: 5px;">🎉</div>
        <div><strong>${successfulDecryptions} compte(s) déchiffré(s) avec succès</strong></div>
        <small style="opacity: 0.8;">Vos mots de passe sont sécurisés et prêts à être utilisés</small>
      </div>
    `;
    html = headerHtml + html;
  }

  elements.savedPasswords.innerHTML = html;
  
  if (successfulDecryptions > 0) {
    showToast(`✅ ${successfulDecryptions} compte(s) affiché(s) avec succès!`);
  }
}

function deletePassword(service) {
  if (confirm(`Voulez-vous vraiment supprimer le compte "${service}" ?`)) {
    localStorage.removeItem(service);
    showToast('🗑️ Compte supprimé!');
    viewPasswords();
  }
}

function copyToClipboard(text) {
  if (!text) {
    showToast('Aucun texte à copier!', 'error');
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Texte copié dans le presse-papiers!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('📋 Texte copié dans le presse-papiers!');
  } catch (error) {
    showToast('Impossible de copier automatiquement. Veuillez copier manuellement: ' + text, 'error');
  }
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 3000);
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJs(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

// Données de démonstration (mot de passe maître: "demo123")
function initializePresetData() {
  // Vérifier si les données de démonstration existent déjà dans localStorage
  const hasPresetData = localStorage.getItem('Gmail') || 
                       localStorage.getItem('Facebook') || 
                       localStorage.getItem('GitHub') || 
                       localStorage.getItem('Netflix') || 
                       localStorage.getItem('Amazon');

  if (!hasPresetData) {


    // Chiffrer et stocker les données de démonstration dans localStorage
    presetAccounts.forEach(account => {
      const data = {
        username: account.username,
        password: account.password,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Dates aléatoires dans les 30 derniers jours
      };
      
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), demoMasterKey).toString();
      localStorage.setItem(account.service, encrypted);
    });

    // Afficher un message informatif sur les données de démonstration
    showDemoInfo();
  }
}

function showDemoInfo() {
  const demoInfo = document.createElement('div');
  demoInfo.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(46, 213, 115, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    z-index: 2000;
    max-width: 300px;
    font-size: 14px;
    line-height: 1.4;
  `;
  
  demoInfo.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">🎯 Données de Démonstration</div>
    <div>Mot de passe maître: <strong>demo123</strong></div>
    <div style="margin-top: 8px; font-size: 12px; opacity: 0.9;">
      Utilisez "demo123" pour voir les comptes de démonstration
    </div>
    <button onclick="this.parentElement.remove()" style="
      position: absolute;
      top: 5px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      min-width: auto;
    ">×</button>
  `;
  
  document.body.appendChild(demoInfo);
  
  // Supprimer automatiquement après 10 secondes
  setTimeout(() => {
    if (demoInfo.parentElement) {
      demoInfo.remove();
    }
  }, 10000);
}

// Initialiser les données de démonstration au chargement
initializePresetData();

// Génération automatique du premier mot de passe au chargement  

generatePassword();
