"use strict";

import {client, state} from "isoroutes";
import {routes} from "./hello.jsx";

if (client(state.client(location), routes) === false) {
    alert("Route not found");
}
