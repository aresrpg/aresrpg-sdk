export function to_chunk_position(position: any): {
    x: number;
    z: number;
};
export function spiral_array(center: any, min_distance: any, max_distance: any): any[];
export function square_array(center: any, max_distance: any): {
    x: number;
    z: number;
}[];
export function compress_chunk_column(chunks: any): {
    column_key: any;
    chunks_metadata: any;
    chunk_lengths: any;
    compressed_data: string;
};
export function decompress_chunk_column(compressed_column: any): any;
export function get_column_compression_stats(chunks: any, compressed_column: any): {
    original_size_bytes: any;
    compressed_size_bytes: number;
    compression_ratio: string;
    space_saved_percentage: string;
};
export const CHUNK_SIZE: 100;
