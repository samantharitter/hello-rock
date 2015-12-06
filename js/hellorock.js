// Hello, rock.

var MIN_ARC = 3;
var MAX_ARC = 120;

// generate a random diamond

// first, pick two endpoints
// pick a random point along line between endpoints to be the "midpoint"

// Given an angle theta, return which quadrant the angle lands in.
function quadrant(theta) {
    if (theta < 90) {
        return 1;
    } else if (theta < 180) {
        return 2;
    } else if (theta < 270) {
        return 3;
    } else {
        return 4;
    }
}

function generateShape() {
    // pick endpoints
    var e1 = [ 0, 0, -2 ];
    var e2 = [ 0, 0, 2 ];

    // get cross section coordinates
    var N = Math.floor((Math.random() * 10) + 3);
    var crossSection = crossSectionCoords(0, 0, 0, 1.5, .2, 1.5, N);

    // compile these into a master list of coords
    var points = "";

    // do endpoints
    points += e1[0] + " " + e1[1] + " " + e1[2] + ", ";
    points += e2[0] + " " + e2[1] + " " + e2[2];

    var faces = "";

    // for debugging: just the cross section face
    var crossFace = "";

    // add cross-section, and faces
    for (var i = 0; i < N; i++) {
        // add vertices
        var point = crossSection[i];
        points += ", " + point[0] + " " + point[1] + " " + point[2];

        // add faces:
        // one from i to (i+1) to endpoint1
        // one from i to (i+1) to endpoint2
        var thisPoint = i + 2;
        var otherPoint;
        if (i == (N - 1)) {
            otherPoint = 2;
        } else {
            otherPoint = i + 3;
        }

        faces += thisPoint + " " + otherPoint + " 0 -1 "; // e1
        faces += thisPoint + " " + otherPoint + " 1 -1 "; // e2

        // debugging
        crossFace += thisPoint + " ";
    }

    crossFace += "-1";
    //$("#rockFace").attr("coordIndex", crossFace);
    //console.log("cross face:");
    //console.log(crossFace);

    // now set the appropriate things!
    $("#rockFace").attr("coordIndex", faces);
    $("#rockCoords").attr("point", points);

    console.log("vertices:");
    console.log(points);
    console.log("faces:");
    console.log(faces);
}

// generate a "shape" as the cross-section at this midpoint:
// pick a random number N of vertices >= 3
// create N segments of random arc, totaling 360
// pick a random radius for each of the N vertices
function crossSectionCoords(Ox,
                            Oy,
                            Oz,
                            radius,
                            rVariance,
                            zVariance,
                            N) {
    var totalArc = 0;

    // This will be an array of arrays
    var coords = [];

    // divide 360 into N random subsections
    for (var i = 0; i < N; i++) {
        var remainingNodes = N - i - 1;
        var arc = 0;

        //arc = 360/N;
        if ((360 - totalArc) == remainingNodes * MIN_ARC) {
            arc = MIN_ARC;
        }

        // calculate a new arc
        var tries = 0;
        while (arc < MIN_ARC) {
            if (tries > 10) {
                arc = MIN_ARC;
                break;
            };
            var arc = (Math.random() * MAX_ARC);

            // if it's too big, reset to 0 so we try again.
            if ((360 - (totalArc + arc)) < (remainingNodes*MIN_ARC)) {
                arc = 0;
            }
            tries += 1;
        }

        totalArc += arc;

        // pick a z-variance
        var variance = (Math.random() * zVariance);
        var newZ = Oz;
        if (Math.random() > .5) {
            newZ += variance;
        } else {
            newZ -= variance;
        }

        // pick a radius
        var newR = radius + (Math.random() * rVariance);

        // calculate coordinates
        coords.push(calculateCoord(Ox, Oy, newZ, newR, totalArc));
    }
    return coords;
}

// Calculate a coordinate
function calculateCoord(Ox, Oy, Oz, radius, totalTheta) {
        var thetaDegrees = totalTheta % 90;
        var theta = thetaDegrees * (Math.PI/180);

        // Start with the "origin"
        var x = Ox;
        var y = Oy;
        var z = Oz;

        // Handle the axes
        if (theta == 0) {
            if (totalTheta == 0 || totalTheta == 360) {
                y += radius;
            } else if (totalTheta == 90) {
                x += radius;
            } else if (totalTheta == 180) {
                y -= radius;
            } else {
                // 270
                x -= radius;
            }
            return [ x, y, z ];
        }

        // which quadrant are we in?
        var quad = quadrant(totalTheta);
        if (quad == 1) {
            x += radius * Math.sin(theta);
            y += radius * Math.cos(theta);
        } else if (quad == 2) {
            x += radius * Math.cos(theta);
            y -= radius * Math.sin(theta);
        } else if (quad == 3) {
            x -= radius * Math.sin(theta);
            y -= radius * Math.cos(theta);
        } else {
            x -= radius * Math.cos(theta);
            y += radius * Math.sin(theta);
        }

        return [ x, y, z ];
}

// generate a list of coordinate points:
// 0 = first endpoint, 1 = second endpoint
// iX, index of Xth vertex, is X = 2

// z coordinate could, in the future, be random along line!
