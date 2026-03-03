import { Coordinates, Qibla } from 'adhan';
import { MECCA_LAT, MECCA_LNG } from './constants';

export function getQiblaDirection(lat: number, lng: number): number {
  const coordinates = new Coordinates(lat, lng);
  return Qibla(coordinates);
}

export function getDistanceToMecca(lat: number, lng: number): number {
  // Haversine formula
  const R = 6371; // Earth radius in km
  const dLat = toRad(MECCA_LAT - lat);
  const dLng = toRad(MECCA_LNG - lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat)) * Math.cos(toRad(MECCA_LAT)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
