// Script de migration unique : remplace les goFurther string par {text, url}
// Les items sans URL identifiée sont supprimés (cf. demande utilisateur).
// Exécution : node scripts/add-gofurther-links.mjs
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('data/modules.json');
const raw = fs.readFileSync(file, 'utf-8').replace(/^﻿/, ''); // strip BOM si présent
const json = JSON.parse(raw);

// Mapping ID de section → liste d'items avec URL (seuls les items avec URL sont gardés)
const M = {
  // Module 1
  '1.1': [
    { text: 'ARCEP — L\'empreinte environnementale du numérique',                      url: 'https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/lempreinte-environnementale-du-numerique.html' },
    { text: 'The Shift Project — Lean ICT : pour une sobriété numérique (2018)',       url: 'https://theshiftproject.org/article/pour-une-sobriete-numerique-rapport-shift/' },
    { text: 'Global E-waste Monitor 2024 (UNITAR / ITU)',                              url: 'https://ewastemonitor.info/' },
  ],
  '1.2': [
    { text: 'Conseil d\'État — Étude annuelle 2013 : Le droit souple',                 url: 'https://www.conseil-etat.fr/publications-colloques/etudes/le-droit-souple-etude-annuelle-2013' },
  ],
  '1.3': [
    { text: 'Article 288 du TFUE (EUR-Lex)',                                            url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:12012E288' },
    { text: 'CJUE — Costa c/ ENEL (1964), principe de primauté',                       url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:61964CJ0006' },
    { text: 'CJUE — Van Duyn (1974), effet direct des directives',                     url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:61974CJ0041' },
  ],
  '1.4': [
    { text: 'Portail Qualité — ILNAS (Luxembourg)',                                     url: 'https://portail-qualite.public.lu/' },
    { text: 'INDR — Institut National pour le Développement durable et la RSE',         url: 'https://www.indr.lu/' },
    { text: 'Luxinnovation',                                                            url: 'https://www.luxinnovation.lu/' },
  ],
  // Module 2
  '2.1': [
    { text: 'Commission européenne — The European Green Deal (COM/2019/640)',           url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=COM%3A2019%3A640%3AFIN' },
    { text: 'Règlement (UE) 2021/1119 — Loi européenne sur le climat',                  url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32021R1119' },
    { text: 'Digital Compass 2030 (COM/2021/118)',                                      url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:52021DC0118' },
  ],
  '2.2': [
    { text: 'Directive (UE) 2022/2464 — CSRD',                                          url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022L2464' },
    { text: 'EFRAG — European Sustainability Reporting Standards',                      url: 'https://www.efrag.org/Activities/2105191406363055/Sustainability-reporting-standards-interim-draft' },
  ],
  '2.3': [
    { text: 'Règlement (UE) 2020/852 — Taxonomie',                                      url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32020R0852' },
    { text: 'Directive (UE) 2023/1791 — EED refonte',                                   url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023L1791' },
    { text: 'Acte délégué Taxonomie « Climate » — Règlement (UE) 2021/2139',            url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32021R2139' },
  ],
  '2.4': [
    { text: 'CSSF — Finance durable (circulaires et FAQ)',                              url: 'https://www.cssf.lu/en/sustainable-finance/' },
    { text: 'Règlement (UE) 2019/2088 — SFDR',                                          url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32019R2088' },
    { text: 'Règlement (UE) 2022/2554 — DORA',                                          url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32022R2554' },
  ],
  '2.5': [
    { text: 'Gouvernement luxembourgeois — Plan national énergie-climat',               url: 'https://environnement.public.lu/fr/klima-an-energie/pnec.html' },
    { text: 'Klima-Pakt fir Betriber',                                                  url: 'https://www.klima-pakt.lu/' },
  ],
  // Module 3
  '3.1': [
    { text: 'ISO/IEC 17021-1 — Exigences pour les organismes de certification',         url: 'https://www.iso.org/standard/61651.html' },
    { text: 'OLAS — Office Luxembourgeois d\'Accréditation et de Surveillance',         url: 'https://portail-qualite.public.lu/fr/acteurs/acteurs-systeme-luxembourgeois-qualite/olas.html' },
    { text: 'European Accreditation',                                                   url: 'https://european-accreditation.org/' },
  ],
  '3.2': [
    { text: 'ISO 14001:2015 — Systèmes de management environnemental',                   url: 'https://www.iso.org/standard/60857.html' },
    { text: 'ISO Survey — diffusion des certifications',                                 url: 'https://www.iso.org/the-iso-survey.html' },
  ],
  '3.3': [
    { text: 'ISO 14040:2006 — Analyse du cycle de vie (principes)',                     url: 'https://www.iso.org/standard/37456.html' },
    { text: 'Negaoctet — base ADEME impacts numériques',                                 url: 'https://negaoctet.org/' },
    { text: 'Boavizta — outils ACV numériques open source',                              url: 'https://boavizta.org/' },
  ],
  '3.4': [
    { text: 'ISO 50001:2018 — Systèmes de management de l\'énergie',                     url: 'https://www.iso.org/standard/69426.html' },
    { text: 'Directive EED 2023/1791',                                                   url: 'https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32023L1791' },
  ],
  '3.5': [
    { text: 'Uptime Institute — Global Data Center Survey',                              url: 'https://uptimeinstitute.com/resources/research-and-reports' },
    { text: 'JRC — EU Code of Conduct for Data Centre Energy Efficiency',                url: 'https://joint-research-centre.ec.europa.eu/scientific-activities-z/energy-efficiency/energy-efficiency-products/code-conduct-ict_en' },
  ],
  '3.6': [
    { text: 'ISO Survey of Management System Standard Certifications',                   url: 'https://www.iso.org/the-iso-survey.html' },
  ],
  // Module 4
  '4.1': [
    { text: 'ISO 14024:2018 — Étiquetage environnemental Type I',                        url: 'https://www.iso.org/standard/72458.html' },
    { text: 'Commission européenne — Initiative Green Claims',                           url: 'https://environment.ec.europa.eu/topics/circular-economy/green-claims_en' },
    { text: 'Ecolabel Index — panorama mondial des écolabels',                           url: 'https://www.ecolabelindex.com/' },
  ],
  '4.2': [
    { text: 'EPEAT — registre officiel des produits',                                    url: 'https://www.epeat.net/' },
    { text: 'IEEE 1680.1-2018 — critères pour ordinateurs et écrans',                    url: 'https://standards.ieee.org/ieee/1680.1/6094/' },
    { text: 'Executive Order 14057 — Federal Sustainability (US)',                       url: 'https://www.whitehouse.gov/briefing-room/presidential-actions/2021/12/08/executive-order-on-catalyzing-clean-energy-industries-and-jobs-through-federal-sustainability/' },
  ],
  '4.3': [
    { text: 'Energy Star — site officiel',                                               url: 'https://www.energystar.gov/' },
    { text: 'Energy Star for Enterprise Servers',                                        url: 'https://www.energystar.gov/products/data_center_equipment/enterprise_servers' },
  ],
  '4.4': [
    { text: 'Blue Angel — site officiel',                                                url: 'https://www.blauer-engel.de/en' },
    { text: 'RAL Gütezeichen',                                                           url: 'https://www.ral-guetezeichen.de/en/home.html' },
    { text: 'Green Software Foundation',                                                 url: 'https://greensoftware.foundation/' },
  ],
  '4.5': [
    { text: 'TCO Certified',                                                             url: 'https://tcocertified.com/' },
  ],
  // Module 5
  '5.1': [
    { text: 'Conseil d\'État — Étude annuelle 2013 : Le droit souple',                   url: 'https://www.conseil-etat.fr/publications-colloques/etudes/le-droit-souple-etude-annuelle-2013' },
    { text: 'European Environmental Bureau',                                             url: 'https://eeb.org/' },
  ],
  '5.2': [
    { text: 'JRC — EU Code of Conduct for Data Centres',                                 url: 'https://joint-research-centre.ec.europa.eu/scientific-activities-z/energy-efficiency/energy-efficiency-products/code-conduct-ict_en' },
  ],
  '5.3': [
    { text: 'Climate Neutral Data Centre Pact — site officiel',                          url: 'https://www.climateneutraldatacentre.net/' },
    { text: 'CISPE — Cloud Infrastructure Service Providers in Europe',                  url: 'https://cispe.cloud/' },
    { text: 'EUDCA — European Data Centre Association',                                  url: 'https://www.eudca.org/' },
  ],
  '5.4': [
    { text: 'Institut du Numérique Responsable — Charte NR',                              url: 'https://institutnr.org/' },
    { text: 'Responsible Business Alliance',                                              url: 'https://www.responsiblebusiness.org/' },
    { text: 'Google — Sustainability Reports',                                            url: 'https://sustainability.google/reports/' },
  ],
  // Module 6
  '6.1': [
    { text: 'LuxConnect',                                                                 url: 'https://luxconnect.lu/' },
    { text: 'Kiowatt — centrale biomasse partenaire',                                     url: 'https://www.kiowatt.lu/' },
  ],
  '6.2': [
    { text: 'EBRC',                                                                       url: 'https://www.ebrc.com/' },
    { text: 'POST Group Luxembourg',                                                      url: 'https://www.post.lu/' },
    { text: 'Uptime Institute — Tier Classification',                                     url: 'https://uptimeinstitute.com/tiers' },
  ],
  '6.3': [
    { text: 'Uptime Institute — Global Data Center Survey',                               url: 'https://uptimeinstitute.com/resources/research-and-reports' },
    { text: 'Stockholm Data Parks — chauffage urbain par datacenters',                     url: 'https://stockholmdataparks.com/' },
  ],
  '6.4': [
    { text: 'Institut du Numérique Responsable',                                          url: 'https://institutnr.org/' },
  ],
};

let touched = 0, dropped = 0;
for (const mod of json.modules) {
  for (const sec of mod.sections) {
    if (sec.goFurther) {
      const replacement = M[sec.id];
      if (replacement && replacement.length > 0) {
        sec.goFurther = replacement;
        touched++;
      } else {
        delete sec.goFurther;
        dropped++;
      }
    }
  }
}

fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf-8');
console.log(`Sections mises à jour avec liens : ${touched}`);
console.log(`Sections sans lien disponible (goFurther supprimé) : ${dropped}`);
