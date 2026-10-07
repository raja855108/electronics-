/**
 * High-fidelity electronics SVG vector imagery and fallback generator
 * Generates crisp, premium visual assets for each product category & colorway.
 */

export function getProductGraphicSvg(category: string, colorCode: string = '#2563eb', colorName: string = 'Electric Blue', productName: string = ''): string {
  // Normalize color
  const primary = colorCode || '#2563eb';
  const isLight = colorName.toLowerCase().includes('white') || colorName.toLowerCase().includes('silver') || primary.toLowerCase() === '#f8fafc' || primary.toLowerCase() === '#ffffff';
  const isBlack = colorName.toLowerCase().includes('black') || colorName.toLowerCase().includes('obsidian') || colorName.toLowerCase().includes('stealth');
  
  const bodyFill = isLight ? '#e2e8f0' : isBlack ? '#0f141f' : '#182132';
  const highlightStroke = isLight ? '#cbd5e1' : '#334155';
  const accentGlow = primary;

  const catLower = category.toLowerCase();

  if (catLower.includes('audio') || productName.toLowerCase().includes('headphone') || productName.toLowerCase().includes('ear')) {
    // Premium Over-Ear Headphones Graphic
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%" class="select-none">
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accentGlow}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${isLight ? '#cbd5e1' : '#1e293b'}" />
            <stop offset="50%" stop-color="${bodyFill}" />
            <stop offset="100%" stop-color="${isLight ? '#94a3b8' : '#0f172a'}" />
          </linearGradient>
          <linearGradient id="earcupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="${isLight || isBlack ? '0.2' : '0.9'}" />
            <stop offset="100%" stop-color="${bodyFill}" />
          </linearGradient>
        </defs>
        <!-- Background Ambient Glow -->
        <circle cx="200" cy="200" r="170" fill="url(#halo)" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="${primary}" stroke-opacity="0.15" stroke-dasharray="4 6" />
        
        <!-- Headband Arc -->
        <path d="M 110 210 C 110 90, 290 90, 290 210" fill="none" stroke="url(#headbandGrad)" stroke-width="26" stroke-linecap="round" />
        <path d="M 125 180 C 125 110, 275 110, 275 180" fill="none" stroke="${highlightStroke}" stroke-width="4" stroke-linecap="round" opacity="0.6" />
        <path d="M 155 105 C 175 100, 225 100, 245 105" fill="none" stroke="${primary}" stroke-width="3" stroke-linecap="round" opacity="0.8" />
        
        <!-- Left Headphone Assembly -->
        <g transform="translate(0, 0)">
          <!-- Slider Hinge -->
          <rect x="94" y="190" width="16" height="34" rx="4" fill="${isLight ? '#94a3b8' : '#334155'}" />
          <line x1="102" y1="195" x2="102" y2="215" stroke="${primary}" stroke-width="2" />
          <!-- Earcup Outer -->
          <ellipse cx="102" cy="250" rx="40" ry="58" fill="url(#earcupGrad)" stroke="${highlightStroke}" stroke-width="2" />
          <!-- Earcup Inner Core -->
          <ellipse cx="102" cy="250" rx="26" ry="40" fill="${bodyFill}" stroke="${primary}" stroke-width="1.5" />
          <!-- Status Ring LED -->
          <circle cx="102" cy="250" r="10" fill="none" stroke="${primary}" stroke-width="2" />
          <circle cx="102" cy="250" r="4" fill="${primary}" />
        </g>
        
        <!-- Right Headphone Assembly -->
        <g transform="translate(0, 0)">
          <!-- Slider Hinge -->
          <rect x="290" y="190" width="16" height="34" rx="4" fill="${isLight ? '#94a3b8' : '#334155'}" />
          <line x1="298" y1="195" x2="298" y2="215" stroke="${primary}" stroke-width="2" />
          <!-- Earcup Outer -->
          <ellipse cx="298" cy="250" rx="40" ry="58" fill="url(#earcupGrad)" stroke="${highlightStroke}" stroke-width="2" />
          <!-- Earcup Inner Core -->
          <ellipse cx="298" cy="250" rx="26" ry="40" fill="${bodyFill}" stroke="${primary}" stroke-width="1.5" />
          <!-- Status Ring LED -->
          <circle cx="298" cy="250" r="10" fill="none" stroke="${primary}" stroke-width="2" />
          <circle cx="298" cy="250" r="4" fill="${primary}" />
        </g>
        
        <!-- Acoustic Waveform Accent -->
        <path d="M 160 320 Q 200 305 240 320" fill="none" stroke="${primary}" stroke-width="2" opacity="0.4" />
        <text x="200" y="348" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace" letter-spacing="2">BIN·AUDIO Hi-Res</text>
      </svg>
    `;
  }

  if (catLower.includes('phone') || productName.toLowerCase().includes('phone')) {
    // Flagship Smartphone Graphic
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="phoneGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="60%" stop-color="#1e1b4b" />
            <stop offset="100%" stop-color="${primary}" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="170" fill="url(#phoneGlow)" />
        
        <!-- Phone Chassis -->
        <rect x="125" y="55" width="150" height="290" rx="32" fill="${bodyFill}" stroke="${primary}" stroke-width="2" />
        <!-- Screen Bezel -->
        <rect x="131" y="61" width="138" height="278" rx="26" fill="url(#screenGrad)" />
        <!-- Dynamic Island / Punch Hole -->
        <rect x="180" y="72" width="40" height="10" rx="5" fill="#030712" stroke="#1f2937" stroke-width="1" />
        <!-- Screen Wallpaper Waves -->
        <path d="M 131 220 Q 170 180 200 240 T 269 220 L 269 339 L 131 339 Z" fill="${primary}" opacity="0.3" />
        <path d="M 131 260 Q 180 230 220 280 T 269 270 L 269 339 L 131 339 Z" fill="#8b5cf6" opacity="0.25" />
        
        <!-- Subtle Screen Details -->
        <circle cx="160" cy="120" r="14" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7" />
        <text x="200" y="165" text-anchor="middle" fill="#ffffff" font-size="28" font-family="'Outfit', sans-serif" font-weight="700">09:41</text>
        <text x="200" y="185" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="'Plus Jakarta Sans', sans-serif">120Hz LTPO OLED</text>
        
        <!-- Side Buttons -->
        <rect x="121" y="110" width="4" height="24" rx="2" fill="${primary}" />
        <rect x="121" y="145" width="4" height="36" rx="2" fill="${primary}" />
        <rect x="275" y="125" width="4" height="42" rx="2" fill="${primary}" />
        
        <text x="200" y="375" text-anchor="middle" fill="#64748b" font-size="11" font-family="'JetBrains Mono', monospace">BIN TITANIUM PRO</text>
      </svg>
    `;
  }

  if (catLower.includes('laptop') || productName.toLowerCase().includes('laptop') || productName.toLowerCase().includes('notebook')) {
    // Premium Cyber Laptop Graphic
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="laptopGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0f172a" />
            <stop offset="100%" stop-color="${bodyFill}" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#laptopGlow)" />
        
        <!-- Display Lid -->
        <rect x="80" y="90" width="240" height="155" rx="10" fill="#090d16" stroke="${primary}" stroke-width="1.5" />
        <!-- Screen Content -->
        <rect x="88" y="98" width="224" height="139" rx="6" fill="#020617" />
        <!-- Tech IDE / Matrix visual on screen -->
        <rect x="100" y="110" width="90" height="6" rx="3" fill="${primary}" opacity="0.8" />
        <rect x="100" y="122" width="140" height="5" rx="2" fill="#38bdf8" opacity="0.6" />
        <rect x="100" y="132" width="110" height="5" rx="2" fill="#818cf8" opacity="0.5" />
        <path d="M 100 155 Q 170 140 230 180 T 300 170" fill="none" stroke="${primary}" stroke-width="2" />
        <!-- Glowing Bin Logo on Display -->
        <polygon points="194,195 200,185 206,195 200,205" fill="${primary}" opacity="0.9" />
        
        <!-- Base / Keyboard Deck -->
        <polygon points="50,255 350,255 320,290 80,290" fill="${bodyFill}" stroke="${highlightStroke}" stroke-width="1.5" />
        <!-- Trackpad -->
        <rect x="165" y="263" width="70" height="22" rx="4" fill="#0f172a" stroke="${primary}" stroke-width="1" opacity="0.8" />
        <!-- Front Lip -->
        <rect x="75" y="288" width="250" height="6" rx="3" fill="${isLight ? '#cbd5e1' : '#1e293b'}" />
        
        <text x="200" y="345" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">APEX 16 PRO · M-SERIES</text>
      </svg>
    `;
  }

  if (catLower.includes('watch') || productName.toLowerCase().includes('watch')) {
    // Smart Watch Graphic
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="watchGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#watchGlow)" />
        
        <!-- Watch Strap Top & Bottom -->
        <rect x="160" y="40" width="80" height="90" rx="8" fill="${bodyFill}" stroke="${highlightStroke}" stroke-width="1.5" />
        <rect x="160" y="270" width="80" height="90" rx="8" fill="${bodyFill}" stroke="${highlightStroke}" stroke-width="1.5" />
        <!-- Strap Grooves -->
        <line x1="170" y1="70" x2="230" y2="70" stroke="${highlightStroke}" stroke-width="2" />
        <line x1="170" y1="90" x2="230" y2="90" stroke="${highlightStroke}" stroke-width="2" />
        <line x1="170" y1="310" x2="230" y2="310" stroke="${highlightStroke}" stroke-width="2" />
        <line x1="170" y1="330" x2="230" y2="330" stroke="${highlightStroke}" stroke-width="2" />
        
        <!-- Case -->
        <rect x="135" y="115" width="130" height="170" rx="42" fill="#0b0f19" stroke="${primary}" stroke-width="2.5" />
        <!-- Digital Crown -->
        <rect x="268" y="145" width="10" height="32" rx="4" fill="${isLight ? '#cbd5e1' : '#334155'}" stroke="${primary}" stroke-width="1" />
        
        <!-- OLED Screen -->
        <rect x="145" y="125" width="110" height="150" rx="32" fill="#030712" />
        <!-- Circular Fitness Rings -->
        <circle cx="200" cy="185" r="42" fill="none" stroke="#1e293b" stroke-width="6" />
        <circle cx="200" cy="185" r="42" fill="none" stroke="${primary}" stroke-width="6" stroke-dasharray="190" stroke-dashoffset="50" stroke-linecap="round" />
        <circle cx="200" cy="185" r="32" fill="none" stroke="#8b5cf6" stroke-width="5" stroke-dasharray="140" stroke-dashoffset="30" stroke-linecap="round" />
        
        <text x="200" y="180" text-anchor="middle" fill="#ffffff" font-size="16" font-family="'Outfit', sans-serif" font-weight="700">10:42</text>
        <text x="200" y="200" text-anchor="middle" fill="${primary}" font-size="10" font-family="'JetBrains Mono', monospace">78 BPM</text>
        <text x="200" y="250" text-anchor="middle" fill="#94a3b8" font-size="10" font-family="'Plus Jakarta Sans', sans-serif">SAPPHIRE GLASS</text>
      </svg>
    `;
  }

  if (catLower.includes('camera') || productName.toLowerCase().includes('cam')) {
    // 4K Cinema / Action Camera Graphic
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <defs>
          <radialGradient id="camGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${primary}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="160" fill="url(#camGlow)" />
        
        <!-- Camera Body -->
        <rect x="80" y="120" width="240" height="160" rx="20" fill="${bodyFill}" stroke="${highlightStroke}" stroke-width="2" />
        <!-- Grip -->
        <rect x="80" y="120" width="50" height="160" rx="16" fill="#0b0f19" stroke="${primary}" stroke-width="1" />
        <!-- Top Flash / Sensor Hump -->
        <path d="M 150 120 L 170 95 L 230 95 L 250 120 Z" fill="${bodyFill}" stroke="${highlightStroke}" stroke-width="1.5" />
        
        <!-- Lens Mount & Barrel -->
        <circle cx="215" cy="200" r="64" fill="#080c14" stroke="${highlightStroke}" stroke-width="3" />
        <circle cx="215" cy="200" r="50" fill="#020617" stroke="${primary}" stroke-width="2" />
        <!-- Glass Optics Reflections -->
        <circle cx="215" cy="200" r="38" fill="none" stroke="${primary}" stroke-width="3" opacity="0.7" />
        <circle cx="215" cy="200" r="22" fill="#0f172a" />
        <path d="M 195 180 Q 215 170 235 185" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" opacity="0.8" />
        
        <!-- Shutter Button -->
        <circle cx="105" cy="108" r="8" fill="${primary}" />
        <!-- Red Record Light -->
        <circle cx="280" cy="145" r="5" fill="#ef4444" />
        
        <text x="200" y="325" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">CYBERVISION 4K 120FPS</text>
      </svg>
    `;
  }

  // Generic Premium Tech Device / Gaming / Tablet / Accessory
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <defs>
        <radialGradient id="genGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primary}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#080a0f" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="160" fill="url(#genGlow)" />
      
      <!-- Tech Hexagonal / Rounded Hardware Frame -->
      <polygon points="200,80 310,140 310,260 200,320 90,260 90,140" fill="${bodyFill}" stroke="${primary}" stroke-width="2" />
      <polygon points="200,105 285,152 285,248 200,295 115,248 115,152" fill="#090d16" stroke="${highlightStroke}" stroke-width="1.5" />
      
      <!-- Center Emblem / Chip -->
      <circle cx="200" cy="200" r="45" fill="#020617" stroke="${primary}" stroke-width="2" />
      <polygon points="190,185 210,185 220,200 210,215 190,215 180,200" fill="none" stroke="${primary}" stroke-width="2" />
      <circle cx="200" cy="200" r="6" fill="${primary}" />
      
      <!-- Data Traces -->
      <line x1="200" y1="110" x2="200" y2="155" stroke="${primary}" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="200" y1="245" x2="200" y2="290" stroke="${primary}" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="125" y1="200" x2="155" y2="200" stroke="${primary}" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="245" y1="200" x2="275" y2="200" stroke="${primary}" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <text x="200" y="350" text-anchor="middle" fill="#94a3b8" font-size="11" font-family="'JetBrains Mono', monospace">BIN NEXT-GEN TECH</text>
    </svg>
  `;
}

export function getProductDataUri(category: string, colorCode: string = '#2563eb', colorName: string = 'Electric Blue', productName: string = ''): string {
  const svg = getProductGraphicSvg(category, colorCode, colorName, productName);
  const cleanSvg = svg.replace(/\s+/g, ' ').trim();
  return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
}
