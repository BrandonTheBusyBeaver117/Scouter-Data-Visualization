import React, { Component } from 'react'
import "./ContextMenu.scss"

export class ContextMenu extends Component{


    constructor(props) {
          
        super(props);

        
        this.state = {
            toggleMenu : false,
            xPosition: -9999,
            yPosition: -9999,
            clicked: false,
        }

    }
    componentDidMount () {
        console.log("context menu loaded")
        
    }

    componentDidUpdate (prevProps) {

        if(this.props !== prevProps){

            this.setState({
                toggleMenu : this.props.menuToggled,
                xPosition : this.props.mouseX,
                yPosition : this.props.mouseY,
                clicked : this.props.clicked,
            })

        }
        //console.log("context menu after updation" + this.state.toggleMenu)
        //console.log(this.state.toggleMenu ? 'menuActive' : 'menuHidden')
    }

    


    render() {
        //this is where the team blocky thing should be rendered
       
        return(
            
        <div className = {this.state.toggleMenu ? "menuActive" : "menuHidden"}>
            <nav style={{ top: this.state.yPosition, left: this.state.xPosition }}>
                <ul>
                    <li onClick = {this.props.deleteColumn}>Delete Column</li>
                    <li>Graph this point</li>
                    <li></li>
                </ul>
            </nav>            

        </div>
        );


    }
 

}