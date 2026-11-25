export type SceneThemeName = 'medical' | 'kitchen' | 'workshop' | 'shop' | 'school' | 'office';

/** Le décor de la scène, choisi d'après les mots du lieu de travail. */
export interface SceneTheme {
  name: SceneThemeName;
  props: readonly [string, string];
  keywords: readonly string[];
}
