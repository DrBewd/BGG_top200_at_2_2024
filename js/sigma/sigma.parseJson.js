// Scott Hale (Oxford Internet Institute)
// Requires sigma.js and jquery to be loaded
// based on parseGexf from Mathieu Jacomy @ Sciences Po Médialab & WebAtlas

sigma.publicPrototype.parseJson = function(jsonPath, callback) {
    var sigmaInstance = this;
    jQuery.getJSON(jsonPath, function(data) {
        var edgeFrequency = {};

        // First, let's calculate the frequency for each edge (by source and target)
        for (var i = 0; i < data.edges.length; i++) {
            var edge = data.edges[i];
            var source = edge.source;
            var target = edge.target;
            var edgeId = edge.id;

            // Create a unique key for each connection (source -> target)
            var edgeKey = source + "-" + target;
            var reverseEdgeKey = target + "-" + source; // handle undirected edges

            // Count the occurrences of each connection
            edgeFrequency[edgeKey] = (edgeFrequency[edgeKey] || 0) + 1;
            if (source !== target) {
                edgeFrequency[reverseEdgeKey] = (edgeFrequency[reverseEdgeKey] || 0) + 1; // count reverse edge too if it's undirected
            }
        }

        // Now, update the size based on frequency (use frequency to set edge size)
        for (var j = 0; j < data.edges.length; j++) {
            var edge = data.edges[j];
            var source = edge.source;
            var target = edge.target;

            // Create the edge key to access frequency count
            var edgeKey = source + "-" + target;
            var reverseEdgeKey = target + "-" + source;

            // Set the size based on the frequency count
            var frequency = edgeFrequency[edgeKey] || 0;
            edge.size = frequency * 2; // Adjust multiplier as needed (for visualization purposes)

            // Optionally, you could use reverseEdgeKey if you want undirected edges to share size based on mutual frequency
        }

        // Now, add nodes and edges to the sigma instance
        for (var i = 0; i < data.nodes.length; i++) {
            var node = data.nodes[i];
            sigmaInstance.addNode(node.id, node);
        }

        for (var j = 0; j < data.edges.length; j++) {
            var edge = data.edges[j];
            sigmaInstance.addEdge(edge.id, edge.source, edge.target, edge);
        }

        if (callback) callback.call(this); // Trigger the data ready function
    }); // End of jQuery getJSON function
}; // End of sigma.parseJson function
