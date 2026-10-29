import { canonicalizeHandle } from "@/lib/productSeo";

export const FR_PILOT_HANDLES = [
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

export function isFrenchPilotHandle(handle: string): boolean {
  return (FR_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

export type ApprovedFrCopy = { approved: boolean; html: string };

export const FR_PRODUCT_COPY: Record<string, ApprovedFrCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>Pas une simple sauce tomate — un pur délice ensoleillé ! Notre secret ? Une généreuse portion de poivron rouge pour plus de profondeur et de complexité, ainsi qu'un filet d'huile d'olive extra vierge pour une finale douce et fruitée. Rejoignez-nous dans notre voyage végétal au cœur de l'Italie.</p>
<h3>Valeurs nutritionnelles</h3>
<table>
<thead><tr><th>Valeur nutritionnelle</th><th>Par gobelet (75 g)</th><th>Pour 100 g de matière sèche</th></tr></thead>
<tbody>
<tr><td>Énergie</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Matières grasses</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>dont acides gras saturés</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Glucides</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>dont sucres</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Fibres alimentaires</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Protéines</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Sel</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Ingrédients</h3>
<p>Pâtes (semoule de <strong>blé</strong> dur, isolat de protéines de pois) 52%, protéines de pois texturées 21%, tomate, amidon de pomme de terre, arôme, oignon, sucre, sel, carotte, ail, poivron rouge, herbes et épices, huile d'olive extra vierge.</p>
<h3>Allergènes</h3>
<p><strong>Contient :</strong> blé.</p>
<p><strong>Peut contenir des traces de :</strong> lait, soja et œufs.</p>
<h3>Préparation</h3>
<p>Secouez le gobelet fermé. Retirez le couvercle, ajoutez la quantité recommandée d'eau bouillante — environ 190 ml — et mélangez bien à la fourchette. Attendez 5 minutes, remélangez et savourez !</p>
<p>Poids net : 75 g · À consommer de préférence avant : 12 mois</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>Pas un simple fromage à la crème — la protéine végétale rencontre des pâtes crémeuses ! Notre secret ? Un savant jeu de textures de pois et une touche épicée de poivre noir et d'ail, qui capture l'esprit classique italien. Rejoignez-nous dans notre voyage végétal au cœur de Rome — là où la carbonara rencontre l'avenir.</p>
<h3>Valeurs nutritionnelles</h3>
<table>
<thead><tr><th>Valeur nutritionnelle</th><th>Par gobelet (75 g)</th><th>Pour 100 g de matière sèche</th></tr></thead>
<tbody>
<tr><td>Énergie</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Matières grasses</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>dont acides gras saturés</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Glucides</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>dont sucres</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Fibres alimentaires</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Protéines</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Sel</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Ingrédients</h3>
<p>Pâtes (semoule de <strong>blé</strong> dur, isolat de protéines de pois) 52%, protéines de pois texturées 21%, lactosérum en poudre (contient du <strong>lait</strong>), amidon de pomme de terre, poudre d'huile de tournesol (huile de tournesol oléique non hydrogénée, sirop de glucose, protéine de <strong>lait</strong>), poudre de fromage fondu (contient du <strong>lait</strong>), arômes (contiennent du <strong>lait</strong>), sel, poivre noir, ail, curcuma.</p>
<h3>Allergènes</h3>
<p><strong>Contient :</strong> blé et lait.</p>
<p><strong>Peut contenir des traces de :</strong> soja et œufs.</p>
<h3>Préparation</h3>
<p>Secouez le gobelet fermé. Retirez le couvercle, ajoutez la quantité recommandée d'eau bouillante — environ 170 ml — et mélangez bien à la fourchette. Attendez 5 minutes, remélangez et savourez !</p>
<p>Poids net : 75 g · À consommer de préférence avant : 12 mois</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>Une explosion crémeuse d'arômes chauds et ensoleillés ! Notre curry végétal est à base de protéines de tournesol texturées et d'une douce sauce au lait de coco, parfaitement équilibrée entre curry et coriandre. Servi avec du riz — un repas exotique complet, prêt en quelques minutes. Un voyage vers la street food d'Asie du Sud-Est, capturé dans un gobelet.</p>
<h3>Valeurs nutritionnelles</h3>
<table>
<thead><tr><th>Valeur nutritionnelle</th><th>Par gobelet (73 g)</th><th>Pour 100 g de matière sèche</th></tr></thead>
<tbody>
<tr><td>Énergie</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Matières grasses</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>dont acides gras saturés</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Glucides</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>dont sucres</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Fibres alimentaires</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Protéines</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Sel</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingrédients</h3>
<p>Protéines de tournesol texturées 38,4%, riz précuit 27,4%, amidon de pomme de terre, lait de coco (lait de coco, maltodextrine, caséinate de sodium (contient du <strong>lait</strong>)), protéine de <strong>lait</strong>, crème en poudre (sirop de glucose, matière grasse végétale, protéine de <strong>lait</strong>, stabilisant : E340, agent antiagglomérant : E551, émulsifiant : E471), dextrose, sel, sucre de canne, arômes naturels, poudre de curry, poudre de concentré de jus de citron vert (maltodextrine), carotte, oignon, herbes, épices et coriandre.</p>
<h3>Allergènes</h3>
<p><strong>Contient :</strong> lait.</p>
<p><strong>Peut contenir des traces de :</strong> blé, soja et œufs.</p>
<h3>Préparation</h3>
<p>Secouez le gobelet fermé. Retirez le couvercle, ajoutez la quantité recommandée d'eau bouillante — environ 180 ml — et mélangez bien à la fourchette. Attendez 5 minutes, remélangez et savourez !</p>
<p>Poids net : 73 g · À consommer de préférence avant : 12 mois</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>Un BBQ fumé aux lentilles vertes — désormais capturé dans un gobelet chaud ! Notre plat repose sur une généreuse base de protéines de tournesol texturées et de lentilles vertes, avec la douceur du paprika fumé, des oignons caramélisés et une touche épicée d'ail. Un hommage au BBQ pour tous ceux qui aiment les repas pleins de saveur.</p>
<h3>Valeurs nutritionnelles</h3>
<table>
<thead><tr><th>Valeur nutritionnelle</th><th>Par gobelet (65 g)</th><th>Pour 100 g de matière sèche</th></tr></thead>
<tbody>
<tr><td>Énergie</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1468 kJ</td></tr>
<tr><td>Matières grasses</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>dont acides gras saturés</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Glucides</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>dont sucres</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Fibres alimentaires</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Protéines</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Sel</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingrédients</h3>
<p>Protéines de tournesol texturées 38,5%, lentilles vertes précuites 30,8%, poudre de tomate, sucre de canne, amidon de pomme de terre, poivron rouge, arômes, sel, oignon, levure, carotte, sucre caramélisé en poudre (sucre caramélisé, maltodextrine), herbes et épices, E262 (diacétate de sodium), ail.</p>
<h3>Allergènes</h3>
<p><strong>Contient :</strong> aucun (produit sans allergène).</p>
<p><strong>Peut contenir des traces de :</strong> blé, lait, soja et œufs.</p>
<h3>Préparation</h3>
<p>Secouez le gobelet fermé. Retirez le couvercle, ajoutez la quantité recommandée d'eau bouillante — environ 180 ml — et mélangez bien à la fourchette. Attendez 5 minutes, remélangez et savourez !</p>
<p>Poids net : 65 g · À consommer de préférence avant : 12 mois</p>`,
  },
};

export function getApprovedFrCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = FR_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

export function hasApprovedFrCopy(handle: string | undefined): boolean {
  return getApprovedFrCopy(handle) !== null;
}

export function isFrenchPageReady(handle: string | undefined): boolean {
  if (!handle) return false;
  const h = canonicalizeHandle(handle);
  const needsApproval = ["plant-based-fusilli-bolognese", "plant-based-pasta-carbonara", "plant-based-yellow-curry-rice", "plant-based-smoky-bbq-lentils"].includes(h);
  return needsApproval ? hasApprovedFrCopy(h) : isFrenchPilotHandle(h);
}
