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
            id: "heat-chart",
            height: 400
        }){
            options = Object.assign( {
                id: "heat-chart",
                height: 400
            }, options);
            const initialize = () => {
                const canvas = document.getElementById(options.id);
                if(!!canvas === false){
                    throw new Error(`Did not find a canvas with id "${options.id}" to initialize`);
                }
                const ctx = canvas.getContext("2d");
                this.context = ctx;
                this.canvas = ctx.canvas; // HTMLCanvasElement

                this.canvas.width = canvas.parentElement.getBoundingClientRect().width;
                this.canvas.height = options.height;
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

        this.fill = function fill(color){
            for(let y = 0; y < this.canvas.height; y++){
                for(let x = 0; x < this.canvas.width; x++){
                    this.drawPixel(x, y, color);
                }
            }
        };

        this.getCellDimensions = function (horizontalCells, verticalCells){
            let cellWidth = Math.floor(this.canvas.width / horizontalCells);
            let cellHeight = Math.floor(this.canvas.height / verticalCells);
            return {
                width: cellWidth, height: cellHeight, canvasWidth: this.canvas.width, canvasHeight: this.canvas.height
            }
        };
        this.getRandomHEXColor = () => "#" + Math.floor(Math.random()*16777215).toString(16);

        this.fillCells = function fillCells(xCount, yCount){
            let cellDimensions = this.getCellDimensions(xCount, yCount);

            let colors = [];
            for(let x = 0; x < xCount; x++){
                colors.push([]);
                for(let y = 0; x < yCount; y++){
                    colors[x].push(this.getRandomHEXColor());
                }
            }

            console.log("colors", {
                colors, cellDimensions, xCount, yCount
            });

            let yColorIndex = null;
            let xColorIndex = null;
            let y = null;
            let x = null;
            let color = null;
            try {
                for(y = 0; y < this.canvas.height; y++){
                    yColorIndex = Math.floor(y/cellDimensions.height); // quotient
                    for(x = 0; x < this.canvas.width; x++){
                        xColorIndex = Math.floor(x/cellDimensions.width); // quotient
                        color = colors[xColorIndex][yColorIndex];
                        this.drawPixel(x, y, color);
                    }
                }
            } catch (e){
                console.warn(e);
                console.warn("colors", {
                    colors, cellDimensions, xCount, yCount, yColorIndex, xColorIndex, x, y, color
                });
            }
        };
        return this;
    }

    window["heatchart"] = Heatchart;
    var heatchart = {
        Heatchart
    };

    return heatchart;

}));
