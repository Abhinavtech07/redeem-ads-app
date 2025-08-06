// src/App.js
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import "./App.css";

const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const DAILY_LIMIT = 200;
  const adLinks = [
    "https://www.profitableratecpm.com/i63pbecy1?key=6ca31a0952a0956430a016a37ca0fd57",
    "https://www.profitableratecpm.com/hte0hzu0v?key=fb45638729e3933cb3d3e10867a09592",
    "https://www.profitableratecpm.com/eszwggg0?key=784e73c7dc4b992d827cc02a85d064b7"
  ];
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const AD_DURATION = 15000; // 15 seconds in milliseconds
  const COINS_PER_AD = 1;

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const today = new Date().toDateString();

        if (userSnap.exists()) {
          const data = userSnap.data();
          setCoins(data.coins || 0);
          setAdsWatchedToday(
            data.lastWatched === today ? data.adsWatchedToday || 0 : 0
          );
        } else {
          await setDoc(userRef, {
            coins: 0,
            adsWatchedToday: 0,
            lastWatched: today
          });
        }
      }
    });
  }, []);

  const handleLogin = () => {
    signInWithPopup(auth, provider).catch((error) =>
      alert("Login failed: " + error.message)
    );
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
  };

  const handleWatchAd = async () => {
    if (!user) return alert("Please log in to watch ads.");

    const today = new Date().toDateString();
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let data = userSnap.data();

    if (data.lastWatched !== today) {
      data.adsWatchedToday = 0;
    }

    if (data.adsWatchedToday >= DAILY_LIMIT) {
      return alert("You reached your daily limit of ads.");
    }

    // Get the current ad URL
    const adURL = adLinks[currentAdIndex];

    // Disable the watch ad button
    // document.getElementById('watch-ad-button').disabled = true; // Removed as button is managed by React state

    // Show Adsterra ad popup
    const adWindow = window.open("https://www.google.com", "_blank", "width=500,height=500"); // Replace with actual ad URL

    // Update UI to show timer
    const statusElement = document.getElementById('status');
    const originalStatusText = statusElement.innerText;
    let timer = AD_DURATION / 1000;

    const countdown = setInterval(() => {
      statusElement.innerText = `Ad playing... ${timer} seconds remaining`;
      timer--;
    }, 1000);

    setTimeout(async () => {
      clearInterval(countdown);
      if (adWindow) adWindow.close();

      const updatedCoins = (data.coins || 0) + COINS_PER_AD;
      const updatedAds = (data.adsWatchedToday || 0) + 1;

      await updateDoc(userRef, { coins: updatedCoins, adsWatchedToday: updatedAds, lastWatched: today, updatedAt: serverTimestamp() });
      setCoins(updatedCoins);
      setAdsWatchedToday(updatedAds);
      // statusElement.innerText = originalStatusText; // Restore original text - Removed as status is managed by React state
      // document.getElementById('watch-ad-button').disabled = false; // Re-enable button - Removed as button is managed by React state

      // Move to the next ad URL for the next watch
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adLinks.length);
      alert("✅ 1 Coin Added!");
    }, AD_DURATION);
  };

  const handleRedeem = () => {
    if (coins >= 50) {
      alert("You will get ₹10 in redeem.\nThis will be processed manually.");
    } else {
      alert("You need at least 50 coins to redeem.");
    }
  };

  return (
    <div className="App">
      <h1>🎁 Redeem Coins App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>Coins: {coins}</h2>
          <h3>Watched Today: {adsWatchedToday} / {DAILY_LIMIT}</h3>
          <button onClick={handleWatchAd} disabled={adsWatchedToday >= DAILY_LIMIT}>
            ▶️ Watch Ad & Earn Coin {adsWatchedToday >= DAILY_LIMIT && "(Limit Reached)"}
          </button>
          <br /><br />
          <button onClick={handleRedeem}>💸 Redeem Coins</button>
        </div>
      ) : (
        <button onClick={handleLogin}>🔐 Sign in with Google</button>
      )}
    </div>
  );
}

export default App;

