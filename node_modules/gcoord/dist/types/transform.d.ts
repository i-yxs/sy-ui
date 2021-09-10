import { Position, GeoJSON } from './geojson';
import { CRSTypes } from './crs';
/**
 * transform
 *
 * @param {geojson|position|string} input
 * @returns {geojson|position} output
 */
export default function transform<T extends GeoJSON | Position>(input: T | string, crsFrom: CRSTypes, crsTo: CRSTypes): T;
