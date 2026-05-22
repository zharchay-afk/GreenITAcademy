import JSZip from 'jszip';

// Résout un chemin relatif (gère les ../ et ./)
function resolvePath(base, relative) {
  if (!relative) return null;
  if (/^(https?:|\/\/|blob:|data:|#|\?)/.test(relative)) return null;
  const baseDir = base.includes('/') ? base.substring(0, base.lastIndexOf('/') + 1) : '';
  const parts = (baseDir + relative).split('/');
  const resolved = [];
  for (const p of parts) {
    if (p === '..') resolved.pop();
    else if (p !== '.') resolved.push(p);
  }
  return resolved.join('/');
}

// Remplace les chemins relatifs (src, href, url()) par des blob URLs
function replaceAssets(content, blobMap, basePath) {
  return content
    .replace(/(src|href)=(["'])([^"'#?{}]+)\2/gi, (match, attr, q, p) => {
      const r = resolvePath(basePath, p);
      return r && blobMap[r] ? `${attr}=${q}${blobMap[r]}${q}` : match;
    })
    .replace(/url\((["']?)([^"')#?]+)\1\)/gi, (match, q, p) => {
      const r = resolvePath(basePath, p);
      return r && blobMap[r] ? `url(${q}${blobMap[r]}${q})` : match;
    });
}

// Script SCORM 1.2 injecté dans le HTML du SCO
// Il expose window.API et relaie les appels vers le parent via postMessage
const SCORM_API_SCRIPT = `<script>
(function(){
  window.API = {
    LMSInitialize: function(p){ window.parent.postMessage({type:'scorm',fn:'init'},'*'); return "true"; },
    LMSFinish:     function(p){ window.parent.postMessage({type:'scorm',fn:'finish'},'*'); return "true"; },
    LMSGetValue:   function(e){ return ""; },
    LMSSetValue:   function(e,v){ window.parent.postMessage({type:'scorm',fn:'set',e:e,v:String(v)},'*'); return "true"; },
    LMSCommit:     function(p){ window.parent.postMessage({type:'scorm',fn:'commit'},'*'); return "true"; },
    LMSGetLastError:   function(){ return "0"; },
    LMSGetErrorString: function(c){ return ""; },
    LMSGetDiagnostic:  function(c){ return ""; }
  };
})();
<\/script>`;

export async function loadScormPackage(file) {
  const zip = await JSZip.loadAsync(file);

  // 1. Lire et parser le manifeste
  const manifestFile = zip.file('imsmanifest.xml');
  if (!manifestFile) throw new Error('imsmanifest.xml introuvable — ce fichier n\'est pas un package SCORM valide.');
  const manifestXml = await manifestFile.async('string');

  const doc = new DOMParser().parseFromString(manifestXml, 'application/xml');
  const title = doc.querySelector('organization > title')?.textContent || 'Package SCORM';
  const masteryscore = parseInt(doc.querySelector('masteryscore')?.textContent || '70');

  // 2. Trouver le point d'entrée (SCO)
  let entryHref = 'index.html';
  for (const res of doc.querySelectorAll('resource')) {
    const stype = res.getAttribute('adlcp:scormtype') || '';
    if (stype.toLowerCase() === 'sco') {
      entryHref = (res.getAttribute('href') || 'index.html').split('?')[0];
      break;
    }
  }

  // 3. Extraire tous les fichiers du ZIP
  const TEXT_EXTS = ['.html', '.htm', '.css', '.js', '.xml', '.txt', '.svg'];
  const rawFiles = {};
  await Promise.all(Object.keys(zip.files).map(async (path) => {
    const f = zip.files[path];
    if (f.dir) return;
    const isText = TEXT_EXTS.some(ext => path.toLowerCase().endsWith(ext));
    rawFiles[path] = isText
      ? { type: 'text', content: await f.async('string') }
      : { type: 'binary', blob: await f.async('blob') };
  }));

  // 4. Créer les blob URLs pour les fichiers binaires
  const blobMap = {};
  for (const [path, f] of Object.entries(rawFiles)) {
    if (f.type === 'binary') {
      blobMap[path] = URL.createObjectURL(f.blob);
    }
  }

  // 5. Traiter les CSS (remplacer les chemins relatifs)
  for (const [path, f] of Object.entries(rawFiles)) {
    if (f.type === 'text' && path.endsWith('.css')) {
      const processed = replaceAssets(f.content, blobMap, path);
      blobMap[path] = URL.createObjectURL(new Blob([processed], { type: 'text/css' }));
    }
  }

  // 6. Traiter le HTML d'entrée
  const entryFile = rawFiles[entryHref];
  if (!entryFile || entryFile.type !== 'text') {
    throw new Error(`Fichier d'entrée "${entryHref}" introuvable dans le package.`);
  }

  let html = replaceAssets(entryFile.content, blobMap, entryHref);

  // Injecter l'API SCORM 1.2 au tout début du <head>
  if (html.includes('<head>')) html = html.replace('<head>', '<head>' + SCORM_API_SCRIPT);
  else if (html.includes('<head ')) html = html.replace(/<head[^>]*>/, m => m + SCORM_API_SCRIPT);
  else html = SCORM_API_SCRIPT + html;

  const entrySrc = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  return { title, masteryscore, entrySrc };
}
