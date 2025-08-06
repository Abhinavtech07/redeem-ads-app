<<<<<<< HEAD
// src/App.js
=======
/* App.js */
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
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
<<<<<<< HEAD
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
=======
  const [adTimerMessage, setAdTimerMessage] = useState(''); // Added for timer message
  const DAILY_LIMIT = 200;
  const COINS_PER_AD = 1;

  // Ad URLs for random selection
  const adLinks = [
    "https://www.profitableratecpm.com/hte0hzu0v?key=fb45638729e3933cb3d3e10867a09592",
    "https://www.profitableratecpm.com/i63pbecy1?key=6ca31a0952a0956430a016a37ca0fd57",
    "https://www.profitableratecpm.com/eszwggg0?key=784e73c7dc4b992d827cc02a85d064b7"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
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
<<<<<<< HEAD
      }
    });
=======
      } else {
        // Clear state if user logs out
        setCoins(0);
        setAdsWatchedToday(0);
        setAdTimerMessage('');
      }
    });

    return () => unsubscribe(); // Cleanup subscription
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
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
<<<<<<< HEAD
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
=======
      setAdTimerMessage(''); // Clear any previous timer message
      return alert("You reached your daily limit of ads.");
    }

    // Disable the button and show timer message
    const watchAdButton = document.querySelector('button[onClick="handleWatchAd"]');
    if (watchAdButton) watchAdButton.disabled = true;

    let timer = 15;
    setAdTimerMessage(`Ad playing... ${timer} seconds remaining`);

    // Randomly select an ad link
    const randomAd = adLinks[Math.floor(Math.random() * adLinks.length)];
    const adWindow = window.open(randomAd, "_blank", "width=500,height=500");

    const countdown = setInterval(async () => { // Changed to async to use await for updateDoc
      timer--;
      setAdTimerMessage(`Ad playing... ${timer} seconds remaining`);

      if (timer < 0) {
        clearInterval(countdown);

        if (adWindow) {
          adWindow.close();
        }

        // Update Firebase and state
        const updatedCoins = (data.coins || 0) + COINS_PER_AD;
        const updatedAds = (data.adsWatchedToday || 0) + 1;

        await updateDoc(userRef, {
          coins: updatedCoins,
          adsWatchedToday: updatedAds,
          lastWatched: today,
          updatedAt: serverTimestamp()
        });

        setCoins(updatedCoins);
        setAdsWatchedToday(updatedAds);

        // Re-enable button and clear timer message
        if (watchAdButton) watchAdButton.disabled = false;
        setAdTimerMessage('');
        alert("✅ 1 Coin Added!");
      }
    }, 1000);
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
  };

  const handleRedeem = () => {
    if (coins >= 50) {
<<<<<<< HEAD
      alert("You will get ₹10 in redeem.\nThis will be processed manually.");
    } else {
      alert("You need at least 50 coins to redeem.");
    }
  };

=======
      alert("🎉 You can redeem ₹10 now! This will be processed manually.");
      // Placeholder for integrating Google Play Store code distribution
      // You would add your logic here to generate or retrieve a code
      // and present it to the user, then deduct coins.
      // Example:
      // const googlePlayCode = getGooglePlayCode(); // Your function to get a code
      // if (googlePlayCode) {
      //   alert(\"🎉 Congratulations! Here is your Google Play Store code: \" + googlePlayCode);
      //   // Deduct coins after successful redemption
      //   const userRef = doc(db, \"users\", user.uid);
      //   updateDoc(userRef, { coins: coins - 50 });
      //   setCoins(coins - 50);
      // } else {
      //   alert(\"❌ Error: Could not retrieve a Google Play Store code.\");
      // }
    } else {
      alert("❌ You need at least 50 coins to redeem.");
    }
  };

  // You might want to add a handleReset function here as well if needed for Firebase data
  // const handleReset = async () => { ... }

>>>>>>> 3f2968b (Recreate missing files and fix App.js)
  return (
    <div className="App">
      <h1>🎁 Redeem Coins App</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={handleLogout}>Logout</button>
          <h2>Coins: {coins}</h2>
<<<<<<< HEAD
          <h3>Watched Today: {adsWatchedToday} / {DAILY_LIMIT}</h3>
          <button onClick={handleWatchAd} disabled={adsWatchedToday >= DAILY_LIMIT}>
            ▶️ Watch Ad & Earn Coin {adsWatchedToday >= DAILY_LIMIT && "(Limit Reached)"}
          </button>
          <br /><br />
          <button onClick={handleRedeem}>💸 Redeem Coins</button>
=======
          {adTimerMessage ? ( // Display timer message if present
            <h3>{adTimerMessage}</h3>
          ) : (
            <h3>Watched Today: {adsWatchedToday} / {DAILY_LIMIT}</h3>
          )}
          <button onClick={handleWatchAd} disabled={adsWatchedToday >= DAILY_LIMIT || !!adTimerMessage}> {/* Disable button while timer is running */}
            ▶️ Watch Ad & Earn Coin
          </button>
          <br /><br />
          <button onClick={handleRedeem}>💸 Redeem Coins</button>
          {/* Add a Reset button here if you implement handleReset */}
          {/* <button onClick={handleReset}>🧹 Reset My Data</button> */}
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
        </div>
      ) : (
        <button onClick={handleLogin}>🔐 Sign in with Google</button>
      )}
    </div>
  );
}

<<<<<<< HEAD
export default App;

=======
export default App;
>>>>>>> 3f2968b (Recreate missing files and fix App.js)
