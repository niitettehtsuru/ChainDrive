/*
 * Sets everything up
 * ------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      7th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/ChainDrive
 * @codepen:   https://codepen.io/niitettehtsuru/pen/gOPeRMN
 * @license:   GNU General Public License v3.0 
 */
let  
chainDrives = [],
numOfChainDrives = 20,//~~getRandomNumber(1,20),
radius = 10,//radius of the connected nodes that form the chain drive 
blockSize = 50,//length and breadth of a square in the grid 
horizontalOffset = 0, 
verticalOffset = 0,
backgroundColor = 'rgba(0,0,0,1)';//black 
//get the width and height of the browser window 
function getBrowserWindowSize() 
{
    let 
    win = window,
    doc = document,
    offset = 20,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;  
    return {width:browserWindowWidth-offset,height:browserWindowHeight-offset}; 
} 
/**
* Returns a random number between min (inclusive) and max (exclusive)
* @param  {number} min The lesser of the two numbers. 
* @param  {number} max The greater of the two numbers.  
* @return {number} A random number between min (inclusive) and max (exclusive)
*/
function getRandomNumber(min, max) 
{
    return Math.random() * (max - min) + min;
} 
/*Prepare the grid
 *----------------
 *Divide the canvas into square blocks  and get the upper left vertex of each square 
*/
function getGridVertices(blockSize,windowSize) 
{
    let gridVertices = [];  
    //How many squares can be set on the canvas horizontally?
    let numHorizontal = ~~(windowSize.width/blockSize);//num of squares that can be packed horizontally
    let horizontalRemainder = windowSize.width - blockSize * numHorizontal;//the space left when all squares are packed
    horizontalOffset = horizontalRemainder/2;//so an equal space is at the left and right ends of the grid
    //How many squares can be set on the canvas vertically? 
    let numVertical = ~~(windowSize.height/blockSize);//num of squares that can be packed vertically
    let verticalRemainder = windowSize.height - blockSize * numVertical;//the space left when all squares are packed  
    verticalOffset = verticalRemainder/2;//so an equal space is at the top and bottom ends of the grid  
    //get all points in the grid, starting from the top to the bottom
    for(let y = verticalOffset; y < windowSize.height; y+=blockSize)
    {  
        if(y+ blockSize > windowSize.height)//if the next point is beyond the bottom edge of the canvas
        {    
            continue; //ignore it
        } 
        //all the while, getting all the horizontal points at each level
        for(let x = horizontalOffset; x < windowSize.width; x+=blockSize) 
        {  
            if(x+blockSize > windowSize.width)//if the next point is beyond the right edge of the canvas
            { 
                continue; //ignore it 
            }  
            gridVertices.push({x:x,y:y,size:blockSize}); 
        }   
    } 
    return gridVertices; 
} 
function createChainDrives(numOfChainDrives,vertices,width,height)
{
    let chainDrives = [];
    for(let i = 0; i < numOfChainDrives;i++)
    { 
        let index =  ~~((Math.random() * (vertices.length-1)) + 1);
        let vertex = vertices[index];//pick a random vertex for the chain drive's initial position  
        let data = 
        {
            vertex:vertex,  
            horizontalOffset:horizontalOffset,
            verticalOffset:verticalOffset,
            screenWidth:width,
            screenHeight:height,
            radius:radius
        };  
        chainDrives.push(new ChainDrive(data));
    }
    return chainDrives; 
} 
function setNewGrid()//reset the grid
{ 
    chainDrives = [];//get rid of all the chain drives
    numOfChainDrives = ~~getRandomNumber(1,20); 
    let browserWindowSize = getBrowserWindowSize();   
    let vertices = getGridVertices(blockSize,browserWindowSize);  
    //create new chain drives 
    chainDrives = createChainDrives(numOfChainDrives,vertices,width,height); 
    background(backgroundColor);
} 
function setup() 
{
    let browserWindowSize = getBrowserWindowSize();  
    createCanvas(browserWindowSize.width,browserWindowSize.height); 
    let vertices = getGridVertices(blockSize,browserWindowSize); 
    chainDrives = createChainDrives(numOfChainDrives,vertices,width,height);  
    document.addEventListener('click',(event)=>//when canvas is clicked,
    {    
        setNewGrid();
    });
    window.addEventListener('resize',function()//when browser window is resized
    { 
        let browserWindowSize = getBrowserWindowSize(); 
        resizeCanvas(browserWindowSize.width,browserWindowSize.height); 
        setNewGrid(); 
    }); 
}  
function draw() 
{   
    background(backgroundColor);   
    chainDrives.forEach(function(chainDrive) 
    {  
        chainDrive.update();
        chainDrive.draw(); 
    });   
}