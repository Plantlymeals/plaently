import { canonicalizeHandle } from "@/lib/productSeo";

export const ES_PILOT_HANDLES = [
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

export function isSpanishPilotHandle(handle: string): boolean {
  return (ES_PILOT_HANDLES as readonly string[]).includes(canonicalizeHandle(handle));
}

export type ApprovedEsCopy = { approved: boolean; html: string };

export const ES_PRODUCT_COPY: Record<string, ApprovedEsCopy> = {
  "plant-based-fusilli-bolognese": {
    approved: true,
    html: `<p>No es solo tomate — ¡una explosión de sabor bañada por el sol! ¿Nuestro secreto? Una generosa porción de pimiento rojo para más profundidad y complejidad, además de un chorrito de aceite de oliva virgen extra para un final suave y afrutado. Acompáñanos en nuestro viaje vegetal al corazón de Italia.</p>
<h3>Valor nutricional</h3>
<table>
<thead><tr><th>Valor nutricional</th><th>Por vaso (75 g)</th><th>Por 100 g de materia seca</th></tr></thead>
<tbody>
<tr><td>Energía</td><td>263 kcal / 1109 kJ</td><td>350 kcal / 1479 kJ</td></tr>
<tr><td>Grasas</td><td>2,2 g</td><td>2,9 g</td></tr>
<tr><td>de las cuales saturadas</td><td>0,4 g</td><td>0,5 g</td></tr>
<tr><td>Hidratos de carbono</td><td>37,5 g</td><td>50 g</td></tr>
<tr><td>de los cuales azúcares</td><td>7,1 g</td><td>9,4 g</td></tr>
<tr><td>Fibra alimentaria</td><td>5,9 g</td><td>7,8 g</td></tr>
<tr><td>Proteínas</td><td>20,3 g</td><td>27 g</td></tr>
<tr><td>Sal</td><td>2,4 g</td><td>3,2 g</td></tr>
</tbody>
</table>
<h3>Ingredientes</h3>
<p>Pasta (sémola de <strong>trigo</strong> duro, aislado de proteína de guisante) 52%, proteína de guisante texturizada 21%, tomate, almidón de patata, aroma, cebolla, azúcar, sal, zanahoria, ajo, pimiento rojo, hierbas y especias, aceite de oliva virgen extra.</p>
<h3>Alérgenos</h3>
<p><strong>Contiene:</strong> trigo.</p>
<p><strong>Puede contener trazas de:</strong> leche, soja y huevo.</p>
<h3>Preparación</h3>
<p>Agita el vaso cerrado. Retira la tapa, añade la cantidad recomendada de agua hirviendo — unos 190 ml — y remueve bien con un tenedor. Espera 5 minutos, remueve de nuevo y ¡disfruta!</p>
<p>Peso neto: 75 g · Consumir preferentemente antes de: 12 meses</p>`,
  },
  "plant-based-pasta-carbonara": {
    approved: true,
    html: `<p>No es solo queso y nata — ¡la proteína vegetal se encuentra con la pasta cremosa! ¿Nuestro secreto? Un sofisticado juego de texturas de guisante y un toque especiado de pimienta negra y ajo que captura el espíritu clásico italiano. Acompáñanos en nuestro viaje vegetal al corazón de Roma — donde la carbonara se encuentra con el futuro.</p>
<h3>Valor nutricional</h3>
<table>
<thead><tr><th>Valor nutricional</th><th>Por vaso (75 g)</th><th>Por 100 g de materia seca</th></tr></thead>
<tbody>
<tr><td>Energía</td><td>285 kcal / 1202 kJ</td><td>380 kcal / 1602 kJ</td></tr>
<tr><td>Grasas</td><td>6,4 g</td><td>8,5 g</td></tr>
<tr><td>de las cuales saturadas</td><td>0,6 g</td><td>0,8 g</td></tr>
<tr><td>Hidratos de carbono</td><td>34,5 g</td><td>46 g</td></tr>
<tr><td>de los cuales azúcares</td><td>5,0 g</td><td>6,6 g</td></tr>
<tr><td>Fibra alimentaria</td><td>4,3 g</td><td>5,8 g</td></tr>
<tr><td>Proteínas</td><td>20,2 g</td><td>27 g</td></tr>
<tr><td>Sal</td><td>2,9 g</td><td>3,9 g</td></tr>
</tbody>
</table>
<h3>Ingredientes</h3>
<p>Pasta (sémola de <strong>trigo</strong> duro, aislado de proteína de guisante) 52%, proteína de guisante texturizada 21%, suero de <strong>leche</strong> en polvo (contiene <strong>leche</strong>), almidón de patata, polvo de aceite de girasol (aceite de girasol alto oleico no hidrogenado, jarabe de glucosa, proteína de <strong>leche</strong>), polvo de queso fundido (contiene <strong>leche</strong>), aromas (contienen <strong>leche</strong>), sal, pimienta negra, ajo, cúrcuma.</p>
<h3>Alérgenos</h3>
<p><strong>Contiene:</strong> trigo y leche.</p>
<p><strong>Puede contener trazas de:</strong> soja y huevo.</p>
<h3>Preparación</h3>
<p>Agita el vaso cerrado. Retira la tapa, añade la cantidad recomendada de agua hirviendo — unos 170 ml — y remueve bien con un tenedor. Espera 5 minutos, remueve de nuevo y ¡disfruta!</p>
<p>Peso neto: 75 g · Consumir preferentemente antes de: 12 meses</p>`,
  },
  "plant-based-yellow-curry-rice": {
    approved: true,
    html: `<p>¡Una explosión cremosa de aromas cálidos y soleados! Nuestro curry vegetal se basa en proteína de girasol texturizada y una suave salsa de leche de coco que equilibra a la perfección el curry y el cilantro. Servido con arroz — una comida exótica completa, lista en minutos. Un viaje a la comida callejera del sudeste asiático, capturado en un vaso.</p>
<h3>Valor nutricional</h3>
<table>
<thead><tr><th>Valor nutricional</th><th>Por vaso (73 g)</th><th>Por 100 g de materia seca</th></tr></thead>
<tbody>
<tr><td>Energía</td><td>285 kcal / 1195 kJ</td><td>391 kcal / 1648 kJ</td></tr>
<tr><td>Grasas</td><td>6,7 g</td><td>9,2 g</td></tr>
<tr><td>de las cuales saturadas</td><td>3,8 g</td><td>5,2 g</td></tr>
<tr><td>Hidratos de carbono</td><td>32,9 g</td><td>45 g</td></tr>
<tr><td>de los cuales azúcares</td><td>6,5 g</td><td>8,9 g</td></tr>
<tr><td>Fibra alimentaria</td><td>6,1 g</td><td>8,3 g</td></tr>
<tr><td>Proteínas</td><td>20,4 g</td><td>28 g</td></tr>
<tr><td>Sal</td><td>2,3 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingredientes</h3>
<p>Proteína de girasol texturizada 38,4%, arroz precocido 27,4%, almidón de patata, leche de coco (leche de coco, maltodextrina, caseinato de sodio (contiene <strong>leche</strong>)), proteína de <strong>leche</strong>, crema en polvo (jarabe de glucosa, grasa vegetal, proteína de <strong>leche</strong>, estabilizante: E340, antiaglomerante: E551, emulgente: E471), dextrosa, sal, azúcar de caña, aromas naturales, curry en polvo, polvo de concentrado de zumo de lima (maltodextrina), zanahoria, cebolla, hierbas, especias y cilantro.</p>
<h3>Alérgenos</h3>
<p><strong>Contiene:</strong> leche.</p>
<p><strong>Puede contener trazas de:</strong> trigo, soja y huevo.</p>
<h3>Preparación</h3>
<p>Agita el vaso cerrado. Retira la tapa, añade la cantidad recomendada de agua hirviendo — unos 180 ml — y remueve bien con un tenedor. Espera 5 minutos, remueve de nuevo y ¡disfruta!</p>
<p>Peso neto: 73 g · Consumir preferentemente antes de: 12 meses</p>`,
  },
  "plant-based-smoky-bbq-lentils": {
    approved: true,
    html: `<p>BBQ ahumado con lentejas verdes — ¡ahora en un vaso caliente! Nuestro plato se basa en una generosa base de proteína de girasol texturizada y lentejas verdes, con el dulzor del pimentón ahumado, cebolla caramelizada y un toque especiado de ajo. Un homenaje a la barbacoa para quienes aman las comidas llenas de sabor.</p>
<h3>Valor nutricional</h3>
<table>
<thead><tr><th>Valor nutricional</th><th>Por vaso (65 g)</th><th>Por 100 g de materia seca</th></tr></thead>
<tbody>
<tr><td>Energía</td><td>228 kcal / 954 kJ</td><td>351 kcal / 1468 kJ</td></tr>
<tr><td>Grasas</td><td>2,9 g</td><td>4,5 g</td></tr>
<tr><td>de las cuales saturadas</td><td>0,4 g</td><td>0,6 g</td></tr>
<tr><td>Hidratos de carbono</td><td>25,4 g</td><td>39 g</td></tr>
<tr><td>de los cuales azúcares</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Fibra alimentaria</td><td>9,1 g</td><td>14 g</td></tr>
<tr><td>Proteínas</td><td>20,8 g</td><td>32 g</td></tr>
<tr><td>Sal</td><td>2,0 g</td><td>3,1 g</td></tr>
</tbody>
</table>
<h3>Ingredientes</h3>
<p>Proteína de girasol texturizada 38,5%, lentejas verdes precocidas 30,8%, tomate en polvo, azúcar de caña, almidón de patata, pimiento rojo, aromas, sal, cebolla, levadura, zanahoria, azúcar caramelizado en polvo (azúcar caramelizado, maltodextrina), hierbas y especias, E262 diacetato sódico, ajo.</p>
<h3>Alérgenos</h3>
<p><strong>Contiene:</strong> ninguno (producto sin alérgenos).</p>
<p><strong>Puede contener trazas de:</strong> trigo, leche, soja y huevo.</p>
<h3>Preparación</h3>
<p>Agita el vaso cerrado. Retira la tapa, añade la cantidad recomendada de agua hirviendo — unos 180 ml — y remueve bien con un tenedor. Espera 5 minutos, remueve de nuevo y ¡disfruta!</p>
<p>Peso neto: 65 g · Consumir preferentemente antes de: 12 meses</p>`,
  },
};

export function getApprovedEsCopy(handle: string | undefined): string | null {
  if (!handle) return null;
  const entry = ES_PRODUCT_COPY[canonicalizeHandle(handle)];
  return entry?.approved ? entry.html : null;
}

export function hasApprovedEsCopy(handle: string | undefined): boolean {
  return getApprovedEsCopy(handle) !== null;
}

export function isSpanishPageReady(handle: string | undefined): boolean {
  if (!handle) return false;
  const h = canonicalizeHandle(handle);
  const needsApproval = ["plant-based-fusilli-bolognese", "plant-based-pasta-carbonara", "plant-based-yellow-curry-rice", "plant-based-smoky-bbq-lentils"].includes(h);
  return needsApproval ? hasApprovedEsCopy(h) : isSpanishPilotHandle(h);
}
