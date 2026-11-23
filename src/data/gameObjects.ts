import { SolidDefinition } from '../types/projection';

export interface GuessObjectItem {
  id: 'sedia' | 'tavolo' | 'libro';
  order: number;
  clueTitle: string;
  objectName: string;
  correctOptionId: string;
  options: Array<{
    id: string;
    label: string;
  }>;
  descriptionPrompt: string;
  reflectionQuestions: string[];
  explanation3D: string;
  solid: SolidDefinition;
}

export const GAME_OBJECTS: GuessObjectItem[] = [
  {
    id: 'sedia',
    order: 1,
    clueTitle: 'Oggetto Misterioso 1',
    objectName: 'Una Sedia',
    correctOptionId: 'sedia',
    options: [
      { id: 'sgabello', label: 'Sgabello senza schienale' },
      { id: 'sedia', label: 'Sedia con schienale' },
      { id: 'libreria', label: 'Libreria a 4 ripiani' },
      { id: 'cubo', label: 'Cubo pieno' },
    ],
    descriptionPrompt:
      'Osserva soprattutto la vista laterale (PL): vedi una parte che sale in alto solo sul retro e uno spazio vuoto sotto davanti. Che oggetto è?',
    reflectionQuestions: [
      'Quale vista ti ha fatto capire subito che c’è uno schienale?',
      'Perché dall’alto (PO) non vedi le quattro gambe come spigoli continui?',
    ],
    explanation3D:
      'È una Sedia! Sul Piano Verticale (PV) vedi la larghezza della seduta e lo schienale alto; sul Piano Orizzontale (PO) vedi il quadrato della seduta (con le gambe nascoste sotto, tratteggiate); sul Piano Laterale (PL) compare il profilo laterale con lo schienale dietro e le gambe davanti e dietro.',
    solid: {
      id: 'game-sedia',
      name: 'Oggetto Misterioso 1',
      level: 'Base',
      domainTag: 'Arredo',
      description: 'Oggetto domestico formato da piano d’appoggio rialzato su quattro sostegni e parete posteriore verticale.',
      learningTip: 'Confronta lo spessore dello schienale su PO e PL.',
      dimensionsCm: { width: 2.0, height: 2.8, depth: 2.0 },
      parts: [
        // Four legs (y: 0.4..1.6)
        { id: 'leg-bl', label: 'Gamba post. sx', xMin: -3.2, xMax: -2.9, yMin: 0.4, yMax: 1.6, zMin: 1.0, zMax: 1.3, color: '#C99E67', roughness: 0.65, metalness: 0.05 },
        { id: 'leg-br', label: 'Gamba post. dx', xMin: -1.5, xMax: -1.2, yMin: 0.4, yMax: 1.6, zMin: 1.0, zMax: 1.3, color: '#C99E67', roughness: 0.65, metalness: 0.05 },
        { id: 'leg-fl', label: 'Gamba ant. sx', xMin: -3.2, xMax: -2.9, yMin: 0.4, yMax: 1.6, zMin: 2.7, zMax: 3.0, color: '#C99E67', roughness: 0.65, metalness: 0.05 },
        { id: 'leg-fr', label: 'Gamba ant. dx', xMin: -1.5, xMax: -1.2, yMin: 0.4, yMax: 1.6, zMin: 2.7, zMax: 3.0, color: '#C99E67', roughness: 0.65, metalness: 0.05 },
        // Seat (y: 1.6..1.85)
        { id: 'seat', label: 'Seduta', xMin: -3.2, xMax: -1.2, yMin: 1.6, yMax: 1.85, zMin: 1.0, zMax: 3.0, color: '#E2C799', roughness: 0.55, metalness: 0.04 },
        // Backrest (y: 1.85..3.2, z: 1.0..1.3)
        { id: 'back', label: 'Schienale', xMin: -3.2, xMax: -1.2, yMin: 1.85, yMax: 3.2, zMin: 1.0, zMax: 1.3, color: '#B45309', roughness: 0.5, metalness: 0.06 },
      ],
      projectionVertices: [],
      ribaltamentoDepths: [1.0, 1.3, 2.7, 3.0],
      constructionXs: [-3.2, -2.9, -1.5, -1.2],
      constructionYs: [0.4, 1.6, 1.85, 3.2],
      projections: {
        PV: {
          polygons: [
            { fill: '#D1FAE5', points: [{ u: -3.2, v: 0.4 }, { u: -2.9, v: 0.4 }, { u: -2.9, v: 1.6 }, { u: -3.2, v: 1.6 }] },
            { fill: '#D1FAE5', points: [{ u: -1.5, v: 0.4 }, { u: -1.2, v: 0.4 }, { u: -1.2, v: 1.6 }, { u: -1.5, v: 1.6 }] },
            { fill: '#A7F3D0', points: [{ u: -3.2, v: 1.6 }, { u: -1.2, v: 1.6 }, { u: -1.2, v: 1.85 }, { u: -3.2, v: 1.85 }] },
            { fill: '#6EE7B7', points: [{ u: -3.2, v: 1.85 }, { u: -1.2, v: 1.85 }, { u: -1.2, v: 3.2 }, { u: -3.2, v: 3.2 }] },
          ],
          edges: [
            { from: { u: -3.2, v: 0.4 }, to: { u: -2.9, v: 0.4 } },
            { from: { u: -2.9, v: 0.4 }, to: { u: -2.9, v: 1.6 } },
            { from: { u: -3.2, v: 0.4 }, to: { u: -3.2, v: 3.2 } },
            { from: { u: -1.5, v: 0.4 }, to: { u: -1.2, v: 0.4 } },
            { from: { u: -1.5, v: 0.4 }, to: { u: -1.5, v: 1.6 } },
            { from: { u: -1.2, v: 0.4 }, to: { u: -1.2, v: 3.2 } },
            { from: { u: -3.2, v: 1.6 }, to: { u: -1.2, v: 1.6 } },
            { from: { u: -3.2, v: 1.85 }, to: { u: -1.2, v: 1.85 } },
            { from: { u: -3.2, v: 3.2 }, to: { u: -1.2, v: 3.2 } },
          ],
        },
        PO: {
          polygons: [
            { fill: '#E0F2FE', points: [{ u: -3.2, v: 1.3 }, { u: -1.2, v: 1.3 }, { u: -1.2, v: 3.0 }, { u: -3.2, v: 3.0 }] },
            { fill: '#BAE6FD', points: [{ u: -3.2, v: 1.0 }, { u: -1.2, v: 1.0 }, { u: -1.2, v: 1.3 }, { u: -3.2, v: 1.3 }] },
          ],
          edges: [
            { from: { u: -3.2, v: 1.0 }, to: { u: -1.2, v: 1.0 } },
            { from: { u: -1.2, v: 1.0 }, to: { u: -1.2, v: 3.0 } },
            { from: { u: -1.2, v: 3.0 }, to: { u: -3.2, v: 3.0 } },
            { from: { u: -3.2, v: 3.0 }, to: { u: -3.2, v: 1.0 } },
            { from: { u: -3.2, v: 1.3 }, to: { u: -1.2, v: 1.3 } },
            // Hidden front legs under seat
            { from: { u: -2.9, v: 2.7 }, to: { u: -2.9, v: 3.0 }, dashed: true },
            { from: { u: -3.2, v: 2.7 }, to: { u: -2.9, v: 2.7 }, dashed: true },
            { from: { u: -1.5, v: 2.7 }, to: { u: -1.5, v: 3.0 }, dashed: true },
            { from: { u: -1.5, v: 2.7 }, to: { u: -1.2, v: 2.7 }, dashed: true },
          ],
        },
        PL: {
          polygons: [
            { fill: '#FEF3C7', points: [{ u: 1.0, v: 0.4 }, { u: 1.3, v: 0.4 }, { u: 1.3, v: 1.6 }, { u: 1.0, v: 1.6 }] },
            { fill: '#FEF3C7', points: [{ u: 2.7, v: 0.4 }, { u: 3.0, v: 0.4 }, { u: 3.0, v: 1.6 }, { u: 2.7, v: 1.6 }] },
            { fill: '#FDE68A', points: [{ u: 1.0, v: 1.6 }, { u: 3.0, v: 1.6 }, { u: 3.0, v: 1.85 }, { u: 1.0, v: 1.85 }] },
            { fill: '#FCD34D', points: [{ u: 1.0, v: 1.85 }, { u: 1.3, v: 1.85 }, { u: 1.3, v: 3.2 }, { u: 1.0, v: 3.2 }] },
          ],
          edges: [
            { from: { u: 1.0, v: 0.4 }, to: { u: 1.3, v: 0.4 } },
            { from: { u: 1.3, v: 0.4 }, to: { u: 1.3, v: 1.6 } },
            { from: { u: 2.7, v: 0.4 }, to: { u: 3.0, v: 0.4 } },
            { from: { u: 2.7, v: 0.4 }, to: { u: 2.7, v: 1.6 } },
            { from: { u: 3.0, v: 0.4 }, to: { u: 3.0, v: 1.85 } },
            { from: { u: 1.0, v: 1.6 }, to: { u: 3.0, v: 1.6 } },
            { from: { u: 1.0, v: 1.85 }, to: { u: 3.0, v: 1.85 } },
            { from: { u: 1.3, v: 1.85 }, to: { u: 1.3, v: 3.2 } },
            { from: { u: 1.3, v: 3.2 }, to: { u: 1.0, v: 3.2 } },
            { from: { u: 1.0, v: 3.2 }, to: { u: 1.0, v: 0.4 } },
          ],
        },
      },
    },
  },
  {
    id: 'tavolo',
    order: 2,
    clueTitle: 'Oggetto Misterioso 2',
    objectName: 'Un Tavolo',
    correctOptionId: 'tavolo',
    options: [
      { id: 'tavolo', label: 'Tavolo rettangolare' },
      { id: 'armadio', label: 'Armadio chiuso' },
      { id: 'scaffale', label: 'Scaffale a più ripiani' },
      { id: 'ponte', label: 'Arco in pietra' },
    ],
    descriptionPrompt:
      'Nota il grande piano rettangolare in alto sul PO e le linee tratteggiate agli angoli. Anche su PV e PL vedi lo stesso schema con gambe alte!',
    reflectionQuestions: [
      'Cosa rappresentano i quattro quadratini tratteggiati negli angoli del PO?',
      'Come capisci che l’oggetto è più largo (PV) che profondo (PL)?',
    ],
    explanation3D:
      'È un Tavolo rettangolare! Il Piano Orizzontale (PO) mostra il grande piano d’appoggio rettangolare e le 4 gambe nascoste sotto gli angoli (tratteggiate). Sul PV vedi il lato lungo, sul PL vedi il lato corto.',
    solid: {
      id: 'game-tavolo',
      name: 'Oggetto Misterioso 2',
      level: 'Base',
      domainTag: 'Arredo',
      description: 'Piano orizzontale rettangolare sostenuto da quattro gambe agli angoli.',
      learningTip: 'Le 4 gambe sono coperte dal piano quando guardi dall’alto.',
      dimensionsCm: { width: 3.0, height: 1.8, depth: 1.8 },
      parts: [
        // 4 legs (y: 0.4..1.9)
        { id: 't-bl', label: 'Gamba 1', xMin: -3.7, xMax: -3.4, yMin: 0.4, yMax: 1.9, zMin: 1.0, zMax: 1.3, color: '#94A3B8', roughness: 0.35, metalness: 0.6 },
        { id: 't-br', label: 'Gamba 2', xMin: -1.0, xMax: -0.7, yMin: 0.4, yMax: 1.9, zMin: 1.0, zMax: 1.3, color: '#94A3B8', roughness: 0.35, metalness: 0.6 },
        { id: 't-fl', label: 'Gamba 3', xMin: -3.7, xMax: -3.4, yMin: 0.4, yMax: 1.9, zMin: 2.5, zMax: 2.8, color: '#94A3B8', roughness: 0.35, metalness: 0.6 },
        { id: 't-fr', label: 'Gamba 4', xMin: -1.0, xMax: -0.7, yMin: 0.4, yMax: 1.9, zMin: 2.5, zMax: 2.8, color: '#94A3B8', roughness: 0.35, metalness: 0.6 },
        // Tabletop (y: 1.9..2.2)
        { id: 'top', label: 'Piano del tavolo', xMin: -3.7, xMax: -0.7, yMin: 1.9, yMax: 2.2, zMin: 1.0, zMax: 2.8, color: '#E2C799', roughness: 0.58, metalness: 0.04 },
      ],
      projectionVertices: [],
      ribaltamentoDepths: [1.0, 1.3, 2.5, 2.8],
      constructionXs: [-3.7, -3.4, -1.0, -0.7],
      constructionYs: [0.4, 1.9, 2.2],
      projections: {
        PV: {
          polygons: [
            { fill: '#D1FAE5', points: [{ u: -3.7, v: 0.4 }, { u: -3.4, v: 0.4 }, { u: -3.4, v: 1.9 }, { u: -3.7, v: 1.9 }] },
            { fill: '#D1FAE5', points: [{ u: -1.0, v: 0.4 }, { u: -0.7, v: 0.4 }, { u: -0.7, v: 1.9 }, { u: -1.0, v: 1.9 }] },
            { fill: '#A7F3D0', points: [{ u: -3.7, v: 1.9 }, { u: -0.7, v: 1.9 }, { u: -0.7, v: 2.2 }, { u: -3.7, v: 2.2 }] },
          ],
          edges: [
            { from: { u: -3.7, v: 0.4 }, to: { u: -3.4, v: 0.4 } },
            { from: { u: -3.4, v: 0.4 }, to: { u: -3.4, v: 1.9 } },
            { from: { u: -1.0, v: 0.4 }, to: { u: -0.7, v: 0.4 } },
            { from: { u: -1.0, v: 0.4 }, to: { u: -1.0, v: 1.9 } },
            { from: { u: -3.7, v: 1.9 }, to: { u: -0.7, v: 1.9 } },
            { from: { u: -3.7, v: 2.2 }, to: { u: -0.7, v: 2.2 } },
            { from: { u: -3.7, v: 0.4 }, to: { u: -3.7, v: 2.2 } },
            { from: { u: -0.7, v: 0.4 }, to: { u: -0.7, v: 2.2 } },
          ],
        },
        PO: {
          polygons: [
            { fill: '#BAE6FD', points: [{ u: -3.7, v: 1.0 }, { u: -0.7, v: 1.0 }, { u: -0.7, v: 2.8 }, { u: -3.7, v: 2.8 }] },
          ],
          edges: [
            { from: { u: -3.7, v: 1.0 }, to: { u: -0.7, v: 1.0 } },
            { from: { u: -0.7, v: 1.0 }, to: { u: -0.7, v: 2.8 } },
            { from: { u: -0.7, v: 2.8 }, to: { u: -3.7, v: 2.8 } },
            { from: { u: -3.7, v: 2.8 }, to: { u: -3.7, v: 1.0 } },
            // 4 hidden legs
            { from: { u: -3.4, v: 1.0 }, to: { u: -3.4, v: 1.3 }, dashed: true },
            { from: { u: -3.7, v: 1.3 }, to: { u: -3.4, v: 1.3 }, dashed: true },
            { from: { u: -1.0, v: 1.0 }, to: { u: -1.0, v: 1.3 }, dashed: true },
            { from: { u: -1.0, v: 1.3 }, to: { u: -0.7, v: 1.3 }, dashed: true },
            { from: { u: -3.4, v: 2.5 }, to: { u: -3.4, v: 2.8 }, dashed: true },
            { from: { u: -3.7, v: 2.5 }, to: { u: -3.4, v: 2.5 }, dashed: true },
            { from: { u: -1.0, v: 2.5 }, to: { u: -1.0, v: 2.8 }, dashed: true },
            { from: { u: -1.0, v: 2.5 }, to: { u: -0.7, v: 2.5 }, dashed: true },
          ],
        },
        PL: {
          polygons: [
            { fill: '#FEF3C7', points: [{ u: 1.0, v: 0.4 }, { u: 1.3, v: 0.4 }, { u: 1.3, v: 1.9 }, { u: 1.0, v: 1.9 }] },
            { fill: '#FEF3C7', points: [{ u: 2.5, v: 0.4 }, { u: 2.8, v: 0.4 }, { u: 2.8, v: 1.9 }, { u: 2.5, v: 1.9 }] },
            { fill: '#FDE68A', points: [{ u: 1.0, v: 1.9 }, { u: 2.8, v: 1.9 }, { u: 2.8, v: 2.2 }, { u: 1.0, v: 2.2 }] },
          ],
          edges: [
            { from: { u: 1.0, v: 0.4 }, to: { u: 1.3, v: 0.4 } },
            { from: { u: 1.3, v: 0.4 }, to: { u: 1.3, v: 1.9 } },
            { from: { u: 2.5, v: 0.4 }, to: { u: 2.8, v: 0.4 } },
            { from: { u: 2.5, v: 0.4 }, to: { u: 2.5, v: 1.9 } },
            { from: { u: 1.0, v: 1.9 }, to: { u: 2.8, v: 1.9 } },
            { from: { u: 1.0, v: 2.2 }, to: { u: 2.8, v: 2.2 } },
            { from: { u: 1.0, v: 0.4 }, to: { u: 1.0, v: 2.2 } },
            { from: { u: 2.8, v: 0.4 }, to: { u: 2.8, v: 2.2 } },
          ],
        },
      },
    },
  },
  {
    id: 'libro',
    order: 3,
    clueTitle: 'Oggetto Misterioso 3',
    objectName: 'Un Libro',
    correctOptionId: 'libro',
    options: [
      { id: 'scatola', label: 'Scatola cubica chiusa' },
      { id: 'libro', label: 'Libro chiuso con segnalibro' },
      { id: 'bottiglia', label: 'Bottiglia cilindrica' },
      { id: 'scala', label: 'Scala a chiocciola' },
    ],
    descriptionPrompt:
      'È basso e piatto, formato da due copertine sottili, un blocco di pagine leggermente rientrante e una linguetta sottile che sporge sul davanti!',
    reflectionQuestions: [
      'Come riconosci che questo oggetto è molto più piatto rispetto al tavolo e alla sedia?',
      'In quali viste si vede la linguetta del segnalibro che sporge?',
    ],
    explanation3D:
      'È un Libro chiuso con segnalibro! Sul PO vedi la copertina rettangolare, il dorso laterale e il nastrino del segnalibro che sporge; su PV e PL vedi il basso spessore, le due copertine rigide e il blocco interno dei fogli.',
    solid: {
      id: 'game-libro',
      name: 'Oggetto Misterioso 3',
      level: 'Intermedio',
      domainTag: 'Oggetto Quotidiano',
      description: 'Volume piatto a strati con dorso chiuso a sinistra, pagine rientranti e segnalibro sporgente.',
      learningTip: 'Le proporzioni tra lunghezza, larghezza e piccolo spessore ti svelano subito la natura dell’oggetto.',
      dimensionsCm: { width: 2.2, height: 0.8, depth: 2.8 },
      parts: [
        // Bottom cover (y: 0.6..0.72)
        { id: 'cov-bot', label: 'Copertina inferiore', xMin: -3.3, xMax: -1.1, yMin: 0.6, yMax: 0.72, zMin: 0.7, zMax: 3.1, color: '#0369A1', roughness: 0.55, metalness: 0.05 },
        // Spine on left (x: -3.3..-3.1, y: 0.72..1.28)
        { id: 'spine', label: 'Dorso', xMin: -3.3, xMax: -3.1, yMin: 0.72, yMax: 1.28, zMin: 0.7, zMax: 3.1, color: '#0284C7', roughness: 0.48, metalness: 0.08 },
        // Pages block recessed (x: -3.1..-1.25, y: 0.72..1.28, z: 0.82..2.98)
        { id: 'pages', label: 'Blocco pagine', xMin: -3.1, xMax: -1.25, yMin: 0.72, yMax: 1.28, zMin: 0.82, zMax: 2.98, color: '#F8FAFC', roughness: 0.88, metalness: 0.0 },
        // Top cover (y: 1.28..1.40)
        { id: 'cov-top', label: 'Copertina superiore', xMin: -3.3, xMax: -1.1, yMin: 1.28, yMax: 1.4, zMin: 0.7, zMax: 3.1, color: '#0369A1', roughness: 0.55, metalness: 0.05 },
        // Bookmark ribbon sticking out front (x: -2.35..-2.05, y: 0.96..1.04, z: 2.98..3.55)
        { id: 'ribbon', label: 'Segnalibro', xMin: -2.35, xMax: -2.05, yMin: 0.96, yMax: 1.04, zMin: 2.98, zMax: 3.55, color: '#D97706', roughness: 0.5, metalness: 0.05 },
      ],
      projectionVertices: [],
      ribaltamentoDepths: [0.7, 3.1, 3.55],
      constructionXs: [-3.3, -2.35, -2.05, -1.1],
      constructionYs: [0.6, 0.72, 1.28, 1.4],
      projections: {
        PV: {
          polygons: [
            { fill: '#6EE7B7', points: [{ u: -3.3, v: 0.6 }, { u: -1.1, v: 0.6 }, { u: -1.1, v: 0.72 }, { u: -3.3, v: 0.72 }] },
            { fill: '#D1FAE5', points: [{ u: -3.1, v: 0.72 }, { u: -1.25, v: 0.72 }, { u: -1.25, v: 1.28 }, { u: -3.1, v: 1.28 }] },
            { fill: '#6EE7B7', points: [{ u: -3.3, v: 0.72 }, { u: -3.1, v: 0.72 }, { u: -3.1, v: 1.28 }, { u: -3.3, v: 1.28 }] },
            { fill: '#A7F3D0', points: [{ u: -3.3, v: 1.28 }, { u: -1.1, v: 1.28 }, { u: -1.1, v: 1.4 }, { u: -3.3, v: 1.4 }] },
            { fill: '#FCD34D', points: [{ u: -2.35, v: 0.96 }, { u: -2.05, v: 0.96 }, { u: -2.05, v: 1.04 }, { u: -2.35, v: 1.04 }] },
          ],
          edges: [
            { from: { u: -3.3, v: 0.6 }, to: { u: -1.1, v: 0.6 } },
            { from: { u: -1.1, v: 0.6 }, to: { u: -1.1, v: 0.72 } },
            { from: { u: -1.1, v: 0.72 }, to: { u: -3.1, v: 0.72 } },
            { from: { u: -1.25, v: 0.72 }, to: { u: -1.25, v: 1.28 } },
            { from: { u: -3.1, v: 1.28 }, to: { u: -1.1, v: 1.28 } },
            { from: { u: -1.1, v: 1.28 }, to: { u: -1.1, v: 1.4 } },
            { from: { u: -1.1, v: 1.4 }, to: { u: -3.3, v: 1.4 } },
            { from: { u: -3.3, v: 1.4 }, to: { u: -3.3, v: 0.6 } },
            { from: { u: -3.1, v: 0.72 }, to: { u: -3.1, v: 1.28 } },
            // Bookmark rectangle on front
            { from: { u: -2.35, v: 0.96 }, to: { u: -2.05, v: 0.96 } },
            { from: { u: -2.05, v: 0.96 }, to: { u: -2.05, v: 1.04 } },
            { from: { u: -2.05, v: 1.04 }, to: { u: -2.35, v: 1.04 } },
            { from: { u: -2.35, v: 1.04 }, to: { u: -2.35, v: 0.96 } },
          ],
        },
        PO: {
          polygons: [
            { fill: '#BAE6FD', points: [{ u: -3.3, v: 0.7 }, { u: -3.1, v: 0.7 }, { u: -3.1, v: 3.1 }, { u: -3.3, v: 3.1 }] },
            { fill: '#E0F2FE', points: [{ u: -3.1, v: 0.7 }, { u: -1.1, v: 0.7 }, { u: -1.1, v: 3.1 }, { u: -3.1, v: 3.1 }] },
            { fill: '#FCD34D', points: [{ u: -2.35, v: 3.1 }, { u: -2.05, v: 3.1 }, { u: -2.05, v: 3.55 }, { u: -2.35, v: 3.55 }] },
          ],
          edges: [
            { from: { u: -3.3, v: 0.7 }, to: { u: -1.1, v: 0.7 } },
            { from: { u: -1.1, v: 0.7 }, to: { u: -1.1, v: 3.1 } },
            { from: { u: -1.1, v: 3.1 }, to: { u: -3.3, v: 3.1 } },
            { from: { u: -3.3, v: 3.1 }, to: { u: -3.3, v: 0.7 } },
            { from: { u: -3.1, v: 0.7 }, to: { u: -3.1, v: 3.1 } },
            // Hidden recessed pages inside covers
            { from: { u: -1.25, v: 0.82 }, to: { u: -1.25, v: 2.98 }, dashed: true },
            { from: { u: -3.1, v: 0.82 }, to: { u: -1.25, v: 0.82 }, dashed: true },
            { from: { u: -3.1, v: 2.98 }, to: { u: -1.25, v: 2.98 }, dashed: true },
            // Bookmark sticking out bottom
            { from: { u: -2.35, v: 3.1 }, to: { u: -2.35, v: 3.55 } },
            { from: { u: -2.35, v: 3.55 }, to: { u: -2.05, v: 3.55 } },
            { from: { u: -2.05, v: 3.55 }, to: { u: -2.05, v: 3.1 } },
          ],
        },
        PL: {
          polygons: [
            { fill: '#FDE68A', points: [{ u: 0.7, v: 0.6 }, { u: 3.1, v: 0.6 }, { u: 3.1, v: 1.4 }, { u: 0.7, v: 1.4 }] },
            { fill: '#F59E0B', points: [{ u: 3.1, v: 0.96 }, { u: 3.55, v: 0.96 }, { u: 3.55, v: 1.04 }, { u: 3.1, v: 1.04 }] },
          ],
          edges: [
            { from: { u: 0.7, v: 0.6 }, to: { u: 3.1, v: 0.6 } },
            { from: { u: 3.1, v: 0.6 }, to: { u: 3.1, v: 1.4 } },
            { from: { u: 3.1, v: 1.4 }, to: { u: 0.7, v: 1.4 } },
            { from: { u: 0.7, v: 1.4 }, to: { u: 0.7, v: 0.6 } },
            { from: { u: 0.7, v: 0.72 }, to: { u: 3.1, v: 0.72 } },
            { from: { u: 0.7, v: 1.28 }, to: { u: 3.1, v: 1.28 } },
            // Hidden recessed pages inside spine
            { from: { u: 0.82, v: 0.72 }, to: { u: 0.82, v: 1.28 }, dashed: true },
            { from: { u: 2.98, v: 0.72 }, to: { u: 2.98, v: 1.28 }, dashed: true },
            // Bookmark sticking out right
            { from: { u: 3.1, v: 0.96 }, to: { u: 3.55, v: 0.96 } },
            { from: { u: 3.55, v: 0.96 }, to: { u: 3.55, v: 1.04 } },
            { from: { u: 3.55, v: 1.04 }, to: { u: 3.1, v: 1.04 } },
          ],
        },
      },
    },
  },
];
