const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const soundToggle = document.getElementById('soundToggle');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const speedStat = document.getElementById('speedStat');
const lengthStat = document.getElementById('lengthStat');

// Mobile controls
const mobileControls = document.getElementById('mobileControls');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const mobilePauseBtn = document.getElementById('mobilePauseBtn');
const mobileRestartBtn = document.getElementById('mobileRestartBtn');

// Game overlay controls
const gameControlsOverlay = document.getElementById('gameControlsOverlay');
const overlayPauseBtn = document.getElementById('overlayPauseBtn');
const overlayRestartBtn = document.getElementById('overlayRestartBtn');

// Finger controls
const fingerControls = document.getElementById('fingerControls');
const fingerUp = document.getElementById('fingerUp');
const fingerDown = document.getElementById('fingerDown');
const fingerLeft = document.getElementById('fingerLeft');
const fingerRight = document.getElementById('fingerRight');

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Touch/swipe variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const gridSize = 16;
const tileCount = canvas.width / gridSize;

// Language learning system
const languagePairs = [
    // Spanish - Basic Greetings & Courtesy
    { word: "hello", translation: "hola", ukrainian: "привіт", language: "Spanish" },
    { word: "goodbye", translation: "adiós", ukrainian: "до побачення", language: "Spanish" },
    { word: "good morning", translation: "buenos días", ukrainian: "добрий ранок", language: "Spanish" },
    { word: "good afternoon", translation: "buenas tardes", ukrainian: "добрий день", language: "Spanish" },
    { word: "good night", translation: "buenas noches", ukrainian: "добрий вечір", language: "Spanish" },
    { word: "thank you", translation: "gracias", ukrainian: "дякую", language: "Spanish" },
    { word: "please", translation: "por favor", ukrainian: "будь ласка", language: "Spanish" },
    { word: "you're welcome", translation: "de nada", ukrainian: "будь ласка", language: "Spanish" },
    { word: "excuse me", translation: "perdón", ukrainian: "вибачте", language: "Spanish" },
    { word: "sorry", translation: "lo siento", ukrainian: "вибачте", language: "Spanish" },
    
    // Spanish - Family & People
    { word: "family", translation: "familia", ukrainian: "сім'я", language: "Spanish" },
    { word: "mother", translation: "madre", ukrainian: "мати", language: "Spanish" },
    { word: "father", translation: "padre", ukrainian: "батько", language: "Spanish" },
    { word: "sister", translation: "hermana", ukrainian: "сестра", language: "Spanish" },
    { word: "brother", translation: "hermano", ukrainian: "брат", language: "Spanish" },
    { word: "friend", translation: "amigo", ukrainian: "друг", language: "Spanish" },
    { word: "woman", translation: "mujer", ukrainian: "жінка", language: "Spanish" },
    { word: "man", translation: "hombre", ukrainian: "чоловік", language: "Spanish" },
    { word: "boy", translation: "niño", ukrainian: "хлопчик", language: "Spanish" },
    { word: "girl", translation: "niña", ukrainian: "дівчинка", language: "Spanish" },
    
    // Spanish - Food & Drinks
    { word: "food", translation: "comida", ukrainian: "їжа", language: "Spanish" },
    { word: "water", translation: "agua", ukrainian: "вода", language: "Spanish" },
    { word: "bread", translation: "pan", ukrainian: "хліб", language: "Spanish" },
    { word: "milk", translation: "leche", ukrainian: "молоко", language: "Spanish" },
    { word: "coffee", translation: "café", ukrainian: "кава", language: "Spanish" },
    { word: "tea", translation: "té", ukrainian: "чай", language: "Spanish" },
    { word: "apple", translation: "manzana", ukrainian: "яблуко", language: "Spanish" },
    { word: "banana", translation: "plátano", ukrainian: "банан", language: "Spanish" },
    { word: "meat", translation: "carne", ukrainian: "м'ясо", language: "Spanish" },
    { word: "fish", translation: "pescado", ukrainian: "риба", language: "Spanish" },
    { word: "rice", translation: "arroz", ukrainian: "рис", language: "Spanish" },
    { word: "egg", translation: "huevo", ukrainian: "яйце", language: "Spanish" },
    { word: "cheese", translation: "queso", ukrainian: "сир", language: "Spanish" },
    { word: "butter", translation: "mantequilla", ukrainian: "масло", language: "Spanish" },
    { word: "soup", translation: "sopa", ukrainian: "суп", language: "Spanish" },
    { word: "salad", translation: "ensalada", ukrainian: "салат", language: "Spanish" },
    { word: "potato", translation: "papa", ukrainian: "картопля", language: "Spanish" },
    { word: "tomato", translation: "tomate", ukrainian: "помідор", language: "Spanish" },
    { word: "onion", translation: "cebolla", ukrainian: "цибуля", language: "Spanish" },
    { word: "garlic", translation: "ajo", ukrainian: "часник", language: "Spanish" },
    { word: "carrot", translation: "zanahoria", ukrainian: "морква", language: "Spanish" },
    { word: "lettuce", translation: "lechuga", ukrainian: "салат", language: "Spanish" },
    { word: "orange", translation: "naranja", ukrainian: "апельсин", language: "Spanish" },
    { word: "grape", translation: "uva", ukrainian: "виноград", language: "Spanish" },
    { word: "strawberry", translation: "fresa", ukrainian: "полуниця", language: "Spanish" },
    { word: "chicken", translation: "pollo", ukrainian: "курча", language: "Spanish" },
    { word: "beef", translation: "res", ukrainian: "яловичина", language: "Spanish" },
    { word: "pork", translation: "cerdo", ukrainian: "свинина", language: "Spanish" },
    { word: "shrimp", translation: "camarón", ukrainian: "креветка", language: "Spanish" },
    { word: "sugar", translation: "azúcar", ukrainian: "цукор", language: "Spanish" },
    { word: "salt", translation: "sal", ukrainian: "сіль", language: "Spanish" },
    { word: "pepper", translation: "pimienta", ukrainian: "перець", language: "Spanish" },
    { word: "oil", translation: "aceite", ukrainian: "олія", language: "Spanish" },
    { word: "wine", translation: "vino", ukrainian: "вино", language: "Spanish" },
    { word: "beer", translation: "cerveza", ukrainian: "пиво", language: "Spanish" },
    { word: "juice", translation: "jugo", ukrainian: "сік", language: "Spanish" },
    
    // Spanish - Home & Objects
    { word: "house", translation: "casa", language: "Spanish" },
    { word: "room", translation: "habitación", language: "Spanish" },
    { word: "kitchen", translation: "cocina", language: "Spanish" },
    { word: "bathroom", translation: "baño", language: "Spanish" },
    { word: "bedroom", translation: "dormitorio", language: "Spanish" },
    { word: "table", translation: "mesa", language: "Spanish" },
    { word: "chair", translation: "silla", language: "Spanish" },
    { word: "bed", translation: "cama", language: "Spanish" },
    { word: "door", translation: "puerta", language: "Spanish" },
    { word: "window", translation: "ventana", language: "Spanish" },
    { word: "book", translation: "libro", language: "Spanish" },
    { word: "pen", translation: "bolígrafo", language: "Spanish" },
    { word: "paper", translation: "papel", language: "Spanish" },
    { word: "pencil", translation: "lápiz", language: "Spanish" },
    { word: "notebook", translation: "cuaderno", language: "Spanish" },
    { word: "dictionary", translation: "diccionario", language: "Spanish" },
    { word: "magazine", translation: "revista", language: "Spanish" },
    { word: "newspaper", translation: "periódico", language: "Spanish" },
    { word: "computer", translation: "computadora", language: "Spanish" },
    { word: "phone", translation: "teléfono", language: "Spanish" },
    { word: "television", translation: "televisión", language: "Spanish" },
    { word: "radio", translation: "radio", language: "Spanish" },
    { word: "camera", translation: "cámara", language: "Spanish" },
    { word: "clock", translation: "reloj", language: "Spanish" },
    { word: "watch", translation: "reloj", language: "Spanish" },
    { word: "lamp", translation: "lámpara", language: "Spanish" },
    { word: "mirror", translation: "espejo", language: "Spanish" },
    { word: "picture", translation: "foto", language: "Spanish" },
    { word: "painting", translation: "pintura", language: "Spanish" },
    { word: "carpet", translation: "alfombra", language: "Spanish" },
    { word: "curtain", translation: "cortina", language: "Spanish" },
    { word: "pillow", translation: "almohada", language: "Spanish" },
    { word: "blanket", translation: "manta", language: "Spanish" },
    { word: "towel", translation: "toalla", language: "Spanish" },
    { word: "soap", translation: "jabón", language: "Spanish" },
    { word: "shampoo", translation: "champú", language: "Spanish" },
    { word: "toothbrush", translation: "cepillo de dientes", language: "Spanish" },
    { word: "toothpaste", translation: "pasta de dientes", language: "Spanish" },
    { word: "comb", translation: "peine", language: "Spanish" },
    { word: "brush", translation: "cepillo", language: "Spanish" },
    
    // Spanish - Transportation
    { word: "car", translation: "coche", language: "Spanish" },
    { word: "bus", translation: "autobús", language: "Spanish" },
    { word: "train", translation: "tren", language: "Spanish" },
    { word: "bicycle", translation: "bicicleta", language: "Spanish" },
    { word: "airplane", translation: "avión", language: "Spanish" },
    { word: "boat", translation: "barco", language: "Spanish" },
    { word: "motorcycle", translation: "moto", language: "Spanish" },
    { word: "taxi", translation: "taxi", language: "Spanish" },
    { word: "subway", translation: "metro", language: "Spanish" },
    { word: "truck", translation: "camión", language: "Spanish" },
    { word: "bicycle", translation: "bicicleta", language: "Spanish" },
    
    // Spanish - Clothing
    { word: "shirt", translation: "camisa", language: "Spanish" },
    { word: "pants", translation: "pantalones", language: "Spanish" },
    { word: "dress", translation: "vestido", language: "Spanish" },
    { word: "shoes", translation: "zapatos", language: "Spanish" },
    { word: "socks", translation: "calcetines", language: "Spanish" },
    { word: "hat", translation: "sombrero", language: "Spanish" },
    { word: "coat", translation: "abrigo", language: "Spanish" },
    { word: "jacket", translation: "chaqueta", language: "Spanish" },
    { word: "skirt", translation: "falda", language: "Spanish" },
    { word: "belt", translation: "cinturón", language: "Spanish" },
    { word: "bag", translation: "bolsa", language: "Spanish" },
    { word: "wallet", translation: "billetera", language: "Spanish" },
    { word: "purse", translation: "bolso", language: "Spanish" },
    { word: "backpack", translation: "mochila", language: "Spanish" },
    
    // Spanish - Body Parts
    { word: "head", translation: "cabeza", language: "Spanish" },
    { word: "hair", translation: "pelo", language: "Spanish" },
    { word: "face", translation: "cara", language: "Spanish" },
    { word: "eye", translation: "ojo", language: "Spanish" },
    { word: "nose", translation: "nariz", language: "Spanish" },
    { word: "mouth", translation: "boca", language: "Spanish" },
    { word: "ear", translation: "oreja", language: "Spanish" },
    { word: "neck", translation: "cuello", language: "Spanish" },
    { word: "shoulder", translation: "hombro", language: "Spanish" },
    { word: "arm", translation: "brazo", language: "Spanish" },
    { word: "hand", translation: "mano", language: "Spanish" },
    { word: "finger", translation: "dedo", language: "Spanish" },
    { word: "leg", translation: "pierna", language: "Spanish" },
    { word: "foot", translation: "pie", language: "Spanish" },
    { word: "toe", translation: "dedo del pie", language: "Spanish" },
    { word: "heart", translation: "corazón", language: "Spanish" },
    { word: "stomach", translation: "estómago", language: "Spanish" },
    { word: "back", translation: "espalda", language: "Spanish" },
    
    // Spanish - Colors
    { word: "red", translation: "rojo", language: "Spanish" },
    { word: "blue", translation: "azul", language: "Spanish" },
    { word: "green", translation: "verde", language: "Spanish" },
    { word: "yellow", translation: "amarillo", language: "Spanish" },
    { word: "black", translation: "negro", language: "Spanish" },
    { word: "white", translation: "blanco", language: "Spanish" },
    
    // Spanish - Numbers
    { word: "one", translation: "uno", language: "Spanish" },
    { word: "two", translation: "dos", language: "Spanish" },
    { word: "three", translation: "tres", language: "Spanish" },
    { word: "four", translation: "cuatro", language: "Spanish" },
    { word: "five", translation: "cinco", language: "Spanish" },
    { word: "six", translation: "seis", language: "Spanish" },
    { word: "seven", translation: "siete", language: "Spanish" },
    { word: "eight", translation: "ocho", language: "Spanish" },
    { word: "nine", translation: "nueve", language: "Spanish" },
    { word: "ten", translation: "diez", language: "Spanish" },
    { word: "eleven", translation: "once", language: "Spanish" },
    { word: "twelve", translation: "doce", language: "Spanish" },
    { word: "thirteen", translation: "trece", language: "Spanish" },
    { word: "fourteen", translation: "catorce", language: "Spanish" },
    { word: "fifteen", translation: "quince", language: "Spanish" },
    { word: "twenty", translation: "veinte", language: "Spanish" },
    { word: "thirty", translation: "treinta", language: "Spanish" },
    { word: "forty", translation: "cuarenta", language: "Spanish" },
    { word: "fifty", translation: "cincuenta", language: "Spanish" },
    { word: "hundred", translation: "cien", language: "Spanish" },
    { word: "thousand", translation: "mil", language: "Spanish" },
    { word: "first", translation: "primero", language: "Spanish" },
    { word: "second", translation: "segundo", language: "Spanish" },
    { word: "third", translation: "tercero", language: "Spanish" },
    
    // Spanish - Time & Weather
    { word: "today", translation: "hoy", language: "Spanish" },
    { word: "tomorrow", translation: "mañana", language: "Spanish" },
    { word: "yesterday", translation: "ayer", language: "Spanish" },
    { word: "morning", translation: "mañana", language: "Spanish" },
    { word: "afternoon", translation: "tarde", language: "Spanish" },
    { word: "night", translation: "noche", language: "Spanish" },
    { word: "sun", translation: "sol", language: "Spanish" },
    { word: "rain", translation: "lluvia", language: "Spanish" },
    { word: "hot", translation: "caliente", language: "Spanish" },
    { word: "cold", translation: "frío", language: "Spanish" },
    { word: "warm", translation: "templado", language: "Spanish" },
    { word: "snow", translation: "nieve", language: "Spanish" },
    { word: "wind", translation: "viento", language: "Spanish" },
    { word: "cloud", translation: "nube", language: "Spanish" },
    { word: "sky", translation: "cielo", language: "Spanish" },
    { word: "moon", translation: "luna", language: "Spanish" },
    { word: "star", translation: "estrella", language: "Spanish" },
    { word: "beach", translation: "playa", language: "Spanish" },
    { word: "mountain", translation: "montaña", language: "Spanish" },
    { word: "river", translation: "río", language: "Spanish" },
    { word: "ocean", translation: "océano", language: "Spanish" },
    { word: "forest", translation: "bosque", language: "Spanish" },
    { word: "tree", translation: "árbol", language: "Spanish" },
    { word: "flower", translation: "flor", language: "Spanish" },
    { word: "grass", translation: "pasto", language: "Spanish" },
    
    // German - Basic Greetings & Courtesy
    { word: "hello", translation: "hallo", ukrainian: "привіт", language: "German" },
    { word: "goodbye", translation: "auf wiedersehen", ukrainian: "до побачення", language: "German" },
    { word: "good morning", translation: "guten morgen", ukrainian: "добрий ранок", language: "German" },
    { word: "good afternoon", translation: "guten tag", ukrainian: "добрий день", language: "German" },
    { word: "good evening", translation: "guten abend", ukrainian: "добрий вечір", language: "German" },
    { word: "good night", translation: "gute nacht", ukrainian: "добрий вечір", language: "German" },
    { word: "thank you", translation: "danke", ukrainian: "дякую", language: "German" },
    { word: "please", translation: "bitte", ukrainian: "будь ласка", language: "German" },
    { word: "you're welcome", translation: "bitte schön", ukrainian: "будь ласка", language: "German" },
    { word: "excuse me", translation: "entschuldigung", ukrainian: "вибачте", language: "German" },
    { word: "sorry", translation: "es tut mir leid", ukrainian: "вибачте", language: "German" },
    
    // German - Family & People
    { word: "family", translation: "familie", ukrainian: "сім'я", language: "German" },
    { word: "mother", translation: "mutter", ukrainian: "мати", language: "German" },
    { word: "father", translation: "vater", ukrainian: "батько", language: "German" },
    { word: "sister", translation: "schwester", ukrainian: "сестра", language: "German" },
    { word: "brother", translation: "bruder", ukrainian: "брат", language: "German" },
    { word: "friend", translation: "freund", ukrainian: "друг", language: "German" },
    { word: "woman", translation: "frau", ukrainian: "жінка", language: "German" },
    { word: "man", translation: "mann", ukrainian: "чоловік", language: "German" },
    { word: "boy", translation: "junge", ukrainian: "хлопчик", language: "German" },
    { word: "girl", translation: "mädchen", ukrainian: "дівчинка", language: "German" },
    
    // German - Food & Drinks
    { word: "food", translation: "essen", ukrainian: "їжа", language: "German" },
    { word: "water", translation: "wasser", ukrainian: "вода", language: "German" },
    { word: "bread", translation: "brot", ukrainian: "хліб", language: "German" },
    { word: "milk", translation: "milch", ukrainian: "молоко", language: "German" },
    { word: "coffee", translation: "kaffee", ukrainian: "кава", language: "German" },
    { word: "tea", translation: "tee", ukrainian: "чай", language: "German" },
    { word: "apple", translation: "apfel", ukrainian: "яблуко", language: "German" },
    { word: "banana", translation: "banane", ukrainian: "банан", language: "German" },
    { word: "meat", translation: "fleisch", ukrainian: "м'ясо", language: "German" },
    { word: "fish", translation: "fisch", ukrainian: "риба", language: "German" },
    { word: "rice", translation: "reis", ukrainian: "рис", language: "German" },
    { word: "egg", translation: "ei", ukrainian: "яйце", language: "German" },
    { word: "cheese", translation: "käse", ukrainian: "сир", language: "German" },
    { word: "soup", translation: "suppe", ukrainian: "суп", language: "German" },
    { word: "salad", translation: "salat", ukrainian: "салат", language: "German" },
    { word: "potato", translation: "kartoffel", ukrainian: "картопля", language: "German" },
    { word: "tomato", translation: "tomate", ukrainian: "помідор", language: "German" },
    { word: "onion", translation: "zwiebel", ukrainian: "цибуля", language: "German" },
    { word: "garlic", translation: "knoblauch", ukrainian: "часник", language: "German" },
    { word: "carrot", translation: "karotte", ukrainian: "морква", language: "German" },
    { word: "lettuce", translation: "kopfsalat", ukrainian: "салат", language: "German" },
    { word: "orange", translation: "orange", ukrainian: "апельсин", language: "German" },
    { word: "grape", translation: "traube", ukrainian: "виноград", language: "German" },
    { word: "strawberry", translation: "erdbeere", ukrainian: "полуниця", language: "German" },
    { word: "chicken", translation: "hähnchen", ukrainian: "курча", language: "German" },
    { word: "beef", translation: "rindfleisch", ukrainian: "яловичина", language: "German" },
    { word: "pork", translation: "schweinefleisch", ukrainian: "свинина", language: "German" },
    { word: "shrimp", translation: "garnele", ukrainian: "креветка", language: "German" },
    { word: "sugar", translation: "zucker", ukrainian: "цукор", language: "German" },
    { word: "salt", translation: "salz", ukrainian: "сіль", language: "German" },
    { word: "pepper", translation: "pfeffer", ukrainian: "перець", language: "German" },
    { word: "oil", translation: "öl", ukrainian: "олія", language: "German" },
    { word: "wine", translation: "wein", ukrainian: "вино", language: "German" },
    { word: "beer", translation: "bier", ukrainian: "пиво", language: "German" },
    { word: "juice", translation: "saft", ukrainian: "сік", language: "German" },
    { word: "butter", translation: "butter", ukrainian: "масло", language: "German" },
    
    // German - Home & Objects
    { word: "house", translation: "haus", language: "German" },
    { word: "room", translation: "zimmer", language: "German" },
    { word: "kitchen", translation: "küche", language: "German" },
    { word: "bathroom", translation: "badezimmer", language: "German" },
    { word: "bedroom", translation: "schlafzimmer", language: "German" },
    { word: "table", translation: "tisch", language: "German" },
    { word: "chair", translation: "stuhl", language: "German" },
    { word: "bed", translation: "bett", language: "German" },
    { word: "door", translation: "tür", language: "German" },
    { word: "window", translation: "fenster", language: "German" },
    { word: "book", translation: "buch", language: "German" },
    { word: "pen", translation: "stift", language: "German" },
    { word: "paper", translation: "papier", language: "German" },
    { word: "clock", translation: "uhr", language: "German" },
    { word: "lamp", translation: "lampe", language: "German" },
    { word: "mirror", translation: "spiegel", language: "German" },
    { word: "picture", translation: "bild", language: "German" },
    { word: "painting", translation: "gemälde", language: "German" },
    { word: "carpet", translation: "teppich", language: "German" },
    { word: "curtain", translation: "vorhang", language: "German" },
    { word: "pillow", translation: "kissen", language: "German" },
    { word: "blanket", translation: "decke", language: "German" },
    { word: "towel", translation: "handtuch", language: "German" },
    { word: "soap", translation: "seife", language: "German" },
    { word: "shampoo", translation: "shampoo", language: "German" },
    { word: "toothbrush", translation: "zahnbürste", language: "German" },
    { word: "toothpaste", translation: "zahnpasta", language: "German" },
    { word: "comb", translation: "kamm", language: "German" },
    { word: "brush", translation: "bürste", language: "German" },
    { word: "pencil", translation: "bleistift", language: "German" },
    { word: "notebook", translation: "notizbuch", language: "German" },
    { word: "dictionary", translation: "wörterbuch", language: "German" },
    { word: "magazine", translation: "zeitschrift", language: "German" },
    { word: "newspaper", translation: "zeitung", language: "German" },
    { word: "computer", translation: "computer", language: "German" },
    { word: "phone", translation: "telefon", language: "German" },
    { word: "television", translation: "fernseher", language: "German" },
    { word: "radio", translation: "radio", language: "German" },
    { word: "camera", translation: "kamera", language: "German" },
    
    // German - Transportation
    { word: "car", translation: "auto", language: "German" },
    { word: "bus", translation: "bus", language: "German" },
    { word: "train", translation: "zug", language: "German" },
    { word: "bicycle", translation: "fahrrad", language: "German" },
    { word: "airplane", translation: "flugzeug", language: "German" },
    { word: "boat", translation: "boot", language: "German" },
    { word: "motorcycle", translation: "motorrad", language: "German" },
    { word: "taxi", translation: "taxi", language: "German" },
    { word: "subway", translation: "u-bahn", language: "German" },
    { word: "truck", translation: "lastwagen", language: "German" },
    
    // German - Clothing
    { word: "shirt", translation: "hemd", language: "German" },
    { word: "pants", translation: "hose", language: "German" },
    { word: "dress", translation: "kleid", language: "German" },
    { word: "shoes", translation: "schuhe", language: "German" },
    { word: "socks", translation: "socken", language: "German" },
    { word: "hat", translation: "hut", language: "German" },
    { word: "coat", translation: "mantel", language: "German" },
    { word: "jacket", translation: "jacke", language: "German" },
    { word: "skirt", translation: "rock", language: "German" },
    { word: "belt", translation: "gürtel", language: "German" },
    { word: "bag", translation: "tasche", language: "German" },
    { word: "wallet", translation: "geldbörse", language: "German" },
    { word: "purse", translation: "handtasche", language: "German" },
    { word: "backpack", translation: "rucksack", language: "German" },
    
    // German - Colors
    { word: "red", translation: "rot", language: "German" },
    { word: "blue", translation: "blau", language: "German" },
    { word: "green", translation: "grün", language: "German" },
    { word: "yellow", translation: "gelb", language: "German" },
    { word: "black", translation: "schwarz", language: "German" },
    { word: "white", translation: "weiß", language: "German" },
    { word: "brown", translation: "braun", language: "German" },
    { word: "purple", translation: "lila", language: "German" },
    
    // German - Numbers
    { word: "one", translation: "eins", language: "German" },
    { word: "two", translation: "zwei", language: "German" },
    { word: "three", translation: "drei", language: "German" },
    { word: "four", translation: "vier", language: "German" },
    { word: "five", translation: "fünf", language: "German" },
    { word: "six", translation: "sechs", language: "German" },
    { word: "seven", translation: "sieben", language: "German" },
    { word: "eight", translation: "acht", language: "German" },
    { word: "nine", translation: "neun", language: "German" },
    { word: "ten", translation: "zehn", language: "German" },
    { word: "hundred", translation: "hundert", language: "German" },
    
    // German - Time & Weather
    { word: "today", translation: "heute", language: "German" },
    { word: "tomorrow", translation: "morgen", language: "German" },
    { word: "yesterday", translation: "gestern", language: "German" },
    { word: "morning", translation: "morgen", language: "German" },
    { word: "afternoon", translation: "nachmittag", language: "German" },
    { word: "evening", translation: "abend", language: "German" },
    { word: "night", translation: "nacht", language: "German" },
    { word: "sun", translation: "sonne", language: "German" },
    { word: "rain", translation: "regen", language: "German" },
    { word: "snow", translation: "schnee", language: "German" },
    { word: "hot", translation: "heiß", language: "German" },
    { word: "cold", translation: "kalt", language: "German" },
    { word: "warm", translation: "warm", language: "German" },
    
    // German - Animals
    { word: "dog", translation: "hund", language: "German" },
    { word: "cat", translation: "katze", language: "German" },
    { word: "bird", translation: "vogel", language: "German" },
    { word: "horse", translation: "pferd", language: "German" },
    { word: "cow", translation: "kuh", language: "German" },
    { word: "pig", translation: "schwein", language: "German" },
    
    // German - Body Parts
    { word: "head", translation: "kopf", language: "German" },
    { word: "hand", translation: "hand", language: "German" },
    { word: "eye", translation: "auge", language: "German" },
    { word: "mouth", translation: "mund", language: "German" },
    { word: "ear", translation: "ohr", language: "German" },
    { word: "nose", translation: "nase", language: "German" },
    { word: "hair", translation: "haar", language: "German" },
    { word: "face", translation: "gesicht", language: "German" },
    { word: "neck", translation: "hals", language: "German" },
    { word: "shoulder", translation: "schulter", language: "German" },
    { word: "arm", translation: "arm", language: "German" },
    { word: "finger", translation: "finger", language: "German" },
    { word: "leg", translation: "bein", language: "German" },
    { word: "foot", translation: "fuß", language: "German" },
    { word: "toe", translation: "zeh", language: "German" },
    { word: "heart", translation: "herz", language: "German" },
    { word: "stomach", translation: "magen", language: "German" },
    { word: "back", translation: "rücken", language: "German" },
    
    // German - Additional Numbers
    { word: "eleven", translation: "elf", language: "German" },
    { word: "twelve", translation: "zwölf", language: "German" },
    { word: "thirteen", translation: "dreizehn", language: "German" },
    { word: "fourteen", translation: "vierzehn", language: "German" },
    { word: "fifteen", translation: "fünfzehn", language: "German" },
    { word: "twenty", translation: "zwanzig", language: "German" },
    { word: "thirty", translation: "dreißig", language: "German" },
    { word: "forty", translation: "vierzig", language: "German" },
    { word: "fifty", translation: "fünfzig", language: "German" },
    { word: "thousand", translation: "tausend", language: "German" },
    { word: "first", translation: "erste", language: "German" },
    { word: "second", translation: "zweite", language: "German" },
    { word: "third", translation: "dritte", language: "German" },
    
    // Ukrainian - Basic Words
    { word: "hello", translation: "привіт", ukrainian: "привіт", language: "Ukrainian" },
    { word: "goodbye", translation: "до побачення", ukrainian: "до побачення", language: "Ukrainian" },
    { word: "thank you", translation: "дякую", ukrainian: "дякую", language: "Ukrainian" },
    { word: "please", translation: "будь ласка", ukrainian: "будь ласка", language: "Ukrainian" },
    { word: "yes", translation: "так", ukrainian: "так", language: "Ukrainian" },
    { word: "no", translation: "ні", ukrainian: "ні", language: "Ukrainian" },
    { word: "water", translation: "вода", ukrainian: "вода", language: "Ukrainian" },
    { word: "bread", translation: "хліб", ukrainian: "хліб", language: "Ukrainian" },
    { word: "house", translation: "будинок", ukrainian: "будинок", language: "Ukrainian" },
    { word: "car", translation: "автомобіль", ukrainian: "автомобіль", language: "Ukrainian" },
    { word: "book", translation: "книга", ukrainian: "книга", language: "Ukrainian" },
    { word: "friend", translation: "друг", ukrainian: "друг", language: "Ukrainian" },
    { word: "family", translation: "сім'я", ukrainian: "сім'я", language: "Ukrainian" },
    { word: "mother", translation: "мати", ukrainian: "мати", language: "Ukrainian" },
    { word: "father", translation: "батько", ukrainian: "батько", language: "Ukrainian" },
    { word: "sun", translation: "сонце", ukrainian: "сонце", language: "Ukrainian" },
    { word: "moon", translation: "місяць", ukrainian: "місяць", language: "Ukrainian" },
    { word: "star", translation: "зірка", ukrainian: "зірка", language: "Ukrainian" },
    { word: "love", translation: "любов", ukrainian: "любов", language: "Ukrainian" },
    { word: "peace", translation: "мир", ukrainian: "мир", language: "Ukrainian" }
];

let currentLanguage = "Spanish";
let currentWord = "";
let currentTranslation = "";
let currentUkrainian = "";
let wordDisplay = "";
let isShowingWord = true;
let wordTimer = 0;
let wordDisplayTime = 3000; // 3 seconds to show word
let streak = 0;
let correctAnswers = 0;
let totalQuestions = 0;

let snake = [
    {x: 12, y: 12, z: 0}
];
let food = {x: 18, y: 18, z: 0};
let dx = 0;
let dy = 0;
let score = 0;
let gameSpeed = 150;
let gameRunning = true;
let gamePaused = false;
let foodGlow = 0;
let particles = [];
let soundEnabled = true;
let audioContext;
let oscillators = {};
let time = 0;

// Sound system
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(frequency, duration, type = 'sine') {
    if (!soundEnabled || !audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playEatSound() {
    playSound(800, 0.1, 'square');
    setTimeout(() => playSound(1000, 0.1, 'square'), 50);
    setTimeout(() => playSound(1200, 0.1, 'square'), 100);
}

function playMoveSound() {
    playSound(200, 0.05, 'sine');
}

function playGameOverSound() {
    playSound(200, 0.2, 'sawtooth');
    setTimeout(() => playSound(150, 0.2, 'sawtooth'), 200);
    setTimeout(() => playSound(100, 0.3, 'sawtooth'), 400);
}

function playStartSound() {
    playSound(400, 0.1, 'triangle');
    setTimeout(() => playSound(600, 0.1, 'triangle'), 100);
    setTimeout(() => playSound(800, 0.1, 'triangle'), 200);
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = isMobile ? 20 : 40;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

function drawGame() {
    clearCanvas();
    if (!gamePaused) {
        moveSnake();
    }
    drawSnake();
    drawFood();
    checkCollision();
    updateScore();
    updateFoodGlow();
    drawGrid3D();
    drawCurrentWord();
    updateStats();
    time += 0.016;
    
    // Optimize for mobile by reducing particle count
    if (isMobile && particles.length > 20) {
        particles.splice(20, particles.length - 20);
    }
}

function clearCanvas() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.7, '#0f3460');
    gradient.addColorStop(1, '#0a1929');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGrid3D() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    
    // Draw grid with depth perspective
    for (let i = 0; i <= tileCount; i++) {
        const alpha = 0.03 + (i / tileCount) * 0.02;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw depth lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const x = segment.x * gridSize;
        const y = segment.y * gridSize;
        const z = segment.z;
        
        if (index === 0) {
            drawSnakeHead3D(x, y, z);
        } else {
            drawSnakeBody3D(x, y, z, index);
        }
    });
}

function drawSnakeHead3D(x, y, z) {
    const time = Date.now() * 0.01;
    const glowIntensity = Math.sin(time) * 0.3 + 0.7;
    const depth = Math.sin(time * 2) * 2;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + z * 0.01, 1 + z * 0.01);
    
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15 * glowIntensity;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, '#00ff88');
    gradient.addColorStop(0.6, '#00cc66');
    gradient.addColorStop(0.8, '#00994d');
    gradient.addColorStop(1, '#006633');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    // 3D eyes with depth
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-gridSize/2 + 4, -gridSize/2 + 4, 2, 2);
    ctx.fillRect(-gridSize/2 + 9, -gridSize/2 + 4, 2, 2);
    ctx.shadowBlur = 0;
    
    // Pupils with 3D effect
    ctx.fillStyle = '#000000';
    ctx.fillRect(-gridSize/2 + 4.5, -gridSize/2 + 4.5, 1, 1);
    ctx.fillRect(-gridSize/2 + 9.5, -gridSize/2 + 4.5, 1, 1);
    
    ctx.restore();
}

function drawSnakeBody3D(x, y, z, index) {
    const intensity = Math.max(0.3, 1 - index * 0.06);
    const green = Math.floor(255 * intensity);
    const blue = Math.floor(136 * intensity);
    
    const time = Date.now() * 0.005;
    const pulse = Math.sin(time + index * 0.5) * 0.1 + 0.9;
    const depth = Math.sin(time + index * 0.3) * 1;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + depth * 0.005, 1 + depth * 0.005);
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, `rgba(0, ${green}, ${blue}, ${pulse})`);
    gradient.addColorStop(0.7, `rgba(0, ${Math.floor(green * 0.7)}, ${Math.floor(blue * 0.7)}, ${pulse * 0.8})`);
    gradient.addColorStop(1, `rgba(0, ${Math.floor(green * 0.4)}, ${Math.floor(blue * 0.4)}, ${pulse * 0.6})`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.strokeStyle = `rgba(0, ${green}, ${blue}, 0.8)`;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-gridSize/2 + 1, -gridSize/2 + 1, gridSize - 2, gridSize - 2);
    
    ctx.restore();
}

function drawFood() {
    const x = food.x * gridSize;
    const y = food.y * gridSize;
    const z = food.z;
    
    const glowIntensity = Math.sin(foodGlow) * 0.4 + 0.6;
    const pulse = Math.sin(foodGlow * 2) * 0.2 + 0.8;
    const depth = Math.sin(foodGlow * 3) * 3;
    
    ctx.save();
    ctx.translate(x + gridSize/2, y + gridSize/2);
    ctx.scale(1 + depth * 0.01, 1 + depth * 0.01);
    
    ctx.shadowColor = '#ff4757';
    ctx.shadowBlur = 25 * glowIntensity;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, gridSize/2);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(0.4, '#ff4757');
    gradient.addColorStop(0.7, '#ff3838');
    gradient.addColorStop(1, '#ff1a1a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(-gridSize/2 + 2, -gridSize/2 + 2, gridSize - 4, gridSize - 4);
    
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-gridSize/2 + 2, -gridSize/2 + 2, gridSize - 4, gridSize - 4);
    
    // 3D animated eyes
    const eyeGlow = Math.sin(foodGlow * 3) * 0.5 + 0.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 3 * eyeGlow;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-gridSize/2 + 4, -gridSize/2 + 4, 2, 2);
    ctx.fillRect(-gridSize/2 + 9, -gridSize/2 + 4, 2, 2);
    ctx.shadowBlur = 0;
    
    // Draw the English word this food represents
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Rajdhani';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 2;
    ctx.fillText(currentTranslation, 0, gridSize/2 + 15);
    ctx.shadowBlur = 0;
    
    ctx.restore();
}

function updateFoodGlow() {
    foodGlow += 0.15;
}

function moveSnake() {
    if (dx === 0 && dy === 0) return;
    
    const head = {x: snake[0].x + dx, y: snake[0].y + dy, z: snake[0].z};
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        // Player found the food - always correct in this system
        score += 20;
        streak++;
        correctAnswers++;
        playEatSound();
        createEatEffect3D(head.x * gridSize, head.y * gridSize, head.z);
        gameSpeed = Math.max(50, gameSpeed - 3);
        
        generateFood();
    } else {
        snake.pop();
        playMoveSound();
    }
}

function createEatEffect3D(x, y, z) {
    const particleCount = isMobile ? 8 : 15;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x + gridSize/2,
            y: y + gridSize/2,
            z: z,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            vz: (Math.random() - 0.5) * 5,
            life: 1,
            color: `hsl(${Math.random() * 60 + 330}, 100%, 60%)`,
            size: Math.random() * 5 + 3
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;
        particle.life -= 0.015;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.vz *= 0.98;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 8;
        
        const scale = 1 + particle.z * 0.01;
        ctx.translate(particle.x, particle.y);
        ctx.scale(scale, scale);
        
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function generateNewWord() {
    const languageWords = languagePairs.filter(pair => pair.language === currentLanguage);
    if (languageWords.length === 0) return;
    
    const randomPair = languageWords[Math.floor(Math.random() * languageWords.length)];
    
    // Always show the foreign language word at the top
    currentWord = randomPair.translation; // Foreign word (e.g., "hola")
    currentTranslation = randomPair.word; // English word (e.g., "hello")
    currentUkrainian = randomPair.ukrainian; // Ukrainian translation (e.g., "привіт")
    wordDisplay = currentWord; // Display foreign word at top
    isShowingWord = true;
    
    wordTimer = 0;
    totalQuestions++;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        z: Math.random() * 10 - 5
    };
    
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            z: Math.random() * 10 - 5
        };
    }
    
    // Generate a new word when food is placed
    generateNewWord();
}

function checkCollision() {
    const head = snake[0];
    
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    gameRunning = false;
    playGameOverSound();
    
    const overlay = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    overlay.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    overlay.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 40px Orbitron';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15;
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
    
    ctx.font = '16px Orbitron';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 40);
}

function updateScore() {
    scoreElement.textContent = score;
}

function drawCurrentWord() {
    if (!wordDisplay) return;
    
    ctx.save();
    
    // Draw current language
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(currentLanguage, canvas.width / 2, 30);
    
    // Draw the foreign word
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Orbitron';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
    ctx.fillText(wordDisplay, canvas.width / 2, 65);
    
    // Draw the target English word
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 20px Orbitron';
    ctx.fillText(currentTranslation, canvas.width / 2, 95);
    
    // Draw the Ukrainian translation
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 18px Rajdhani';
    ctx.fillText(currentUkrainian, canvas.width / 2, 120);
    
    ctx.restore();
}

function updateStats() {
    const speedMultiplier = Math.max(1, (150 - gameSpeed) / 10 + 1);
    speedStat.textContent = speedMultiplier.toFixed(1) + 'x';
    lengthStat.textContent = snake.length;
    
    // Update language learning stats
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    document.getElementById('accuracyStat').textContent = accuracy + '%';
    document.getElementById('streakStat').textContent = streak;
    
    // Update word count for current language
    const wordCount = languagePairs.filter(pair => pair.language === currentLanguage).length;
    document.getElementById('wordCountStat').textContent = wordCount;
}

function resetGame() {
    snake = [{x: 12, y: 12, z: 0}];
    food = {x: 18, y: 18, z: 0};
    dx = 0;
    dy = 0;
    score = 0;
    gameSpeed = 150;
    gameRunning = true;
    gamePaused = false;
    particles = [];
    time = 0;
    streak = 0;
    correctAnswers = 0;
    totalQuestions = 0;
    currentWord = "";
    currentTranslation = "";
    currentUkrainian = "";
    wordDisplay = "";
    isShowingWord = true;
    wordTimer = 0;
    playStartSound();
    updatePauseButton();
    generateNewWord();
    
    // Update mobile pause button
    if (isMobile) {
        mobilePauseBtn.textContent = '⏸️';
        overlayPauseBtn.textContent = '⏸️';
    }
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    updatePauseButton();
}

function updatePauseButton() {
    if (gamePaused) {
        pauseBtn.textContent = '▶️ RESUME';
        pauseBtn.classList.add('active');
        if (isMobile) {
            mobilePauseBtn.textContent = '▶️';
            overlayPauseBtn.textContent = '▶️';
        }
    } else {
        pauseBtn.textContent = '⏸️ PAUSE';
        pauseBtn.classList.remove('active');
        if (isMobile) {
            mobilePauseBtn.textContent = '⏸️';
            overlayPauseBtn.textContent = '⏸️';
        }
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active', soundEnabled);
    soundToggle.querySelector('.sound-icon').textContent = soundEnabled ? '🔊' : '🔇';
}

function gameLoop() {
    if (gameRunning) {
        drawGame();
        updateParticles();
        drawParticles();
        setTimeout(gameLoop, gameSpeed);
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (!gameRunning) {
        if (event.code === 'Space') {
            resetGame();
            gameLoop();
        }
        return;
    }
    
    if (event.code === 'Space') {
        togglePause();
        return;
    }
    
    if (gamePaused) return;
    
    switch (event.code) {
        case 'ArrowUp':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

// Mobile touch controls
function handleMobileDirection(direction) {
    if (!gameRunning || gamePaused) return;
    
    switch (direction) {
        case 'up':
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;
        case 'down':
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'left':
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'right':
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
}

// Mobile button event listeners
upBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('up');
});

downBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('down');
});

leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('left');
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('right');
});

mobilePauseBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    togglePause();
});

mobileRestartBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    resetGame();
    gameLoop();
});

// Game overlay controls event listeners
overlayPauseBtn.addEventListener('click', togglePause);
overlayRestartBtn.addEventListener('click', () => {
    resetGame();
    gameLoop();
});

overlayPauseBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    togglePause();
});

overlayRestartBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    resetGame();
    gameLoop();
});

// Finger control event listeners
fingerUp.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('up');
});

fingerDown.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('down');
});

fingerLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('left');
});

fingerRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleMobileDirection('right');
});

// Desktop button event listeners
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);
soundToggle.addEventListener('click', toggleSound);

// Language switching
document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all language buttons
        document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Update current language
        currentLanguage = btn.dataset.language;
        // Generate new word in selected language
        generateNewWord();
    });
});

// Initialize
initAudio();
createParticles();
resetGame();
gameLoop();

// Show mobile controls on mobile devices
if (isMobile) {
    mobileControls.classList.add('show');
    gameControlsOverlay.classList.add('show');
    fingerControls.classList.add('show');
    
    // Start with subtle controls to avoid blocking text
    fingerControls.classList.add('subtle');
    
    // Add swipe gesture support
    canvas.addEventListener('touchstart', handleTouchStart, false);
    canvas.addEventListener('touchend', handleTouchEnd, false);
    
    // Update instructions for mobile
    const instructions = document.querySelector('.instructions');
    if (instructions) {
        instructions.innerHTML = `
            Use finger controls around game, swipe, or buttons below<br>
            <strong>🎯 How to Learn:</strong><br>
            1. See the foreign word at the top<br>
            2. Find the food with the English translation<br>
            3. Eat it to learn the word!<br>
            Tap pause/restart buttons on game or below<br>
            <span class="key">🇪🇸🇩🇪🇺🇦</span> Choose your learning language
        `;
    }
}

// Swipe gesture functions
function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
    event.preventDefault();
    const touch = event.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;
    handleSwipe();
}

function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const minSwipeDistance = 30;
    
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                handleMobileDirection('left');
            } else {
                handleMobileDirection('right');
            }
        }
    } else {
        if (Math.abs(diffY) > minSwipeDistance) {
            if (diffY > 0) {
                handleMobileDirection('up');
            } else {
                handleMobileDirection('down');
            }
        }
    }
}
