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
The _minimum spanning tree (MST)_ of a set of points is the 
graph connecting the points together with least total edge (Euclidean) length.[1]
This graph is easily seen to be a tree and can be constructed greedily by 
repeatedly taking the shortest edge that does not form a cycle. 

This widget maintains the MST of a point set that the user can dynamically change.

[1] https://en.wikipedia.org/wiki/Euclidean_minimum_spanning_tree 


### Spanners 
Given a set of points, the _complete (Euclidean directed) geometric graph_ 
consists of an edge connecting each pair of points, weighted by the 
Euclidean distance between them.

The _Yao-6 graph_[1] is a subgraph of the complete geometric graph, where the angle
around each point is partitioned into 6 60-degree wedges and is connected 
to the closest point in each wedge via a directed edge from the point.
Similarly, the _YaoYao-6 graph_ is a a subgraph of the Yao-6 graph, where a point
may only have a single incoming edge per wedge.

Similar graphs that use other criteria for selecting the point in each wedge 
have also been studied. For instance, the _Theta-6 graph_[2] selects the closest
point in the direction of the wedge's bisector. As with te YaoYao-6 graph, the 
_Theta-Theta-6_ graph is a restriction of the Theta-6 graph where only the incoming
edge from the "closest" (in the bisection direction) point is kept.

Prior work has studied whether YaoYao-k and Theta-Theta-k graphs for certain values
of k are _spanners_: the distance in the graph between two points is always at most some 
fixed constant factor larger than the Euclidean distance between the points.
If so, the _spanning ratio_ is an upper bound on this factor.
See [3] for a summary of known results on the spanning properties of these graphs, 
including the following:
* Theta-6 graphs have a spanning ratio of 2.
* It is open whether Theta-Theta-6 graphs are spanners.
* Yao-Yao-6 graphs are not spanners. 

This widget maintains the Theta-6, Theta-Theta-6, and Yao-Yao-6 graphs of a set
of points that the user maintains. Intuition about these complex graphs can be gained, 
and there is the possibility of resolving the open problem of whether Theta-Theta-6 graphs 
are spanners by construction of a family of counterexamples.

[1] https://en.wikipedia.org/wiki/Yao_graph

[2] https://en.wikipedia.org/wiki/Theta_graph

[3] M. Damian, D. V. Voicu, "Spanning properties of Theta-Theta Graphs", 
    available on arXiv: http://arxiv.org/abs/1407.3507


