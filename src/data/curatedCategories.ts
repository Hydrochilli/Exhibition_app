// src/data/curatedCategories.ts

export interface Category {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    query: string;
    subcategories?: Category[];
  }
  
  export const curatedCategories: Category[] = [
    {
      id: 'themes',
      title: 'Themes',
      description: 'Curated thematic collections.',
      
      query: 'themes',
      subcategories: [
        {
            id: 'art',
            title: 'Art',
            description: 'Explore hand-crafted written materials from papyrus to paper. Discover texts, illuminations and the people behind them from antiquity to the early print era. ',
            imageUrl: 'https://api.europeana.eu/thumbnail/v3/400/06f296d44324b00c07004df0e9dba64a',
            query: 'manuscripts',
          },
          {
          id: 'archaeology',
          title: 'Archaeology',
          description: 'Explore artefacts and excavations, and discover archaeologists and their study of human history and prehistory.',
          imageUrl: 'https://api.europeana.eu/thumbnail/v3/400/73c3f63a19a8b77238770073fb72bdd4',
          query: 'archaeology',
        //   subcategories: [
        //     {
        //       id: 'football',
        //       title: 'Football',
        //       description: 'Discover football-themed collections.',
        //       imageUrl: 'https://example.com/images/football.jpg',
        //       query: 'football',
        //     },
        //     {
        //       id: 'basketball',
        //       title: 'Basketball',
        //       description: 'Collections on basketball.',
        //       imageUrl: 'https://example.com/images/basketball.jpg',
        //       query: 'basketball',
        //     },
        //     // More subcategories for "Sport"
        //   ],
        },
        {
          id: 'manuscripts',
          title: 'Manuscripts',
          description: 'Explore hand-crafted written materials from papyrus to paper. Discover texts, illuminations and the people behind them from antiquity to the early print era. ',
          imageUrl: 'https://images.ctfassets.net/i01duvb6kq77/7nF2ZQ4kFe0BQqFlg6XP6J/994bd2b19d4b8262b07ba5467808be0c/Two-knights.jpg?w=1100&q=80&fm=jpg&fl=progressive',
          query: 'manuscripts',
        },
        {
            id: 'newspapers',
            title: 'Newspapers',
            description: 'Explore printed publications from 1618 to the 1980s. Discover headlines, full-text articles, advertisements, and the writers behind them.',
            imageUrl: 'https://api.europeana.eu/thumbnail/v3/400/aed540f706c8d61e5600cf1dc2217c6f',
            query: 'newspapers',
          },
          {
            id: 'photography',
            title: 'Photography',
            description: 'Explore the history of photography, discover incredible images and find out about the photographers behind them.',
            imageUrl: 'https://api.europeana.eu/thumbnail/v3/400/ff41e825e29885bfc59bb8eb4cc741e7',
            query: 'photography',
          },
        // Additional subcategories under Themes...
      ],
    },
    {
      id: 'topics',
      title: 'Topics',
      description: 'Explore various topics.',
      imageUrl: 'https://example.com/images/topics.jpg',
      query: 'topics',
      // You can add subcategories here as needed
    },
    {
      id: 'exhibitions',
      title: 'Exhibitions',
      description: 'Current exhibitions curated for you.',
      imageUrl: 'https://example.com/images/exhibitions.jpg',
      query: 'exhibitions',
    },
  ];
  