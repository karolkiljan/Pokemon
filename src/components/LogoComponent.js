import React from "react";
import {createUseStyles} from "react-jss";
import logo from "../pictures/pokemonLogo.png";

const LogoComponent = () => {
    const classes = useStyles()
    return <div className={classes.Logo}/>
}

const useStyles = createUseStyles({
    Logo: {
        height: '15%',
        backgroundImage: `url(${logo})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
})

export default LogoComponent
