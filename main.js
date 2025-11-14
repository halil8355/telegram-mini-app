import { auth } from "./firebase.js";
import { register, login, resetPassword } from "./auth.js";
import { getUserData, setDefaultUser, addExp, upgradeTool } from "./db.js";
import { onAuthStateChanged } from "firebase/auth";

const app = document.getElementById("app");

function showAuth() {
  app.innerHTML = `
    <div class="container">
      <h2>Kayıt Ol | Giriş Yap</h2>
      <input id="email" type="email" placeholder="E-Mail">
      <input id="password" type="password" placeholder="Şifre">
      <button id="loginBtn">Giriş Yap</button>
      <button id="registerBtn">Kayıt Ol</button>
      <button id="resetBtn">Şifremi Unuttum</button>
      <div id="authError"></div>
    </div>
  `;
  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      const userCred = await login(email, pass);
      await afterLogin(userCred.user.uid);
    } catch (e) {
      document.getElementById("authError").innerText = e.message;
    }
  };
  document.getElementById("registerBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    try {
      const userCred = await register(email, pass);
      await setDefaultUser(userCred.user.uid);
      await afterLogin(userCred.user.uid);
    } catch (e) {
      document.getElementById("authError").innerText = e.message;
    }
  };
  document.getElementById("resetBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    try {
      await resetPassword(email);
      alert("Şifre sıfırlama e-postası gönderildi!");
    } catch (e) {
      document.getElementById("authError").innerText = e.message;
    }
  };
}

function showModalList(user, userData) {
  app.innerHTML = `
    <div class="container">
      <button onclick="window.location.reload()">Çıkış</button>
      <h2>Kazma Mini App</h2>
      <div class="modal-list">
        <button onclick="selectModal(1)">Modal 1</button>
        <button onclick="selectModal(2)">Modal 2</button>
        <button onclick="selectModal(3)">Modal 3</button>
        <button onclick="selectModal(4)">Modal 4</button>
        <button onclick="selectModal(5)">Modal 5</button>
      </div>
      <div id="modalBlock"></div>
      <div class="exp-block">EXP: <span id="expValue">${userData.exp}</span></div>
      <div class="tools">
        <button class="upgrade-btn" id="upPickaxe">⛏ Kazma (${userData.pickaxeLevel})</button>
        <button class="upgrade-btn" id="upShovel">🪓 Kürek (${userData.shovelLevel})</button>
      </div>
      <div class="banner">
        <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-8430811813654978"
         data-ad-slot="1234567890"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      </div>
    </div>
  `;

  document.getElementById("upPickaxe").onclick = async () => {
    await upgradeTool(user.uid, "pickaxeLevel");
    const data = await getUserData(user.uid);
    showModalList(user, data);
  };
  document.getElementById("upShovel").onclick = async () => {
    await upgradeTool(user.uid, "shovelLevel");
    const data = await getUserData(user.uid);
    showModalList(user, data);
  };

  window.selectModal = async (modalNumber) => {
    document.getElementById("modalBlock").innerHTML = `
      <div>
        <h3>Modal Sayfa ${modalNumber}</h3>
        <button id="mineBtn">⛏ Kazma Butonu</button>
        <div id="modalTimer"></div>
      </div>
    `;
    document.getElementById("mineBtn").onclick = () => startMining(user.uid);
  };
}

let mining = false;
function startMining(uid) {
  if (mining) return;
  mining = true;
  document.getElementById("mineBtn").disabled = true;
  document.getElementById("modalTimer").innerHTML = "Reklam gösteriliyor... (Devam etmek için reklamı kapatın)";
  setTimeout(() => {
    document.getElementById("modalTimer").innerHTML = "Kazım Başladı! 5:00";
    let seconds = 300;
    const interval = setInterval(async () => {
      seconds--;
      let m = Math.floor(seconds / 60), s = seconds % 60;
      document.getElementById("modalTimer").innerText = `Geri sayım: ${m}:${s < 10 ? "0" : ""}${s}`;
      if (seconds <= 0) {
        clearInterval(interval);
        document.getElementById("modalTimer").innerText = "Kazım tamamlandı! 100 EXP!";
        await addExp(uid, 100);
        const userData = await getUserData(uid);
        document.getElementById("expValue").innerText = userData.exp;
        mining = false;
        document.getElementById("mineBtn").disabled = false;
      }
    }, 1000);
  }, 5000);
}

export async function afterLogin(uid) {
  const userData = await getUserData(uid);
  if (!userData) await setDefaultUser(uid);
  showModalList(auth.currentUser, userData || { exp: 0, pickaxeLevel: 0, shovelLevel: 0 });
}

onAuthStateChanged(auth, user => {
  if (user) afterLogin(user.uid);
  else showAuth();
});

if (!auth.currentUser) showAuth();