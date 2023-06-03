/*
* Functions in this file were borrowed from the core Starfinder game implementation.
* Available at https://github.com/foundryvtt-starfinder/foundryvtt-starfinder
*/

/**
 * Measure the distance between two pixel coordinates
 * See BaseGrid.measureDistance for more details
 *
 * @param segments
 * @param options
 */
export const measureDistances = (segments, options = {}) => {
    if (!options.gridSpaces) return BaseGrid.prototype.measureDistances.call(this, segments, options);

    // Track the total number of diagonals
    const diagonalRule = game.settings.get("sfrpgbb", "diagonalMovement");
    const state = { diagonals: 0 };

    // Iterate over measured segments
    return segments.map((s) => measureDistance(null, null, { ray: s.ray, diagonalRule, state }));
};

/**
 * Measure distance between two points.
 *
 * @param {Point} p0 Start point on canvas
 * @param {Point} p1 End point on canvas
 * @param {object} options Measuring options.
 * @param {"5105"|"555"} [options.diagonalRule] Used diagonal rule. Defaults to 5/10/5
 * @param {Ray} [options.ray] Pre-generated ray to use instead of the points.
 * @param {MeasureState} [options.state] Optional state tracking across multiple measures.
 *
 * @returns {number} Grid distance between the two points.
 */
export const measureDistance = (
    p0,
    p1,
    { ray = null, diagonalRule = "5105", state = { diagonals: 0, cells: 0 } } = {}
) => {

    ray ??= new Ray(p0, p1);
    const gs = canvas.dimensions.size,
        nx = Math.ceil(Math.abs(ray.dx / gs)),
        ny = Math.ceil(Math.abs(ray.dy / gs));

    // Get the number of straight and diagonal moves
    const nDiagonal = Math.min(nx, ny),
        nStraight = Math.abs(ny - nx);

    state.diagonals += nDiagonal;

    let cells = 0;

    if (diagonalRule === "5105") {
        const nd10 = Math.floor(state.diagonals / 2) - Math.floor((state.diagonals - nDiagonal) / 2);
        cells = nd10 * 2 + (nDiagonal - nd10) + nStraight;
    } else if (diagonalRule === "555") {
        cells = nStraight + nDiagonal;
    } else if (diagonalRule === "EUCL") {
        cells = Math.hypot(nx, ny);
    } else if (diagonalRule === "EUC5") {
        cells = Math.round(Math.hypot(nx, ny));
    }

    state.cells += cells;
    return cells * canvas.dimensions.distance;
};