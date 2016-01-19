# geom-widgets
Embeddable Javascript widgets based on computational geometry ideas. They are:


### Deep Point Sets. 
A _deep point set_ is a set of n points in the plane such that 
the n(n-1)/2 distances between them have n-1 distinct distances with 
one distance occurring 1 time, one distance occuring 2 times, etc. up to n-1 times[1].

Erdos asked whether deep point sets of size n for all positive n exist[2].  
Prior work proved the existence of deep point sets of size up to 8, 
with a deep point set of size 8 given by Palasti[3]. Most of the larger
examples found consist of points placed on a small triangular lattice.

This widget allows the user to arrange points on a triangular lattice to experiment
with the discovery and creation of deep point sets. Most exciting is the possibility of 
finding a new example of 9 or more points, advancing the state of the art on this problem. 

[1] The points must also be in _general position_: no three collinear and no four cocircular.

[2] The answer is easily seen to be "yes" if the requirement of general position is dropped.

[3] I. Palasti, "Lattice-point examples for a question of Erdos", 
    Periodica Mathematica Hungarica, 20(3), 231--235, 1989.


### Minimum Spanning Tree. 
The _minimum spanning tree_ of a set of points is the 
graph connecting the points together with least total edge (Euclidean) length.[1]
This graph is easily seen to be a tree and can be constructed greedily by 
repeatedly taking the shortest edge that does not form a cycle. 

[1] https://en.wikipedia.org/wiki/Euclidean_minimum_spanning_tree 

