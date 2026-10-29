import { canonicalizeHandle } from "@/lib/productSeo";

export const FI_PILOT_HANDLES = [
  "starter-pack-12-cups-1",
  "plant-based-fusilli-bolognese",
  "plant-based-pasta-carbonara",
  "plant-based-yellow-curry-rice",
  "plant-based-smoky-bbq-lentils",
  "bolognese-box-12-cups",
  "carbonara-box-12-cups",
  "smoky-lentils-box-12-cups",
  "yellow-curry-box-12-cups",
] as const;

export function isFinnishPilotHandle(handle: string): boolean {
  return (FI_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

export type ApprovedFiCopy = { approved: boolean; html: string };

export const FI_PRODUCT_COPY: Record<string, ApprovedFiCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>Ei vain tomaattia — aurinkoisen kypsä makuelämys! Salaisuutemme? Runsas annos punaista paprikaa lisäämään syvyyttä ja monimuotoisuutta sekä loraus ekstra-neitsytoliiviöljyä pehmeän, hedelmäisen jälkimaun vuoksi. Liity mukaamme kasvipohjaiselle matkalle Italian sydämeen.</p>
<h3>Ravintoarvot</h3>
<table>
<thead><tr><th>Ravintoarvot</th><th>Per muki (75 g)</th><th>Per 100 g kuiva-ainetta</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Rasvat</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>joista tyydyttyneitä</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Hiilihydraatit</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>joista sokereita</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Ravintokuitu</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Proteiini</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Suola</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Ainesosat</h3>
<p>Pasta (durum<strong>vehnä</strong>semolina, herneproteiini-isolaatti) 52 %, teksturoitu herneproteiini 21 %, tomaatti, perunatärkkelys, aromi, sipuli, sokeri, suola, porkkana, valkosipuli, punainen paprika, yrtit ja mausteet, ekstra-neitsytoliiviöljy.</p>
<h3>Allergeenit</h3>
<p><strong>Sisältää:</strong> vehnää.</p>
<p><strong>Saattaa sisältää jäämiä:</strong> maitoa, soijaa ja kananmunaa.</p>
<h3>Valmistus</h3>
<p>Ravista suljettua mukia. Poista kansi, lisää suositeltu määrä kiehuvaa vettä — noin 190 ml — ja sekoita hyvin haarukalla. Odota 5 minuuttia, sekoita uudelleen ja nauti!</p>
<p>Nettopaino: 75 g · Parasta ennen: 12 kuukautta</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>Ei vain juustoa ja kermaa — kasviproteiini kohtaa kermaisen pastan! Salaisuutemme? Hienovarainen yhdistelmä herneproteiinin rakennetta ja mausteinen annos mustapippuria ja valkosipulia, joka vangitsee klassisen italialaisen hengen. Liity mukaamme kasvipohjaiselle matkalle Rooman sydämeen — missä carbonara kohtaa tulevaisuuden.</p>
<h3>Ravintoarvot</h3>
<table>
<thead><tr><th>Ravintoarvot</th><th>Per muki (75 g)</th><th>Per 100 g kuiva-ainetta</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Rasvat</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>joista tyydyttyneitä</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Hiilihydraatit</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>joista sokereita</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Ravintokuitu</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Proteiini</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Suola</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Ainesosat</h3>
<p>Pasta (durum<strong>vehnä</strong>semolina, herneproteiini-isolaatti) 52 %, teksturoitu herneproteiini 21 %, heraproteiinijauhe (sisältää <strong>maitoa</strong>), perunatärkkelys, auringonkukkaöljyjauhe (kovettamaton runsasoleiininen auringonkukkaöljy, glukoosisiirappi, <strong>maito</strong>proteiini), sulatejuustojauhe (sisältää <strong>maitoa</strong>), aromit (sisältävät <strong>maitoa</strong>), suola, mustapippuri, valkosipuli, kurkuma.</p>
<h3>Allergeenit</h3>
<p><strong>Sisältää:</strong> vehnää ja maitoa.</p>
<p><strong>Saattaa sisältää jäämiä:</strong> soijaa ja kananmunaa.</p>
<h3>Valmistus</h3>
<p>Ravista suljettua mukia. Poista kansi, lisää suositeltu määrä kiehuvaa vettä — noin 170 ml — ja sekoita hyvin haarukalla. Odota 5 minuuttia, sekoita uudelleen ja nauti!</p>
<p>Nettopaino: 75 g · Parasta ennen: 12 kuukautta</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>Kermainen räjähdys lämpöä ja aurinkoisia aromeja! Kasvipohjainen currymme perustuu teksturoituun auringonkukkaproteiiniin ja pehmeään kookosmaitokastikkeeseen, joka tasapainottaa curryn ja korianterin täydellisesti. Tarjolla riisin kanssa — täydellinen, eksoottinen ateria valmiina muutamassa minuutissa. Matka Kaakkois-Aasian katukeittiöihin, vangittuna mukiin.</p>
<h3>Ravintoarvot</h3>
<table>
<thead><tr><th>Ravintoarvot</th><th>Per muki (73 g)</th><th>Per 100 g kuiva-ainetta</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Rasvat</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>joista tyydyttyneitä</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Hiilihydraatit</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>joista sokereita</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Ravintokuitu</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Proteiini</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Suola</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ainesosat</h3>
<p>Teksturoitu auringonkukkaproteiini 38,4 %, esikypsennetty riisi 27,4 %, perunatärkkelys, kookosmaito (kookosmaito, maltodekstriini, natriumkaseinaatti (sisältää <strong>maitoa</strong>)), <strong>maito</strong>proteiini, kerma (glukoosisiirappi, kasviöljy, <strong>maito</strong>proteiini, stabilointiaine: E340, paakkuuntumisenestoaine: E551, emulgointiaine: E471), dekstroosi, suola, ruokosokeri, luonnolliset aromit, curryjauhe, limettimehutiivistejauhe (maltodekstriini), porkkana, sipuli, yrtit, mausteet ja koriander.</p>
<h3>Allergeenit</h3>
<p><strong>Sisältää:</strong> maitoa.</p>
<p><strong>Saattaa sisältää jäämiä:</strong> vehnää, soijaa ja kananmunaa.</p>
<h3>Valmistus</h3>
<p>Ravista suljettua mukia. Poista kansi, lisää suositeltu määrä kiehuvaa vettä — noin 180 ml — ja sekoita hyvin haarukalla. Odota 5 minuuttia, sekoita uudelleen ja nauti!</p>
<p>Nettopaino: 73 g · Parasta ennen: 12 kuukautta</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>Savustettu BBQ vihreillä linsseillä — nyt vangittuna lämpimään mukiin! Ruokalajimme perustuu runsaaseen pohjaan teksturoitua auringonkukkaproteiinia ja vihreitä linssejä, makeutettuna savupaprikalla, karamellisoiduilla sipuleilla ja mausteisella valkosipulin vivahteella. Kunnianosoitus BBQ:lle kaikille, jotka rakastavat täyteläisiä makuja.</p>
<h3>Ravintoarvot</h3>
<table>
<thead><tr><th>Ravintoarvot</th><th>Per muki (65 g)</th><th>Per 100 g kuiva-ainetta</th></tr></thead>
<tbody>
<tr><td>Energia</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1468 kJ</td></tr>
<tr><td>Rasvat</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>joista tyydyttyneitä</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Hiilihydraatit</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>joista sokereita</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Ravintokuitu</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Proteiini</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Suola</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ainesosat</h3>
<p>Teksturoitu auringonkukkaproteiini 38,5 %, esikypsennetyt vihreät linssit 30,8 %, tomaattijauhe, ruokosokeri, perunatärkkelys, punainen paprika, aromit, suola, sipuli, hiiva, porkkana, karamellisoitu sokerijauhe (karamellisoitu sokeri, maltodekstriini), yrtit ja mausteet, E262 natriumdiasetaatti, valkosipuli.</p>
<h3>Allergeenit</h3>
<p><strong>Sisältää:</strong> ei mitään (allergeenivapaa tuote).</p>
<p><strong>Saattaa sisältää jäämiä:</strong> vehnää, maitoa, soijaa ja kananmunaa.</p>
<h3>Valmistus</h3>
<p>Ravista suljettua mukia. Poista kansi, lisää suositeltu määrä kiehuvaa vettä — noin 180 ml — ja sekoita hyvin haarukalla. Odota 5 minuuttia, sekoita uudelleen ja nauti!</p>
<p>Nettopaino: 65 g · Parasta ennen: 12 kuukautta</p>`,
  },
};

export function getApprovedFiCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = FI_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

export function hasApprovedFiCopy(handle: string | undefined): boolean {
  return getApprovedFiCopy(handle) !== null;
}

export function isFinnishPageReady(handle: string | undefined): boolean {
  if (!handle) return false;
  const h = canonicalizeHandle(handle);
  const needsApproval = ["plant-based-fusilli-bolognese", "plant-based-pasta-carbonara", "plant-based-yellow-curry-rice", "plant-based-smoky-bbq-lentils"].includes(h);
  return needsApproval ? hasApprovedFiCopy(h) : isFinnishPilotHandle(h);
}
