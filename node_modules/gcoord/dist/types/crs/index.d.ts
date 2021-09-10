export declare enum CRSTypes {
    WGS84 = "WGS84",
    WGS1984 = "WGS84",
    EPSG4326 = "WGS84",
    GCJ02 = "GCJ02",
    AMap = "GCJ02",
    BD09 = "BD09",
    BD09LL = "BD09",
    Baidu = "BD09",
    BMap = "BD09",
    BD09MC = "BD09MC",
    BD09Meter = "BD09MC",
    EPSG3857 = "EPSG3857",
    EPSG900913 = "EPSG3857",
    EPSG102100 = "EPSG3857",
    WebMercator = "EPSG3857",
    WM = "EPSG3857"
}
export interface CRS {
    to: {
        [key in keyof typeof CRSTypes]?: Function;
    };
}
export declare const WGS84: CRS;
export declare const GCJ02: CRS;
export declare const BD09: CRS;
export declare const EPSG3857: CRS;
export declare const BD09MC: CRS;
export declare const crsMap: Record<CRSTypes, CRS>;
export default crsMap;
