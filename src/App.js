import './App.css';
import { useState, useContext, createContext } from 'react';

const matrix = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, /*  */ 0],
]

const colors = ["#181344", "#FFFFFF", "#6dc52e", "#ad99e0", "#ffc702"];
let cursorIndex = 0;
const ScorePropagation = createContext(0);

function computeResult(){
    let sum = 0;
    let x1; // pixel above, to the right
    let x2; // pixel above, to the left
    let y; // current pixel
    let z1; // pixel below, to the left
    let z2; // pixel below, to the right

    // EVEN ROWS
    for(let i = 5; i>=0; i--){
        for(let j = 0; j<6; j++){
            y = matrix[i*2+1][j]; // current pixel
            x1 = matrix[i*2][j]; // pixel above, to the left
            x2 = matrix[i*2][j+1]; // pixel above, to the right
            if(i<5) z1 = matrix[(i+1)*2][j]; // pixel below, to the left
            if(i<5) z2 = matrix[(i+1)*2][j+1]; // pixel below, to the right

            if(y>1 && y===x1 && y===x2) sum++; // check if same above
            if(y>1 && x1>1 && x2>1 && y!==x1 && y!==x2 && x1!==x2) sum++; // check if different above
            if(i<5) if(y>1 && y===z1 && y===z2) sum++; // check if same below
            if(i<5) if(y>1 && z1>1 && z2>1 && y!==z1 && y!==z2 && x1!==z2) sum++; // check if different below
        }
    }
    
    // ODD ROWS
    for(let i = 0; i<6; i++){
        for(let j = 1; j<6; j++){
            y = matrix[i*2][j]; // current pixel
            if(y>1) x2 = matrix[i*2-1][j-1]; // pixel above, to the left
            if(y>1) x1 = matrix[i*2-1][j]; // pixel above, to the right
            z1 = matrix[i*2+1][j-1] // pixel below, to the left
            z2 = matrix[i*2+1][j]; // pixel below, to the right

            if(i>0) if(y>1 && y===x1 && y===x2) sum++; // check if same above
            if(i>0) if(y>1 && x1>1 && x2>1 && y!==x1 && y!==x2 && x1!==x2) sum++; // check if different above
            if(y>1 && y===z1 && y===z2) sum++; // check if same below
            if(y>1 && z1>1 && z2>1 && y!==z1 && y!==z2 && z1!==z2) sum++; // check if different below
        }
    }

    return sum;
}



function PixelBefore({state}){
    return(
        <div style = {{
            content: "",
	        position: "absolute",
            top: "-17px",
           	left: 0,
           	width: 0,
           	height: 0,
           	borderLeft: "26px solid transparent",
           	borderRight: "26px solid transparent",
           	borderBottom: "19px solid",
            borderBottomColor: colors[state],
            }}
        />
    )
} 

function PixelAfter({state}){
    return(
        <div style = {{
            content: "",
	        position: "absolute",
            top: "28px",
           	left: 0,
           	width: 0,
           	height: 0,
           	borderLeft: "26px solid transparent",
           	borderRight: "26px solid transparent",
           	borderTop: "19px solid",
            borderTopColor: colors[state], 
            }}
        />
    )
} 

function Pixel({x, y}){
    const [state, setState] = useState(0);
    const {score, setScore} = useContext(ScorePropagation);
    function handleClick(){
        setState(cursorIndex);
        matrix[y][x] = cursorIndex;
        setScore(computeResult());
    }

    return (
    <button onClick = {handleClick} type = "button" className = "pixel" style = {{
            backgroundColor: colors[state],
        }}>
        <PixelBefore state = {state}/>   
        <PixelAfter state = {state}/>   
    </button>
    );
} 

function OddPixelRow({y}){
    const elements = [];
    for(let i = 0; i<7; i++){
        elements.push(<Pixel x = {i} y = {y}/>)
    }
    return(
    <div className = 'pixelrow'>
        {elements}
    </div> 
    );
} 

function EvenPixelRow({y}){
    const elements = [];
    for(let i = 0; i<6; i++){
        elements.push(<Pixel x = {i} y = {y}/>)
    }
    return(
    <div className = 'pixelrow'>
        {elements}
    </div> 
    );
} 

function ColorBlock({index}){
    function handleClick(){
        cursorIndex = index; 
    }
    return(
        <button type = "button" className = "colorblock" onClick = {handleClick} style = {{
            backgroundColor: colors[index],
            height:"100%",
            width:"100%",
            border:"none",
        }}/>
    )
}

function App() {
    const [score, setScore] = useState(0);
    const pixelRows = [];
    for(let i = 0; i<6; i++){
        pixelRows.push(<OddPixelRow y = {i*2}/>);
        pixelRows.push(<EvenPixelRow y = {i*2+1}/>);
    }
    const colorBlocks = [];
    for(let i = 0; i<5; i++){
        colorBlocks.push(<ColorBlock index = {i}/>);
    }
    return (
    <div className = 'container'>
        <div className = 'pallette'>
            {colorBlocks}
        </div>
        <div className = 'pixelbuttons'>
            <ScorePropagation.Provider value = {{score, setScore}}>
                {pixelRows}
            </ScorePropagation.Provider>
        </div>
        <h1 className = 'score'>Score: {score}</h1>
    </div>
    );
} 

export default App;

