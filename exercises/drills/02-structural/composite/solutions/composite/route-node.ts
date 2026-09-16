/** Component: every node in the network, leaf or composite, answers the
 *  same question the same way. */
export interface RouteNode {
  totalMinutes(): number;
}
