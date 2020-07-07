/*
 * A chain drive (made up of connected adjacent vertices on the grid)
 * ------------------------------------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      7th July, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/ChainDrive
 * @codepen:   https://codepen.io/niitettehtsuru/pen/gOPeRMN
 * @license:   GNU General Public License v3.0 
 */
class ChainDrive
{ 
    constructor(data)
    {         
        this.radius = data.radius; 
        this.xCoord = data.vertex.x;
        this.yCoord = data.vertex.y;   
        this.size   = data.vertex.size;//length and breadth of the square in the grid
        this.horizontalOffset = data.horizontalOffset; 
        this.verticalOffset = data.verticalOffset;
        this.screenWidth = data.screenWidth; 
        this.screenHeight = data.screenHeight;    
        this.unitDistance = 10;//distance moved per animation frame   
        this.currentVertex = {x:this.xCoord,y:this.yCoord}; 
        this.body = [this.currentVertex];
        this.speed   = this.setInitialSpeed();
        this.nextVertex = this.getNextVertex();//the next point to move towards
        this.chainDriveLength = 7;//the number of connected vertices that make up a chain drive 
        this.lineDashDelta = 3;//amount of space to leave between adjacent lines when drawing dashed lines.  
    }  
    getNextVertex()//get the next point to move towards
    {
        let nextVertex = {x:0,y:0}; 
        if(this.speed.x > 0)//if head of chain drive is moving right
        {
            nextVertex = {x:this.xCoord + this.size,y:this.yCoord}; 
        }
        else if(this.speed.x < 0)//if head of chain drive is moving left
        {
            nextVertex = {x:this.xCoord - this.size,y:this.yCoord}; 
        } 
        if(this.speed.y > 0)//if head of chain drive is moving down
        {
            nextVertex = {x:this.xCoord,y:this.yCoord + this.size}; 
        }
        else if(this.speed.y < 0)//if head of chain drive is moving up
        {
            nextVertex = {x:this.xCoord,y:this.yCoord - this.size}; 
        }  
        return nextVertex; 
    }
    //Sets the speed at start. Head of chain drive is set to only move perpendicular to the x-axis or the y-axis. 
    setInitialSpeed()
    {
        let x = 0;
        let y = 0;
        //flip a coin to decide if head of chain drive moves horizontally or vertically 
        if(Math.random() > 0.5)//for horizontal movement    
        {   //flip a coin to decide if head of chain drive moves left or right 
            x = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        }
        else//for vertical movement
        {   //flip a coin to decide if head of chain drive moves upwards or downwards
            y = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        } 
        return {x:x,y:y};  
    } 
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    //randomly set the head of the chain drive to move up,down,right or left
    setRandomNewDirection() 
    {
        let directions = ['up','down','left','right'];
        let direction = ~~this.getRandomNumber(0, directions.length);; 
        switch(directions[direction])
        {
            case 'up':
                this.speed.x = 0; 
                this.speed.y = -this.unitDistance; 
                break; 
            case 'down': 
                this.speed.x = 0; 
                this.speed.y = this.unitDistance; 
                break; 
            case 'left': 
                this.speed.x = -this.unitDistance; 
                this.speed.y = 0; 
                break; 
            case 'right':
                this.speed.x = +this.unitDistance; 
                this.speed.y = 0;
                break;  
        }
    }  
    nextVertexIsOnTheGrid(nextVertex)
    {     
        if
        (
            nextVertex.x < this.horizontalOffset ||//vertex is beyond the left wall 
            nextVertex.x > this.screenWidth - this.horizontalOffset||//vertex is beyond the right wall 
            nextVertex.y < this.verticalOffset ||//vertex is beyond the top wall 
            nextVertex.y > this.screenHeight - this.verticalOffset//vertex is beyond the bottom wall
        )
        { 
            return false;//vertex is outside the grid
        }   
        return true;  
    } 
    checkIfNextVertexIsReached() 
    { 
        //get the distance between the head of the chain drive and the next vertex
        let dx = this.nextVertex.x - this.xCoord; 
        let dy = this.nextVertex.y - this.yCoord;
        let distance = Math.sqrt(dx * dx + dy * dy);  
        //if the distance is not more than a step away, the next vertex is reached
        if(distance <= this.unitDistance)
        { 
            //push the head of the chain drive to the next vertex
            this.xCoord = this.nextVertex.x; 
            this.yCoord = this.nextVertex.y;     
            //once the destination is reached, the current vertex becomes the next vertex
            this.currentVertex = this.nextVertex;
            this.setRandomNewDirection();//set to go either up, down, left or right 
            //get a new next vertex based on the current heading
            this.nextVertex = this.getNextVertex();
            while(!this.nextVertexIsOnTheGrid(this.nextVertex))//make sure the next vertex is on the grid
            {
                this.setRandomNewDirection();
                this.nextVertex = this.getNextVertex();
            }
            this.body.push(this.currentVertex);//add the new vertex to the body  
            if(this.body.length > this.chainDriveLength)//if body is too long
            {
                this.body.shift();//strip the tail 
            }
            return true; 
        }
        return false;  
    } 
    update()
    {       
        //keep the head of the chain drive moving in its current direction 
        this.xCoord += this.speed.x;//if head of the chain drive is going left or right, keep it going
        this.yCoord += this.speed.y;//if head of the chain drive is going up or down, keep it going    
        this.checkIfNextVertexIsReached();
        //this animates the chain
        this.lineDashDelta-=0.1; 
        if(this.lineDashDelta < 2) 
        {
            this.lineDashDelta = 3;
        } 
    } 
    draw()//draw the chain drive
    {     
        let radius = this.radius;  
        //draw the head of the chain drive 
        stroke('white');   
        ellipse(this.xCoord,this.yCoord,radius*2,radius*2);
        fill('black');   
        ellipse(this.xCoord,this.yCoord,radius,radius); 
        //draw circles at each vertex that make up the body
        this.body.forEach(function(body)
        {    
            stroke('white');   
            ellipse(body.x,body.y,radius*2,radius*2);
            fill('black'); 
            ellipse(body.x,body.y,radius,radius);  
        }); 
        //draw the lines connecting the vertices that make up the body
        stroke('white');  
        let xCoord = this.xCoord; 
        let yCoord = this.yCoord; 
        if(this.body.length > 2)
        { 
            for(let i = 0; i < this.body.length;i++)
            {
                if(i === this.body.length-1)//draw lines from the most recent vertex to the head
                {
                    let prev = this.body[i];
                    let next = {x:xCoord,y:yCoord}; 
                    this.drawLinesBetweenVertices(prev,next);
                }
                else//draw lines to connect adjacent vertices in the body
                {
                    let prev = this.body[i];
                    let next = this.body[i+1]; 
                    this.drawLinesBetweenVertices(prev,next);
                } 
            } 
        }  
        noStroke();  
    }  
    //draws 3 lines to link one adjacent vertex in the body to the next
    drawLinesBetweenVertices(prevPoint,nextPoint) 
    {  
        if(prevPoint.x < nextPoint.x || //if previous point is to the left of next point
                prevPoint.x > nextPoint.x)//or previous point is to the right of next point
        {
            //draw top line 
            this.linedash(prevPoint.x, prevPoint.y - this.radius,nextPoint.x,nextPoint.y-this.radius,this.lineDashDelta) ;
            //draw bottom line 
            this.linedash(prevPoint.x, prevPoint.y + this.radius,nextPoint.x,nextPoint.y+this.radius,this.lineDashDelta) ;
            //draw middle line  
            this.linedash(prevPoint.x, prevPoint.y,nextPoint.x,nextPoint.y,this.lineDashDelta) ;
        } 
        else if(prevPoint.y < nextPoint.y || //if previous point is above next point
                prevPoint.y > nextPoint.y)//or previous point is below next point
        {
            //draw left line 
            this.linedash(prevPoint.x - this.radius, prevPoint.y,nextPoint.x - this.radius,nextPoint.y,this.lineDashDelta) ;
            //draw right line
            this.linedash(prevPoint.x + this.radius, prevPoint.y,nextPoint.x + this.radius,nextPoint.y,this.lineDashDelta) ; 
            //draw middle line 
            this.linedash(prevPoint.x, prevPoint.y,nextPoint.x,nextPoint.y,this.lineDashDelta) ; 
        } 
    } 
    /**
    * Draws a dashed line
    * source:https://github.com/processing/p5.js/issues/3336
    * @param  {number} x1 the x-coordinate of the first point
    * @param  {number} y1 the y-coordinate of the first point
    * @param  {number} x2 the x-coordinate of the second point
    * @param  {number} y2 the y-coordinate of the second point 
    * @param  {number} delta the length of (and between) 2 dashes/points
    * @param  {String} style '-' for a dashline, '.'for dots, 'o'for bigger dots (rounds)
    */
    linedash(x1, y1, x2, y2, delta, style = '-') 
    {
        // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
        let distance = dist(x1,y1,x2,y2);
        let dashNumber = distance/delta;
        let xDelta = (x2-x1)/dashNumber;
        let yDelta = (y2-y1)/dashNumber;
 
        for (let i = 0; i < dashNumber; i+= 2)  
        {
            let xi1 = i*xDelta + x1;
            let yi1 = i*yDelta + y1;
            let xi2 = (i+1)*xDelta + x1;
            let yi2 = (i+1)*yDelta + y1;

            if (style === '-') 
            { 
                line(xi1, yi1, xi2, yi2); 
            }
            else if (style === '.') 
            { 
                point(xi1, yi1);  
            }
            else if (style === 'o') 
            { 
                ellipse(xi1, yi1, delta/2); 
            }
          }
    }
} 
 