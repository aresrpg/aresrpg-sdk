export function get_suifren_stats({ stomach, element }: {
    stomach?: number;
    element?: string;
}): {
    [x: string]: string | number;
    feed_level: number;
    food_name: string;
    required_food: number;
    max_feed_level: number;
};
