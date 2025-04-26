document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Chyba při přihlášení");
  
      // Vypíšu pro kontrolu do konzole, co server poslal
      console.log("Přijatý uživatel:", data.user);
  
      // Uložení tokenu do localStorage
      localStorage.setItem("token", data.token);
  
      // Aktualizace DOM
      document.getElementById("userInfo").style.display = "block"; // Ukážeme profil
      document.getElementById("userName").textContent = data.user.fullName;
      document.getElementById("userPic").src = data.user.profile_picture;
      document.getElementById("userBio").textContent = data.user.bio; // Bio
  
      // Skrytí formuláře po přihlášení
      document.getElementById("loginForm").style.display = "none";
    } catch (err) {
      alert("Chyba: " + err.message);
    }
  });
  