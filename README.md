# CatanClient

Asynchronous online Catan

## Synopsis

Our project is to create a version of Settlers of Catan, an original board game created by Klaus Teuber.

## How to run the game

To run macSettlers, simply run landing.html in your browser.

## A note on coordinates

Coordinates can be very difficult to work with when applied to hexagons, because a hexagonal grid does not line up the
same way a regular grid does. After some thought, we've elected to use the following system for grid coordinates:

Columns lean diagonally to the right - see the hexagonal grid below, with the x-coordinate of each hex listed:

     / \ / \ / \
    | -2| -1| 0 |
   / \ / \ / \ / \
  | -2| -1| 0 | 1 |
 / \ / \ / \ / \ / \
| -2| -1| 0 | 1 | 2 |
 \ / \ / \ / \ / \ /
  | -1| 0 | 1 | 2 |
   \ / \ / \ / \ /
    | 0 | 1 | 2 |
     \ / \ / \ /

Rows function normally - see the hexagonal grid below, with the y-coordinate of each hex listed:


     / \ / \ / \
    | 2 | 2 | 2 |
   / \ / \ / \ / \
  | 1 | 1 | 1 | 1 |
 / \ / \ / \ / \ / \
| 0 | 0 | 0 | 0 | 0 |
 \ / \ / \ / \ / \ /
  | -1| -1| -1| -1|
   \ / \ / \ / \ /
    | -2| -2| -2|
     \ / \ / \ /

On a default board catan board, the origin is in the center - see below:


     / \ / \ / \
    |   |   |   |
   / \ / \ / \ / \
  |   |   |   |   |
 / \ / \ / \ / \ / \
|   |   | X |   |   |
 \ / \ / \ / \ / \ /
  |   |   |   |   |
   \ / \ / \ / \ /
    |   |   |   |
     \ / \ / \ /

Vertices require a different system. Each hex has six vertices, one at each corner - see below:
    x
  /   \
 /     \
x       x
|       |
|       |
x       x
 \     /
  \   /
    x
The coordinate system for vertices is similar to that of the hexes, except that the columns are made up of the right
leaning edges of hexes, rather than right leaning columns of hexagons - see below:


        e
      /   \
     /     \
    d       j         a - (0, -1)
    | (0,1) |         b - (0, 0)
    |       |         c - (0, 1)
    c       i         d - (0, 2)
  /   \   /           e - (0, 3)
 /     \ /
b       h             f - (1, -2)
| (0,0) |             g - (1, -1)
|       |             h - (1, 0)
a       g             i - (1, 1)
 \     /              j - (1, 2)
  \   /
    f

The origin vertex is the upper left vertex of the origin hex (b in the above diagram).

Within the code, vertices() can be used to get all the vertices adjacent to a specific hex, and adjacentHexes() can be
used to get the hexes that have a specific vertex as one of their vertices. Both methods can be found in Grid.js.

## Current Bugs


## Authors

* Mack Hartley
* Carsten Haas
* Hunter Herman
* Stephanie Duong

## Acknowledgements

Massive thanks to Professor Bret Jackson, preceptors, and the Software Design and Development class (COMP 225-03) for all their insight, support, and camaraderie.
