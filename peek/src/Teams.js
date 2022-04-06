import {TBA} from './TBA'
import React from 'react'
   
var qualities;

export class Teams {


    constructor(googleSheetHeaders, rank) {
          

        const stringy = Object.assign(googleSheetHeaders, rank)

        this.qualities = JSON.stringify(stringy)

        //this.getData = this.getData.bind(this);

    }

    printQualities() {
        console.log(this.qualities)
    }
 

 

}