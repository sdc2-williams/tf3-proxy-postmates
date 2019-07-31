import http from 'k6/http';
import { sleep } from 'k6';

const randomInt = function(min, max) {
  Math.random() * (max - min) + min;
};

export const options = {
  vus: 1,
  duration: '2m',
  rps: 1000
};

export default function() {
  http.get(`http://localhost:8888/${randomInt(9999000, 10000000)}/`);
  // sleep(0.01); // configure to change RPS (currently at 100)
};