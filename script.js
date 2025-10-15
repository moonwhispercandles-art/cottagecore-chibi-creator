// --- CONFIGURATION ---
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 600;

// IMPORTANT: The placeholder URL below is used for all asset categories because
// we cannot load local files in a public sandbox environment (like JSFiddle).
//
// <<< ACTION REQUIRED: Replace the GENERIC_PLACEHOLDER_URL with a publicly-hosted URL
// of one of your chibi images (e.g., your eyes PNG) so the buttons have something to display. >>>
const GENERIC_PLACEHOLDER_URL = '[https://placehold.co/500x600/d8d2b2/000?text=Asset+Image](https://placehold.co/500x600/d8d2b2/000?text=Asset+Image)';
const BUTTON_PREVIEW_URL = '[https://placehold.co/64x64/a8b98b/fff?text=P](https://placehold.co/64x64/a8b98b/fff?text=P)'; // Used for button images

const ASSET_MAP = {
    // LAYER 1: BACKGROUNDS
    // <<< PASTE YOUR BACKGROUND IMAGE URLs HERE >>>
    backgrounds: [
        { name: 'Forest Glade', url: '[https://placehold.co/500x600/c9d6c4/000?text=Forest+Glade+URL](https://placehold.co/500x600/c9d6c4/000?text=Forest+Glade+URL)' },
        { name: 'Cabin Interior', url: '[https://placehold.co/500x600/776054/fff?text=Cabin+Interior+URL](https://placehold.co/500x600/776054/fff?text=Cabin+Interior+URL)' },
    ],
    // LAYER 2: BODY / SKIN TONES (Using colors for simplicity in sandbox)
    bodies: [
        { name: 'Pale', color: '#f7e5d8' }, // Lighter Caramel
        { name: 'Tan', color: '#cc9e7d' },
        { name: 'Olive', color: '#b8a594' },
    ],
    // LAYERS 3-6: OUTFITS, FACE, HAIR, ACCESSORIES (Using placeholder image URLs)
    outfits: [
        { name: 'None', url: null },
        // <<< REPLACE THE URLS BELOW WITH YOUR OUTFIT IMAGE LINKS >>>
        { name: 'Smock Dress', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Apron & Blouse', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Overalls/Shirt', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Voyaging Dress', url: GENERIC_PLACEHOLDER_URL }, // e.g., REPLACE with link to '🍃simplistic voyaging outfit🍃.jpg'
    ],
    face: {
        eyes: [
            // <<< REPLACE THE URL BELOW WITH YOUR EYES IMAGE LINK >>>
            { name: 'Eyes (Default)', url: GENERIC_PLACEHOLDER_URL }, // e.g., REPLACE with link to 'Eyes.png'
        ],
        eyebrows: [
            // <<< REPLACE THE URLS BELOW WITH YOUR EYEBROWS IMAGE LINKS >>>
            { name: 'Eyebrows (Neutral)', url: GENERIC_PLACEHOLDER_URL },
            { name: 'Eyebrows (Calm)', url: GENERIC_PLACEHOLDER_URL }, // e.g., REPLACE with link to 'Eyebrow.png'
        ],
        mouth: [
            // <<< REPLACE THE URLS BELOW WITH YOUR MOUTH/LIPS IMAGE LINKS >>>
            { name: 'Mouth (Simple)', url: GENERIC_PLACEHOLDER_URL },
            { name: 'Lips (Cute Small)', url: GENERIC_PLACEHOLDER_URL }, // e.g., REPLACE with link to 'Mouth.png'
        ],
        nose: [
            // <<< REPLACE THE URL BELOW WITH YOUR NOSE IMAGE LINK >>>
            { name: 'Nose (Simple)', url: GENERIC_PLACEHOLDER_URL },
            { name: 'Nose (None)', url: null },
        ],
        ears: [
            // <<< REPLACE THE URL BELOW WITH YOUR EARS IMAGE LINK >>>
            { name: 'Ears (Default)', url: GENERIC_PLACEHOLDER_URL }, // e.g., REPLACE with link to 'Ears.png'
        ]
    },
    hairs: [
        { name: 'None', url: null },
        // <<< REPLACE THE URLS BELOW WITH YOUR HAIR IMAGE LINKS >>>
        { name: 'Braided Crown', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Long & Flowy', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Short Pixie', url: GENERIC_PLACEHOLDER_URL },
    ],
    accessories: [
        { name: 'None', url: null },
        // <<< REPLACE THE URLS BELOW WITH YOUR ACCESSORY IMAGE LINKS >>>
        { name: 'Flower Crown', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Mushroom Hat', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Woven Basket', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Acorn Necklace', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Strawberry Earrings', url: GENERIC_PLACEHOLDER_URL },
        { name: 'Sling Bag', url: GENERIC_PLACEHOLDER_URL },
    ],
};

// State management
let characterConfig = {
    background: 0,
    body: 0,
    outfit: 0,
    hair: 0,
    accessory: 0,
    eyes: 0,
    eyebrows: 0,
    mouth: 0,
    nose: 0,
    ears: 0,
};

const IMAGES = {};
let imagesToLoad = 0;
let imagesLoaded = 0;

// --- DOM References ---
const canvas = document.getElementById('characterCanvas');
const ctx = canvas.getContext('2d');
const controlsContainer = document.getElementById('controlsContainer');
const loadingOverlay = document.getElementById('loading-overlay');

// --- IMAGE LOADING LOGIC ---
function collectAllImagePaths() {
    const paths = [];
    // Collect all unique URLs from ASSET_MAP
    ['backgrounds', 'outfits', 'hairs', 'accessories'].forEach(category => {
        ASSET_MAP[category].forEach(item => {
            if (item.url && item.url !== GENERIC_PLACEHOLDER_URL && !IMAGES[item.url]) paths.push(item);
        });
    });
    Object.keys(ASSET_MAP.face).forEach(category => {
        ASSET_MAP.face[category].forEach(item => {
            if (item.url && item.url !== GENERIC_PLACEHOLDER_URL && !IMAGES[item.url]) paths.push(item);
        });
    });

    // Manually add the generic placeholder if not already added, as it's used for drawing
    const genericItem = { name: 'Placeholder', url: GENERIC_PLACEHOLDER_URL };
    if (!IMAGES[GENERIC_PLACEHOLDER_URL]) paths.push(genericItem);
    
    return paths;
}

function loadImages(callback) {
    const allPaths = collectAllImagePaths();
    imagesToLoad = allPaths.length;

    if (imagesToLoad === 0) {
        if (callback) callback();
        return;
    }

    allPaths.forEach(item => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Required for some image hosts
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === imagesToLoad && callback) {
                callback();
            }
        };
        img.onerror = () => {
             console.error(`Failed to load: ${item.url}. Using simple placeholder.`);
             imagesLoaded++;
             if (imagesLoaded === imagesToLoad && callback) {
                 callback();
             }
        };
        img.src = item.url;
        IMAGES[item.url] = img; // Store image object
    });
}

// --- CANVAS DRAWING LOGIC ---
function drawBodyShape(color) {
    // Draws a very basic chibi body shape
    ctx.fillStyle = color;
    ctx.beginPath();
    // Head shape - simple circle
    ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.3, 100, 0, Math.PI * 2);
    // Body shape - simple rectangle
    ctx.rect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT * 0.4, 100, 150);
    ctx.fill();
}

function drawCharacter() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); 
    
    // 1. Draw Background
    const bgItem = ASSET_MAP.backgrounds[characterConfig.background];
    const bgImg = IMAGES[bgItem.url];
    if (bgImg && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Fallback to a solid color if image fails to load
        ctx.fillStyle = '#f0f4e8';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // 2. Draw Body (Skin Tone - using placeholder shape for sandbox compatibility)
    const bodyItem = ASSET_MAP.bodies[characterConfig.body];
    drawBodyShape(bodyItem.color);
    
    // Define the layer order (URL is the key to retrieve the Image object)
    const layers = [];

    // 3. Outfit
    layers.push(ASSET_MAP.outfits[characterConfig.outfit].url);

    // 4. Face Parts (order matters: ears/nose below eyes/mouth)
    layers.push(ASSET_MAP.face.ears[characterConfig.ears].url);
    layers.push(ASSET_MAP.face.nose[characterConfig.nose].url);
    layers.push(ASSET_MAP.face.eyes[characterConfig.eyes].url);
    layers.push(ASSET_MAP.face.eyebrows[characterConfig.eyebrows].url);
    layers.push(ASSET_MAP.face.mouth[characterConfig.mouth].url);
    
    // 5. Hair (Should layer on top of face parts)
    layers.push(ASSET_MAP.hairs[characterConfig.hair].url);
    
    // 6. Accessories (Should layer on top of everything)
    layers.push(ASSET_MAP.accessories[characterConfig.accessory].url);
    
    // Draw all layered items
    layers.forEach(url => {
        if (url) {
            const img = IMAGES[url];
            if (img && img.complete) {
                // Draw all layered assets at (0, 0)
                ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            } else if (url === GENERIC_PLACEHOLDER_URL) {
                // Draw the generic placeholder if it's the one we expect to fail loading
                const placeholderImg = IMAGES[GENERIC_PLACEHOLDER_URL];
                if (placeholderImg && placeholderImg.complete) {
                     ctx.drawImage(placeholderImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
            }
        }
    });
}

// --- UI HELPER FUNCTIONS ---
function updateSelectedClasses(categoryKey, selectedIndex) {
    const container = document.getElementById(`options-${categoryKey}`);
    if (!container) return;
    
    Array.from(container.children).forEach((child, index) => {
        child.classList.remove('selected-asset');
        if (index === selectedIndex) {
            child.classList.add('selected-asset');
        }
    });
}

function createOptionButton(item, categoryKey, index) {
    const button = document.createElement('button');
    button.textContent = item.name;
    button.className = 'p-2 md:p-3 bg-white border border-green-300 rounded-xl text-green-800 font-medium hover:bg-green-100 transition-all text-sm whitespace-nowrap active:scale-95';

    if (index === characterConfig[categoryKey]) {
        button.classList.add('selected-asset');
    }
    
    // Use color for skin tone preview
    if (categoryKey === 'body' && item.color) {
        button.style.backgroundColor = item.color;
        button.classList.add('w-16', 'h-16', 'border-4');
        button.textContent = item.name.split(' ')[0]; // Use first word for brevity
    } 
    // Use image preview for buttons
    else if (item.url) {
        button.classList.add('asset-button-preview'); 
        // Use the item's actual URL for the background if available, otherwise use the placeholder
        const previewUrl = (item.url !== GENERIC_PLACEHOLDER_URL) ? item.url : BUTTON_PREVIEW_URL;
        button.style.backgroundImage = `url(${previewUrl})`; 
        button.textContent = ''; // Clear text content for image preview
    }

    button.addEventListener('click', () => {
        characterConfig[categoryKey] = index;
        drawCharacter();
        updateSelectedClasses(categoryKey, index);
    });
    return button;
}

function createControlSection(categoryName, categoryKey, items) {
    const section = document.createElement('div');
    section.className = 'border-b border-green-200 pb-4';
    
    section.innerHTML = `
        <h3 class="text-lg font-semibold text-green-700 mb-2 font-sans-inter">${categoryName}</h3>
        <div id="options-${categoryKey}" class="flex gap-3 overflow-x-auto asset-scroll p-1">
            <!-- Buttons go here -->
        </div>
    `;
    
    const optionsContainer = section.querySelector(`#options-${categoryKey}`);
    items.forEach((item, index) => {
        const button = createOptionButton(item, categoryKey, index);
        optionsContainer.appendChild(button);
    });
    
    controlsContainer.appendChild(section);
}

// --- INITIALIZATION ---
function initUI() {
    // Background
    createControlSection('Background', 'background', ASSET_MAP.backgrounds);
    // Body / Skin Tone
    createControlSection('Body / Skin Tone', 'body', ASSET_MAP.bodies);
    // Outfit
    createControlSection('Outfit', 'outfit', ASSET_MAP.outfits);
    // Hair
    createControlSection('Hair', 'hair', ASSET_MAP.hairs);
    // Accessories
    createControlSection('Accessories', 'accessory', ASSET_MAP.accessories);
    
    // Face Parts (Grouped)
    const faceContainer = document.createElement('div');
    faceContainer.className = 'border-b border-green-200 pb-4 space-y-4';
    faceContainer.innerHTML = '<h3 class="text-lg font-semibold text-green-700 mb-2 font-sans-inter">Facial Features</h3>';
    controlsContainer.appendChild(faceContainer);

    // Dynamic creation for sub-categories
    Object.keys(ASSET_MAP.face).forEach(key => {
        const faceSection = document.createElement('div');
        const title = key.charAt(0).toUpperCase() + key.slice(1);
        faceSection.innerHTML = `
            <h4 class="text-sm font-medium text-green-600 mb-1 font-sans-inter">${title}</h4>
            <div id="options-${key}" class="flex gap-3 overflow-x-auto asset-scroll p-1"></div>
        `;
        const optionsContainer = faceSection.querySelector(`#options-${key}`);
        ASSET_MAP.face[key].forEach((item, index) => {
            const button = createOptionButton(item, key, index);
            optionsContainer.appendChild(button);
        });
        faceContainer.appendChild(faceSection);
    });

    // Initial draw
    drawCharacter();

    // Hide loading overlay
    loadingOverlay.classList.add('hidden');
}

// Start the application flow
window.addEventListener('load', () => {
    loadImages(() => {
        initUI();
    });
});
