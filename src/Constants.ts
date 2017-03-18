////////////////////////////////////////////////////////////////////////
/*                           RUNTIME SETUP                            */
////////////////////////////////////////////////////////////////////////

export let GAME_DEFAULT_SCALE = 50;
export let GAME_FRAME_RATE = 60;
export let GAME_SECOND_DURATION = 1000;
export let GAME_STEP_INTERVAL = GAME_SECOND_DURATION / GAME_FRAME_RATE;

////////////////////////////////////////////////////////////////////////
/*                           VICTORY POINTS                           */
////////////////////////////////////////////////////////////////////////

export let VPS_REQUIRED_FOR_WIN = 10; // Victory Points a player must have to win the game - default is 10
export let LONGEST_ROAD_VPS = 2; // Victory Points awarded for the longest road - default is 2
export let SETTLEMENT_VPS = 1; // Victory Points awarded per settlement - default is 1
export let CITY_VPS = 2; // Victory Points awarded per city - default is 2
export let ROAD_VPS = 0; // Victory Points awarded per road - default is 0

////////////////////////////////////////////////////////////////////////
/*                         BOARD GENERATION                           */
////////////////////////////////////////////////////////////////////////

export let BASE_TOKEN_LIST = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]; // The baseline Catan token list for a standard board - note that this list should have at least 18 values

/* 25 development cards
14 Soldiers/Knights (I'll call them Knights from now on)
5 Victory Points.
2 Road Building Cards.
2 Monopoly Cards.
2 Year of Plenty Cards
*/                                                                           // to work with standard Catan - values greater than 12 or less than 2 will not be rolled
//export let BASE_DEVELOPMENT_CARDS_LIST = [];
////////////////////////////////////////////////////////////////////////
/*                         STRUCTURE PRICES                           */
////////////////////////////////////////////////////////////////////////


/* Resource costs are stored as five element arrays - each index of the array represents a different resource;
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

export let ROAD_COST = [1,0,0,1,0]; // Cost of a road - default is [1,0,0,1,0] (1 Lumber, 1 Brick)
export let SETTLEMENT_COST = [1,1,0,1,1]; // Cost of a settlement - default is [1,1,0,1,1] (1 Lumber, 1 Wool, 1 Brick, 1 Grain)
export let CITY_COST = [0,0,3,0,2]; // Cost of a city - default is [0,0,3,0,2] (3 Ore, 2 Grain)

////////////////////////////////////////////////////////////////////////
/*                      INIT BUILD REQUIREMENTS                       */
////////////////////////////////////////////////////////////////////////

export let FIRST_TURN_HOUSES_AND_ROADS = 1;
export let SECOND_TURN_HOUSES_AND_ROADS = 2;

////////////////////////////////////////////////////////////////////////
/*                         DICE VIEW CONSTANTS                        */
////////////////////////////////////////////////////////////////////////

export let DICE_ROLL_DURATION = 5000;
export let DICE_ROLL_STEPS = 100;
export let DICE_ROLL_MAX = 6;
export let DICE_ROLL_MIN = 1;

////////////////////////////////////////////////////////////////////////
/*                            BANK CONSTANTS                          */
////////////////////////////////////////////////////////////////////////
export let BANKABLE_RESOURCE_COUNT = 4;

////////////////////////////////////////////////////////////////////////
/*                           MOUSE CONSTANTS                          */
////////////////////////////////////////////////////////////////////////
export let MAX_CLICK_MOVEMENT = 4;
export let MAX_TAP_MOVEMENT = 7;



