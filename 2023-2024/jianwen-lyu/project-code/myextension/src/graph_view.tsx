import { 
    ReactWidget
} from '@jupyterlab/apputils';
import React, {useEffect} from 'react';
import {
    License,
    GraphComponent,
    GraphViewerInputMode,
    ShapeNodeStyle,
    IGraph,
    INode,
    Rect
} from 'yfiles'
import { HierarchicLayout } from 'yfiles/layout-hierarchic';


import '../style/index.css' 
import { ModelComponent } from './model_component';


License.value = {
    "comment": "92f5ffb6-ee85-40bd-82f2-a599e98b95e0",
    "date": "04/03/2024",
    "distribution": false,
    "domains": [
    "*"
    ],
    "expires": "06/03/2024",
    "fileSystemAllowed": true,
    "licensefileversion": "1.1",
    "localhost": true,
    "oobAllowed": true,
    "package": "complete",
    "product": "yFiles for HTML",
    "type": "eval",
    "version": "2.6",
    "watermark": "yFiles HTML Evaluation License (expires in ${license-days-remaining} days)",
    "key": "a60543c90ed38654dcde0c4a62ed45160845d828"
}

let graphic_components:ModelComponent[] = [];

export class GraphPanel extends ReactWidget
{
    constructor(components:ModelComponent[])
    {
        super();
        // create a div component for graphics
        this.addClass('jp-graphics-panel');

        // add components
        graphic_components = components;
    }

    public clear()
    {
        const el = document.getElementById('graphics');
        el?.parentNode?.removeChild(el);
    }

    public render() 
    {
        return <LoadGraphicContainer />;
    }
}

function LoadGraphicContainer() {
    useEffect(() => {
        LoadGraphics();
      }, []); 
    
    return (
      <div id="graphics" className='jp-graphics'>
        <script type="module" src="graphics.js"/>
      </div>
    );
}

function LoadGraphics()
{
    // stage 1: find all markdowns, by depth link them
    const tcomp = graphic_components;
    console.log(tcomp);
    const root:ModelComponent[] = [];
        
    const graphicComponent = new GraphComponent("#graphics");
    const inputModeView = new GraphViewerInputMode();
    const graph = graphicComponent.graph;
    inputModeView.moveViewportInputMode.enabled = true;

    graphicComponent.inputMode = inputModeView;

    // clear early contents
    graph.clear();

    // create start point
    tcomp.forEach(component => {
        if (component.depth == 0)
        {
            root.push(component);
        }
    })

    // create structure for components
    LoadComponentsToGraph(root, graph);

    // render the graph
    //console.log("components loading...", graphicComponent);
    graphicComponent.fitGraphBounds();
}

// tree structure: 
// 1) link first depth=0 component with start
// 2) if found 2 copmonents with same depth, link them together by order.
// 3) if found copmonents with child, link them.
function LoadComponentsToGraph(components:ModelComponent[], graph:IGraph)
{
    // all graph components:
    let graphNodes:INode[] = []
    const depths:number[] = [];

    // layout
    const layout = new HierarchicLayout({layoutOrientation: 'top-to-bottom'});

    // start point
    const start = graph.createNode(new Rect(0, 0, 20, 20));
    const circleStyle = new ShapeNodeStyle({
        shape: 'ellipse', 
        fill: 'black', 
        stroke: 'black'
      });
    graph.setStyle(start, circleStyle);
    graphNodes.push(start);

    //let pg = start;
    let pc = components[0];
    //let isFoundLast = false;

    // get all components in a list
    for (let i = 0; i < components.length; i++)
    {
        let lastg = graphNodes[graphNodes.length - 1];
        let g = GetComponents(components[i], graphNodes, depths, graph);
    
        if (lastg && components[i].tag == "Sequential")
        {
            graph.createEdge(lastg, g);
        }
        else
        {
            graph.createEdge(start, g);
            // remove elements after g
            let index = graphNodes.indexOf(g);
            graphNodes = graphNodes.slice(0, index);   
        }

        console.log("last number title: ", pc.componentTitle);

    } 

    graph.applyLayout(layout);
        
}

// make a graph of one component and its children, and link parent with children 
function GetComponents(component:ModelComponent, graphNodes:INode[], depths:number[], graph:IGraph) : INode
{
    // configurate this node
    const g = graph.createNode(new Rect(0, 0, 300, 100));
    const label = graph.addLabel(g, component.componentTitle);
    graph.setNodeLayout(g, new Rect(0, 0, label.layout.width + 20, (label.layout.width < 150) ? (label.layout.width - 30) : (100)));
    graphNodes.push(g);
    depths.push(component.depth);

    // for children
    if (component.childList.length != 0)
    {
        const clist = component.childList;
        let isFoundLast = false;
        let prev_component = component;
        let prev_graphic = g;

        for(let i = 0; i < clist.length; i++)
        {
            const cg = GetComponents(clist[i], graphNodes, depths, graph);
            if ((prev_component.tag == "Sequential") && (clist[i].tag == "Sequential"))
            {
                isFoundLast = true;
                graph.createEdge(prev_graphic, cg);
                prev_component = clist[i];
                prev_graphic = cg;
            }
            else if (clist[i].tag == "Sequential")
            {
                isFoundLast = true;
                (prev_component == component) ? graph.createEdge(g, cg) : graph.createEdge(prev_graphic, cg);
                prev_component = clist[i];
                prev_graphic = cg;
            }   
            else
            {
                graph.createEdge(g, cg);
            }
            
            if (!isFoundLast)
            {
                prev_component = clist[i];
                prev_graphic = cg;
            }
        }
    }

    return g;
}
