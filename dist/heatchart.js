(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.heatchart = factory());
})(this, (function () { 'use strict';

    function Heatchart(){
        this.version = "0.0.1";
        this.canvas = null;
        this.context = null;
        this.init = function init(options={
            id: "heat-chart"
        }){
            options = Object.assign( {
                id: "heat-chart"
            }, options);
            const initialize = () => {
                const canvas = document.getElementById(options.id);
                if(!!canvas === false){
                    throw new Error(`Did not find a canvas with id "${options.id}" to initialize`);
                }
                const ctx = canvas.getContext("2d");
                this.context = ctx;
                this.canvas = ctx.canvas; // HTMLCanvasElement

                let parentBoundingClientRect = canvas.parentElement.getBoundingClientRect();
                this.canvas.width = options.width || parentBoundingClientRect.width;
                this.canvas.height = options.height || parentBoundingClientRect.height;
            };
            try {
                initialize();
            } catch (e){
                console.warn(e.message);
                console.warn("Trying to load after DOM fully loaded.");
                window.onload = function (){
                    initialize();
                };
            }
        };
        this.drawPixel = function drawPixel(x, y, color) {
            let roundedX = Math.round(x);
            let roundedY = Math.round(y);
            this.context.fillStyle = color || '#000';
            this.context.fillRect(roundedX, roundedY, 1, 1);
        };

        this.getCellDimensions = function getCellDimensions(horizontalCells, verticalCells){
            let cellWidth = this.canvas.width / horizontalCells;
            let cellHeight = this.canvas.height / verticalCells;
            return {
                width: cellWidth, height: cellHeight, canvasWidth: this.canvas.width, canvasHeight: this.canvas.height
            }
        };
        this.getRandomHEXColor = function getRandomHEXColor (){return "#" + Math.floor(Math.random()*16777215).toString(16)};

        this.hexToRgb = function hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        this.rgbToHex = function rgbToHex(r, g, b) {
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        };

        this.fillCells = function fillCells(xCount, yCount){
            let cellDimensions = this.getCellDimensions(xCount, yCount);

            let colors = [];
            for(let x = 0; x < xCount; x++){
                colors.push([]);
                for(let y = 0; y < yCount; y++){
                    let rgb = this.hexToRgb(this.getRandomHEXColor());
                    colors[x].push(rgb);
                }
            }

            let yColorIndex = null;
            let xColorIndex = null;
            let y = null;
            let x = null;
            let color = null;
            let imageDataArray = new Uint8ClampedArray(this.canvas.width * this.canvas.height * 4);
            let pixelCounter = 0;
            for(x = 0; x < this.canvas.width; x++){
                xColorIndex = Math.floor(x/cellDimensions.width); // quotient
                for(y = 0; y < this.canvas.height; y++){
                    yColorIndex = Math.floor(y/cellDimensions.height); // quotient
                    color = colors[xColorIndex][yColorIndex];
                    if(color){
                        // RGBA
                        imageDataArray[pixelCounter++] = color.r;
                        imageDataArray[pixelCounter++] = color.g;
                        imageDataArray[pixelCounter++] = color.b;
                        imageDataArray[pixelCounter++] = 255;
                    }
                }
            }
            let imageData = new ImageData(imageDataArray, this.canvas.width, this.canvas.height);
            this.context.putImageData(imageData, 0, 0);
        };

        this.runFrames = function runFrames(x, y, maxSeconds){
            let initialStart = performance.now();
            const playAnimation = (time) => {
                performance.now() - time;
                this.fillCells(x, y);
                // console.log(`[${Math.floor(1000/delta)} fps] Canvas drawed in ${Math.floor(delta)}ms`);
                if(performance.now() - initialStart < 1000 * maxSeconds){
                    window.requestAnimationFrame(playAnimation);
                }
            };
            window.requestAnimationFrame(playAnimation);
        };
        return this;
    }

    window["heatchart"] = Heatchart;
    var heatchart = {
        Heatchart
    };

    return heatchart;

}));
