export function to_chunk_position(position: any): {
    x: number;
    z: number;
};
export function spiral_array(center: any, min_distance: any, max_distance: any): any[];
export function square_array(center: any, max_distance: any): {
    x: number;
    z: number;
}[];
export function compress_chunk({ chunkKey, bounds, rawData, margin }: {
    chunkKey: any;
    bounds: any;
    rawData: any;
    margin: any;
}): {
    chunk_key: any;
    bounds: {
        min: {
            x: any;
            y: any;
            z: any;
        };
        max: {
            x: any;
            y: any;
            z: any;
        };
    };
    compressed_data: string;
    margin: any;
};
export function decompress_chunk(compressed_chunk: any): {
    chunkKey: any;
    bounds: {
        isBox3: boolean;
        min: {
            x: any;
            y: any;
            z: any;
        };
        max: {
            x: any;
            y: any;
            z: any;
        };
    };
    rawData: Uint16Array<ArrayBuffer>;
    margin: any;
};
export function get_compression_stats(chunk: any, compressed_chunk: any): {
    original_size_bytes: number;
    compressed_size_bytes: number;
    compression_ratio: string;
    space_saved_percentage: string;
};
export const CHUNK_SIZE: 100;
