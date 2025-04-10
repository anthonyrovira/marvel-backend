export type TComic = {
  _id: string;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
};

export type TCharacters = {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: TComic[];
};

export interface ToggleCharacterBody {
  character: TCharacters;
}

export interface FavoriteResponse {
  characters: TCharacters[];
}

export interface ToggleComicBody {
  comic: TComic;
}

export interface FavoriteComicResponse {
  comics: TComic[];
}

export interface FavoritesResponse {
  favorites: {
    characters: TCharacters[];
    comics: TComic[];
  };
}

export interface ClearFavoritesResponse {
  message: string;
  favorites: {
    characters: TCharacters[];
    comics: TComic[];
  };
}
