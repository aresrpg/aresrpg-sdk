export function to_chunk_position(position: any): {
    x: number;
    z: number;
};
export function spiral_array(center: any, min_distance: any, max_distance: any): any[];
export function square_array(center: any, max_distance: any): {
    x: number;
    z: number;
}[];
/**
 * Compresses a column of chunks with optimized memory usage
 * @param {Chunk[]} chunks
 * @returns {Promise<string>}
 */
export function compress_chunk_column(chunks: Chunk[]): Promise<string>;
/**
 * Decompresses a base64 encoded chunk column back into an array of chunks
 * @param {string} compressed_payload
 * @returns {Promise<Chunk[]>}
 */
export function decompress_chunk_column(compressed_payload: string): Promise<Chunk[]>;
export const CHUNK_SIZE: 64;
export type Box3 = {
    isBox3: boolean;
    min: {
        x: number;
        y: number;
        z: number;
    };
    max: {
        x: number;
        y: number;
        z: number;
    };
};
export type Vector2 = {
    x: number;
    z: number;
};
export type ChunkMetadata = {
    chunkKey?: string;
    bounds: Box3;
    margin?: number;
    isEmpty?: boolean;
};
export type Chunk = {
    metadata: ChunkMetadata;
    rawdata: Uint16Array;
};
export type ChunkBuffer = {
    pos: Vector2;
    content: Uint16Array;
};
