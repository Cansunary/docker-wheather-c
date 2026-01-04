async function getWeather() {
    const cityInput = document.getElementById("city");
    const resultEl = document.getElementById("result");
    const cityName = cityInput.value.trim();

    if (!cityName) {
        resultEl.textContent = "⚠️ Lütfen bir şehir adı girin.";
        return;
    }

    resultEl.textContent = "⏳ Hava durumu yükleniyor...";

    try {
        // 1) Geocoding API – Şehirden enlem/boylam alma
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=tr`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            resultEl.textContent = "❌ Şehir bulunamadı.";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2) Weather API – Hava durumu
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();

        const weather = weatherData.current_weather;

        // 3) Sonucu kullanıcı dostu şekilde yazdır
        resultEl.textContent = `
📍 Konum: ${name}, ${country}

🌡️ Sıcaklık: ${weather.temperature} °C
💨 Rüzgar Hızı: ${weather.windspeed} km/s
🧭 Rüzgar Yönü: ${weather.winddirection}°
⏰ Güncelleme: ${weather.time}
        `.trim();

    } catch (error) {
        console.error(error);
        resultEl.textContent = "⚠️ Bir hata oluştu. Lütfen tekrar deneyin.";
    }
}

// Enter tuşu ile çalıştırma
document.getElementById("city").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});
