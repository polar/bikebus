


function bottomLeft(accumulated: number[], coordinates: number[]) {
    return [Math.min(accumulated[0], coordinates[0]), Math.min(accumulated[1], coordinates[1])]
}

function topRight(accumulated: number[], coordinates: number[]) {
    return [Math.max(accumulated[0], coordinates[0]), Math.max(accumulated[1], coordinates[1])]
}

function bottomLeftLine(accumulated: number[], coordinates: number[][]) {
    return coordinates.reduce((a,c) => bottomLeft(a,c), accumulated)
}

function topRightLine(accumulated: number[], coordinates: number[][]) {
    return coordinates.reduce((a,c) => topRight(a,c), accumulated)
}

function bottomLeftGeometry(accumulated: number[], geometry: any) {
    if (geometry.type === 'Point') {
        return bottomLeft(accumulated, geometry.coordinates)
    } else if (geometry.type === 'LineString') {
        return bottomLeftLine(accumulated, geometry.coordinates)
    } else if (geometry.type === 'MultiLineString') {
        return geometry.coordinates.reduce((a:any,c:any) => bottomLeftLine(a, c), accumulated)
    } else if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.reduce((a:any,c:any) => bottomLeftLine(a, c), accumulated)
    } else if (geometry.type === 'MultiPoint') {
        return geometry.coordinates.reduce((a:any,c:any) => bottomLeftLine(a, c), accumulated)
    } else if (geometry.type === 'GeometryCollection') {
        return geometry.geometries.reduce((a:any,c:any) => bottomLeftGeometry(a, c), accumulated)
    }
}

function topRightGeometry(accumulated: number[], geometry: any) {
    if (geometry.type === 'Point') {
        return topRight(accumulated, geometry.coordinates)
    } else if (geometry.type === 'LineString') {
        return topRightLine(accumulated, geometry.coordinates)
    } else if (geometry.type === 'MultiLineString') {
        return geometry.coordinates.reduce((a:any,c:any) => topRightLine(a, c), accumulated)
    } else if (geometry.type === 'MultiPolygon') {
        return geometry.coordinates.reduce((a:any,c:any) => topRightLine(a, c), accumulated)
    } else if (geometry.type === 'MultiPoint') {
        return geometry.coordinates.reduce((a:any,c:any) => topRightLine(a, c), accumulated)
    } else if (geometry.type === 'GeometryCollection') {
        return geometry.geometries.reduce((a:any,c:any) => topRightGeometry(a, c), accumulated)
    }
}
function bottomLeftFeature(accumulated: number[], feature: any): number[] {
    return bottomLeftGeometry(accumulated,  feature.geometry);
}

function topRightFeature(accumulated: number[], feature: any): number[] {
    return topRightGeometry(accumulated,  feature.geometry);
}

function bottomLeftFeatures(accumulated: number[], features: any[]): number[] {
    return features.reduce((a,c) =>  bottomLeftFeature(a,c), accumulated)
}

function topRightFeatures(accumulated: number[], features: any[]): number[] {
    return features.reduce((a,c) => topRightFeature(a,c), accumulated)
}

function bottomLeftBounds(features: any[]): number[] {
    return bottomLeftFeatures([Infinity,Infinity], features)
}

function topRightBounds(features:any[]): number[] {
    return topRightFeatures([-Infinity, -Infinity], features)
}


export function getBounds(geojson: any) : number[][] {
    if (Array.isArray(geojson)) {
        return [bottomLeftBounds(geojson), topRightBounds(geojson)]
    }
    if (geojson.type === "FeatureCollection") {
        return getBounds(geojson.features)
    }
    if (geojson.type === "Feature") {
        return [bottomLeftBounds([geojson]), topRightBounds([geojson])]
    }
    return [[-Infinity, -Infinity], [Infinity, Infinity]]
}
