export function get_vaporeon_stats(context: any, vaporeon: any): Promise<{
    movement: number;
    chance: number;
    last_feed: any;
    feed_level: BN;
    max_feed_level: number;
    food_name: string;
    required_food: number;
}>;
import { BigNumber as BN } from 'bignumber.js';
