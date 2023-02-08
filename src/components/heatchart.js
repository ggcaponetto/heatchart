function Heatchart(){
    this.version = "0.0.1";
    this.canvas = null;
    this.context = null;
    this.init = function init(options={
        id: "heat-chart",
        height: 400
    }){
        options = Object.assign( {
            id: "heat-chart",
            height: 400
        }, options)
        const initialize = () => {
            const canvas = document.getElementById(options.id);
            if(!!canvas === false){
                throw new Error(`Did not find a canvas with id "${options.id}" to initialize`);
            }
            const ctx = canvas.getContext("2d");
            this.context = ctx;
            this.canvas = ctx.canvas; // HTMLCanvasElement

            this.canvas.width = options.width || canvas.parentElement.getBoundingClientRect().width;
            this.canvas.height = options.height;
        }
        try {
            initialize();
        } catch (e){
            console.warn(e.message);
            console.warn("Trying to load after DOM fully loaded.");
            window.onload = function (){
                initialize();
            }
        }
    }
    this.drawPixel = function drawPixel(x, y, color) {
        let roundedX = Math.round(x);
        let roundedY = Math.round(y);
        this.context.fillStyle = color || '#000';
        this.context.fillRect(roundedX, roundedY, 1, 1);
    }

    this.getCellDimensions = function getCellDimensions(horizontalCells, verticalCells){
        let cellWidth = this.canvas.width / horizontalCells;
        let cellHeight = this.canvas.height / verticalCells;
        return {
            width: cellWidth, height: cellHeight, canvasWidth: this.canvas.width, canvasHeight: this.canvas.height
        }
    }
    this.getRandomHEXColor = function getRandomHEXColor (){return "#" + Math.floor(Math.random()*16777215).toString(16)};

    this.fillCells = function fillCells(xCount, yCount){
        let cellDimensions = this.getCellDimensions(xCount, yCount);

        let colors = [];
        for(let x = 0; x < xCount; x++){
            colors.push([]);
            for(let y = 0; y < yCount; y++){
                colors[x].push(this.getRandomHEXColor())
            }
        }

        console.log("colors", {
            colors, cellDimensions, xCount, yCount
        })

        let yColorIndex = null;
        let xColorIndex = null;
        let y = null;
        let x = null;
        let color = null;
        let imageData = [];
        try {
            for(x = 0; x < this.canvas.width; x++){
                xColorIndex = Math.floor(x/cellDimensions.width); // quotient
                for(y = 0; y < this.canvas.height; y++){
                    yColorIndex = Math.floor(y/cellDimensions.height); // quotient
                    color = colors[xColorIndex][yColorIndex];
                    // this.drawPixel(x, y, color)
                }
            }
        } catch (e){
            console.warn("error drawing pixel", {
                colors, cellDimensions, xCount, yCount, yColorIndex, xColorIndex, x, y, color, e
            })
            // this.drawPixel(x, y, "#FFFFFF")
        }
        this.context.putImageData(new ImageData(this.canvas.width, this.canvas.height));
    }

    this.runFrames = function runFrames(x, y, maxFrames){
        let tempTimestamp;
        let frameCount = 1;
        let handle = setInterval(() => {
            tempTimestamp = performance.now();
            this.fillCells(2, 2);
            const elapsed = performance.now() - tempTimestamp;
            console.log(`[${Math.floor(1000/elapsed)} fps] Canvas drawed in ${Math.floor(elapsed)}ms`);
            frameCount = frameCount + 1;
            if(frameCount === maxFrames) {
                clearInterval(handle);
                console.log(`[${Math.floor(1000/elapsed)} fps] Canvas drawed in ${Math.floor(elapsed)}ms - stopped after ${maxFrames} frames.`);
            }
        }, 0)
    }
    return this;
}

window["heatchart"] = Heatchart;
export default {
    Heatchart
};