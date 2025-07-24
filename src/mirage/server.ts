import { createServer, Model, Factory, Response } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      song: Model,
    },

    factories: {
      song: Factory.extend({
        id() {
          return uuidv4();
        },
        title(i: number) {
          const titles = [
            'Bohemian Rhapsody', 'Stairway to Heaven', 'Hotel California', 'Imagine',
            'Sweet Child O\' Mine', 'Billie Jean', 'Like a Rolling Stone', 'Smells Like Teen Spirit',
            'Purple Haze', 'Good Vibrations', 'Respect', 'Hey Jude', 'What\'s Going On',
            'Born to Run', 'London Calling', 'Thriller', 'The Sound of Silence',
            'Yesterday', 'A Day in the Life', 'Satisfaction'
          ];
          return titles[i % titles.length];
        },
        artist(i: number) {
          const artists = [
            'Queen', 'Led Zeppelin', 'Eagles', 'John Lennon', 'Guns N\' Roses',
            'Michael Jackson', 'Bob Dylan', 'Nirvana', 'Jimi Hendrix', 'The Beach Boys',
            'Aretha Franklin', 'The Beatles', 'Marvin Gaye', 'Bruce Springsteen',
            'The Clash', 'Michael Jackson', 'Simon & Garfunkel', 'The Beatles',
            'The Beatles', 'The Rolling Stones'
          ];
          return artists[i % artists.length];
        },
        album(i: number) {
          const albums = [
            'A Night at the Opera', 'Led Zeppelin IV', 'Hotel California', 'Imagine',
            'Appetite for Destruction', 'Thriller', 'Highway 61 Revisited', 'Nevermind',
            'Are You Experienced', 'Pet Sounds', 'I Never Loved a Man', 'Abbey Road',
            'What\'s Going On', 'Born to Run', 'London Calling', 'Thriller',
            'The Sound of Silence', 'Yesterday and Today', 'Sgt. Pepper\'s', 'Out of Our Heads'
          ];
          return albums[i % albums.length];
        },
        year() {
          return Math.floor(Math.random() * (2023 - 1960) + 1960);
        },
        genre(i: number) {
          const genres = [
            'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic',
            'Country', 'R&B', 'Folk', 'Blues', 'Reggae', 'Metal'
          ];
          return genres[i % genres.length];
        },
        duration() {
          return Math.floor(Math.random() * (360 - 120) + 120); // 2-6 minutes
        },
        createdAt() {
          return new Date().toISOString();
        },
        updatedAt() {
          return new Date().toISOString();
        },
      }),
    },

    seeds(server) {
      server.createList('song', 50);
    },

    routes() {
      this.namespace = 'api';

      // Get paginated songs
      this.get('/songs', (schema, request) => {
        const page = parseInt(request.queryParams.page) || 1;
        const limit = parseInt(request.queryParams.limit) || 10;
        const offset = (page - 1) * limit;

        const allSongs = schema.all('song').models;
        const total = allSongs.length;
        const totalPages = Math.ceil(total / limit);
        const songs = allSongs.slice(offset, offset + limit);

        return {
          data: songs,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        };
      });

      // Get single song
      this.get('/songs/:id', (schema, request) => {
        const id = request.params.id;
        const song = schema.find('song', id);
        
        if (!song) {
          return new Response(404, {}, { message: 'Song not found' });
        }
        
        return song;
      });

      // Create song
      this.post('/songs', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const song = schema.create('song', {
          ...attrs,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        return song;
      });

      // Update song
      this.put('/songs/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const song = schema.find('song', id);
        
        if (!song) {
          return new Response(404, {}, { message: 'Song not found' });
        }
        
        song.update({
          ...attrs,
          updatedAt: new Date().toISOString(),
        });
        
        return song;
      });

      // Delete song
      this.delete('/songs/:id', (schema, request) => {
        const id = request.params.id;
        const song = schema.find('song', id);
        
        if (!song) {
          return new Response(404, {}, { message: 'Song not found' });
        }
        
        song.destroy();
        return new Response(204);
      });

      // Handle preflight requests
      this.options('/*', () => {
        return new Response(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
      });
    },
  });
}

// Auto-start the server in development
if (process.env.NODE_ENV === 'development') {
  makeServer();
}