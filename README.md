# MacSettlers

You can play MacSettlers online at https://hherman1.github.io/CatanClient

## Synopsis

Our main project goal is to create a version of Settlers of Catan, an original board game created by Klaus Teuber. More specifically, our product--MacSettlers--is a multiplayer web game that allows gamers to play endless rounds of Settlers together!

The main purpose of this software project is to learn about software development and work as a team to produce a minimum viable product for our computer science course, COMP 225 Software Design and Development, taught by Professor Bret Jackson. Through this project, we practice becoming self-starters, learning JavaScript/CSS/HTML and dissecting the original game logic and design to build our website. Another motivation behind this project is to provide users in our community with an alternative option to the original Settlers of Catan game (the latter being expensive to acquire). MacSettlers is free and easy to use on a PC or Macintosh laptop/desktop and supports Google Chrome and Safari.

## How to run the game

Note: To run MacSettlers, you will need to have Google Chrome or Safari to run the game in the browser.

1. Download our repository
2. Open the index.html file.


## Architecture

MacSettler's follows the MVC pattern.

###Framework

* JQuery (front-end)
* CSS, HTML (front-end)

###Testing

* Google Chrome Developer Tools

### Quick Modification

Players wishing to quickly modify aspects of the game - e.g. victory point requirements, longest road rewards, etc. - can modify the values in the Constants.js file.

We recognize that there are many features we have not yet implemented - if you feel that any missing features have unbalanced portions of the game - or if you just want to change the rules - we encourage you to modify the constants however you wish

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
