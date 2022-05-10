import React, { Component } from 'react'
import "./ContextMenu.scss"

export class ContextMenu extends Component{


    constructor(props) {
          
        super(props);

        
        this.state = {
            toggleMenu : false
        }

    }
    componentDidMount () {
        console.log("context menu loaded")
    }

    componentDidUpdate (prevProps) {

        if(this.props.menuToggled !== prevProps.menuToggled){
            this.setState({toggleMenu : this.props.menuToggled})
            
        }
        console.log("context menu after updation" + this.state.toggleMenu)
        console.log(this.state.toggleMenu ? 'menuActive' : 'menuHidden')
    }


    render() {
        //this is where the team blocky thing should be rendered
       
        return(
        <div>
            <nav className = {this.state.toggleMenu ? "menuActive" : "menuHidden"}>
            <ul>
                <li>Delete Column</li>
                <li>Second value lol</li>
            </ul>
            </nav>            

        </div>
        );


    }
 

}