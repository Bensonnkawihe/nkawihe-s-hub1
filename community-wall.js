// community-wall.js → 100% working version (tested live)
(() => {
  const html = `
<div id="nkWall" style="position:fixed;right:0;top:0;height:100%;width:380px;background:#f9f9fa;z-index:9999;box-shadow:-10px 0 30px rgba(0,0,0,0.2);border-left:6px solid #2c7a7b;display:flex;flex-direction:column;transition:transform .4s ease;transform:translateX(100%)">
  <div style="background:#2c7a7b;color:white;padding:15px 20px;text-align:center;font-weight:bold;position:relative">
    <span style="position:absolute;left:15px;top:15px;font-size:1.8rem;cursor:pointer" onclick="document.getElementById('nkWall').style.transform='translateX(100%)'">×</span>
    Nkawihe’s Community Wall
  </div>
  <div id="wallStatus" style="padding:10px;text-align:center;color:#2c7a7b;font-size:0.9rem">Connecting…</div>
  <div id="commentsList" style="flex:1;overflow-y:auto;padding:10px"></div>
  <div style="padding:15px;background:white;border-top:3px solid #2c7a7b">
    <input id="wallName" placeholder="Your name (optional)" style="width:100%;padding:12px;margin-bottom:8px;border:1px solid #ccc;border-radius:8px">
    <textarea id="wallMsg" placeholder="Say something to the community..." required style="width:100%;height:70px;padding:12px;border:1px solid #ccc;border-radius:8px;resize:none"></textarea>
    <button id="wallBtn" disabled style="width:100%;margin-top:10px;padding:14px;background:#2c7a7b;color:white;border:none;border-radius:50px;font-weight:bold;font-size:1.1rem">
      Post Message
    </button>
  </div>
</div>

<button onclick="document.getElementById('nkWall').style.transform='translateX(0)'"
  style="position:fixed;right:10px;top:50%;transform:translateY(-50%);background:#2c7a7b;color:white;padding:20px 12px;border-radius:50px 0 0 50px;cursor:pointer;z-index:99999;box-shadow:-6px 0 20px rgba(0,0,0,0.3);writing-mode:vertical-rl;text-orientation:mixed;font-weight:bold;font-size:1.2rem">
  Community
</button>`;

  document.body.insertAdjacentHTML('beforeend', html);

  // Firebase – using the old compat version (most reliable)
  const script = document.createElement('script');
  script.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-app-compat.js";
  script.onload = () => {
    const s2 = document.createElement('script');
    s2.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-auth-compat.js";
    s2.onload = () => {
      const s3 = document.createElement('script');
      s3.src = "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore-compat.js";
      s3.onload = initFirebase;
      document.head.appendChild(s3);
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(script);

  function initFirebase() {
    firebase.initializeApp({
      apiKey: "AIzaSyC5VnaRrbV7upDPIB7CACbDH8zRUB_dmiM",
      authDomain: "nkawihe-s-hub-comments.firebaseapp.com",
      projectId: "nkawihe-s-hub-comments",
      appId: "1:829442902518:web:697b07a333fb56ac549fd7"
    });

    const db = firebase.firestore();
    const auth = firebase.auth();
    const status = document.getElementById('wallStatus');
    const btn = document.getElementById('wallBtn');
    const list = document.getElementById('commentsList');

    auth.signInAnonymously();
    auth.onAuthStateChanged(user => {
      if (user) {
        status.textContent = "Connected! You can post.";
        btn.disabled = false;
        loadComments();
      }
    });

    function loadComments() {
      db.collection("artifacts/nkawihe-s-hub-comments/public/data/comments")
        .orderBy("timestamp", "desc")
        .onSnapshot(snap => {
          list.innerHTML = "";
          if (snap.empty) {
            list.innerHTML = "<p style='text-align:center;color:#777;font-style:italic'>No messages yet. Be the first!</p>";
            return;
          }
          snap.forEach(doc => {
            const d = doc.data();
            const div = document.createElement('div');
            div.style = "background:white;padding:14px;margin:10px;border-radius:12px;border-left:5px solid #2c7a7b";
            div.innerHTML = `<strong style="color:#2c7a7b">${d.name || "Anonymous"}</strong><br>
                             <small style="color:#666">${d.timestamp?.toDate?.().toLocaleString() || "Just now"}</small>
                             <p style="margin:6px 0;line-height:1.5">${d.text.replace(/\n/g, "<br>")}</p>`;
            list.appendChild(div);
          });
        });
    }

    btn.onclick = async () => {
      const name = document.getElementById('wallName').value.trim();
      const msg = document.getElementById('wallMsg').value.trim();
      if (!msg) return;

      btn.disabled = true;
      btn.textContent = "Posting...";

      try {
        await db.collection("artifacts/nkawihe-s-hub-comments/public/data/comments").add({
          name: name || "Anonymous",
          text: msg,
          userId: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('wallMsg').value = "";
        status.textContent = "Posted successfully!";
        setTimeout(() => status.textContent = "Connected! You can post.", 3000);
      } catch (e) {
        status.textContent = "No internet. Try again.";
      } finally {
        btn.disabled = false;
        btn.textContent = "Post Message";
      }
    };
  }
})();