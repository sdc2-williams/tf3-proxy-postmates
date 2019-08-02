import http from 'k6/http';
import { sleep } from 'k6';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const options = {
  vus: 50,
  duration: '2m',
  rps: 1000
};

export default function() {
  http.get(`http://localhost:8888/${randomInt(9999000, 10000000)}/`);
};