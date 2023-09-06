import cors from 'cors';

const allowedOrigins = [
  'https://localhost:5173',
];

const corsOptions = {
// @ts-ignore
  origin: (origin, callback) => {
    console.log('origin', origin)
    console.log('allowedOrigins.includes(origin)', allowedOrigins.includes(origin))
    if (origin.startsWith('https://stage-app51740302-')) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  regexp: '',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
};

export default cors(corsOptions);
