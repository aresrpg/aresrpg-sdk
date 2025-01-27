export function to_chunk_position(position: any): {
    x: number;
    z: number;
};
export function spiral_array(center: any, min_distance: any, max_distance: any): any[];
export function square_array(center: any, max_distance: any): {
    x: number;
    z: number;
}[];
export function encode_run_length(raw_data: any): Uint16Array<ArrayBuffer>;
export function decode_run_length(encoded_data: any): Uint16Array<ArrayBuffer>;
export function compress_chunk_column(chunks: any): Promise<string>;
export function decompress_chunk_column(compressed_payload: string): Promise<Chunk[]>;
export function get_compression_stats(chunks: any, compressed_payload: any): {
    original_size_bytes: any;
    compressed_size_bytes: number;
    compression_ratio: string;
    space_saved_percentage: string;
};
export const CHUNK_SIZE: 64;
export type ChunkBounds = {
    isBox3: boolean;
    min: number;
    max: number;
};
export type Chunk = {
    chunkKey: string;
    bounds: ChunkBounds;
    rawData: Uint16Array;
    margin: number;
};
