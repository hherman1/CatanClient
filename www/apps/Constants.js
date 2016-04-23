////////////////////////////////////////////////////////////////////////
/*                           RUNTIME SETUP                            */
////////////////////////////////////////////////////////////////////////

GAME_DEFAULT_SCALE = 50;
GAME_FRAME_RATE = 60;
GAME_SECOND_DURATION = 1000;
GAME_STEP_INTERVAL = GAME_SECOND_DURATION / GAME_FRAME_RATE;

////////////////////////////////////////////////////////////////////////
/*                           VICTORY POINTS                           */
////////////////////////////////////////////////////////////////////////

VPS_REQUIRED_FOR_WIN = 10; // Victory Points a player must have to win the game - default is 10
LONGEST_ROAD_VPS = 2; // Victory Points awarded for the longest road - default is 2
SETTLEMENT_VPS = 1; // Victory Points awarded per settlement - default is 1
CITY_VPS = 2; // Victory Points awarded per city - default is 2
ROAD_VPS = 0; // Victory Points awarded per road - default is 0

////////////////////////////////////////////////////////////////////////
/*                         BOARD GENERATION                           */
////////////////////////////////////////////////////////////////////////

BASE_RESOURCE_LIST = // The baseline Catan resource list for a standard board - note that this list should have at least 19 elements to work with standard Catan
    [Resource.Desert,  Resource.Grain, Resource.Grain, Resource.Grain,
        Resource.Grain, Resource.Wool, Resource.Wool, Resource.Wool,
        Resource.Wool, Resource.Lumber, Resource.Lumber, Resource.Lumber,
        Resource.Lumber, Resource.Ore, Resource.Ore, Resource.Ore,
        Resource.Brick, Resource.Brick, Resource.Brick];
BASE_TOKEN_LIST = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]; // The baseline Catan token list for a standard board - note that this list should have at least 18 values
                                                                               // to work with standard Catan - values greater than 12 or less than 2 will not be rolled

////////////////////////////////////////////////////////////////////////
/*                         STRUCTURE PRICES                           */
////////////////////////////////////////////////////////////////////////


/* Resource costs are stored as five element arrays - each index of the array represents a different resource,
 * and the number at that index represents the number of that resource.
 * ________________
 * Resource | Index
 * Lumber   | 0
 * Wool     | 1
 * Ore      | 2
 * Brick    | 3
 * Grain    | 4
 * ________________
 *
 * For example, [0,0,3,0,2] would correspond to 3 Ore, 2 Grain - the default price of a city
 */

ROAD_COST = [1,0,0,1,0]; // Cost of a road - default is [1,0,0,1,0] (1 Lumber, 1 Brick)
SETTLEMENT_COST = [1,1,0,1,1]; // Cost of a settlement - default is [1,1,0,1,1] (1 Lumber, 1 Wool, 1 Brick, 1 Grain)
CITY_COST = [0,0,3,0,2]; // Cost of a city - default is [0,0,3,0,2] (3 Ore, 2 Grain)
