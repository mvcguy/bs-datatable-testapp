
import "./css/site.css"
import { DynamicDemo } from "./dynamic-demo";
import {StaticDemo} from "./static-demo"

export class BSDataTableDemos{

    static runStaticDemo() {
        StaticDemo.run();
    }

    static runDynamicDemo(){
        DynamicDemo.run();
    }

}


