import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
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

function App() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [adTimerMessage, setAdTimerMessage] = useState('');
  const [showAd, setShowAd] = useState(false);
  const [currentAdUrl, setCurrentAdUrl] = useState('');
  const DAILY_LIMIT = 200;
  const COINS_PER_AD = 1;

  const adLinks = [
    "https://www.profitableratecpm.com/hte0hzu0v?key=fb45638729e3933cb3d3e10867a09592",
    "https://www.profitableratecpm.com/i63pbecy1?key=6ca31a0952a0956430a016a37ca0fd57",
    "https://www.profitableratecpm.com/eszwggg0?key=784e73c7dc4b992d827cc02a85d064b7"
  ];

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
      setAdTimerMessage('');
      setShowAd(false);
      return alert("You reached your daily limit of ads.");
    }

    let timer = 15;
    setAdTimerMessage(`Ad playing... ${timer} seconds remaining`);

    const randomAdUrl = adLinks[Math.floor(Math.random() * adLinks.length)];
    setCurrentAdUrl(randomAdUrl);
    setShowAd(true);

    const countdown = setInterval(async () => {
      timer--;

      if (timer < 0) {
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

        clearInterval(countdown);
        setAdTimerMessage('');
        alert("✅ 1 Coin Added!");
        setShowAd(false);
        setCurrentAdUrl('');
      } else {
        setAdTimerMessage(`Ad playing... ${timer} seconds remaining`);
      }
    }, 1000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setCoins(data.coins || 0);
          setAdsWatchedToday(data.adsWatchedToday || 0);
        } else {
          await setDoc(userRef, {
            coins: 0,
            adsWatchedToday: 0,
            createdAt: serverTimestamp()
          });
        }
      } else {
        setCoins(0);
        setAdsWatchedToday(0);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRedeem = () => {
    if (coins >= 50) {
      alert("🎉 You can redeem ₹10 now! This will be processed manually.");
    } else {
      alert("❌ You need at least 50 coins to redeem.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

}
export default App;
