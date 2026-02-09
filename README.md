# Firda - Entertainment Gaming Platform 🎮

Welkom bij het **Firda Gaming Platform**, een interactieve web-applicatie waar studenten virtuele spellen kunnen spelen en tokens kunnen verzamelen. Dit project is ontwikkeld als onderdeel van de opleiding Software Developer bij Firda.

---

## ✨ Huidige Functionaliteiten

In de huidige versie van de applicatie vind je de volgende onderdelen:

- **Dynamische Game Carousel:** Een interactieve slider met populaire spellen zoals _Spin Fortune_ en _Dice Roll_.
- **Daily Bonus Systeem:** Gebruikers kunnen elke 24 uur een bonus van **500 Firda Tokens** claimen.
- **Games Grid:** Een overzichtelijk raster waarin alle beschikbare spellen worden weergegeven via JavaScript.
- **Token Wallet:** Een visuele weergave in de header die de huidige balans van de gebruiker bijhoudt.
- **Responsive Design:** De layout is voorbereid op verschillende schermgroottes.

---

## 🛠️ Project Structuur

De applicatie is modulair opgebouwd voor maximale flexibiliteit:

- `index.html` - De basisstructuur en de JavaScript-logica voor het renderen van de spellen.
- `style.css` - De styling van het platform (zorg dat dit bestand in dezelfde map staat!).
- **Font Awesome** - Gebruikt voor de iconen (zoals de tokens en game-emojis).

---

## 🚀 Hoe het werkt

De spellen worden ingeladen vanuit een JavaScript-database object (`const games`). Hierdoor is het heel makkelijk om nieuwe spellen toe te voegen zonder de HTML aan te passen.

### Spel Database Voorbeeld:

```javascript
{ id: 1, name: "Spin Fortune", desc: "Klassieke slotmachine", icon: "🎰", color: "#ff6b35" }
```
